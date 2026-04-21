/* eslint-disable no-console */

const path = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");
const { io } = require("../../../client/node_modules/socket.io-client");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const DEFAULT_PORT = process.env.PORT || "5001";
const API_BASE_URL =
  process.env.API_BASE_URL || `http://localhost:${DEFAULT_PORT}`;
const ORIGIN = process.env.SMOKE_ORIGIN || "http://localhost:5174";

const jsonRequest = async (path, { method = "GET", token, cookie, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      "Content-Type": "application/json",
      Origin: ORIGIN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || `${method} ${path} failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return { data, setCookie: response.headers.get("set-cookie") };
};

const login = async (email, password) => {
  const { data, setCookie } = await jsonRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (!data?.accessToken) {
    throw new Error(`Login did not return accessToken for ${email}`);
  }
  // We only need refreshToken cookie value for refresh test.
  const refreshCookie = (setCookie || "")
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.startsWith("refreshToken="));
  return { token: data.accessToken, refreshCookie: refreshCookie || null, user: data.user };
};

const connectAuthedSocket = (token) =>
  io(API_BASE_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: { token },
    extraHeaders: { Origin: ORIGIN },
    timeout: 5000,
  });

const waitForEvent = (emitter, event, timeoutMs) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out waiting for event: ${event}`));
    }, timeoutMs);
    emitter.once(event, (payload) => {
      clearTimeout(timeoutId);
      resolve(payload);
    });
  });

const expectStatus = async (promise, expectedStatus) => {
  try {
    await promise;
    throw new Error(`Expected HTTP ${expectedStatus} but request succeeded`);
  } catch (error) {
    if (error?.status !== expectedStatus) {
      throw error;
    }
  }
};

const main = async () => {
  console.log(`API_BASE_URL=${API_BASE_URL}`);
  console.log(`ORIGIN=${ORIGIN}`);

  const [admin, staff, adopter] = await Promise.all([
    login("admin@petadopt.com", "password"),
    login("staff@petadopt.com", "password"),
    login("adopter@petadopt.com", "password"),
  ]);

  // Health / public
  await jsonRequest("/health");
  await jsonRequest("/api/stories");
  await jsonRequest("/api/pets?limit=1");

  // Auth refresh (expects refresh cookie)
  if (admin.refreshCookie) {
    await jsonRequest("/api/auth/refresh", { method: "POST", cookie: admin.refreshCookie });
  } else {
    console.warn("No refreshToken cookie captured; skipping refresh smoke check.");
  }

  // RBAC checks
  await jsonRequest("/api/analytics/overview", { token: admin.token });
  await expectStatus(jsonRequest("/api/analytics/overview", { token: staff.token }), 403);
  await expectStatus(jsonRequest("/api/analytics/overview", { token: adopter.token }), 403);

  // Create a story as staff, then delete it
  const storyTitle = `Smoke Story ${Date.now()}`;
  const createdStory = await jsonRequest("/api/stories", {
    method: "POST",
    token: staff.token,
    body: {
      title: storyTitle,
      summary: "Smoke story summary",
      content: "Smoke story content that is long enough to be valid.",
      image: "https://example.com/image.jpg",
      published: true,
    },
  });
  const storyId = createdStory?.data?.data?._id;
  if (!storyId) throw new Error("Story create did not return _id");
  await jsonRequest(`/api/stories/${storyId}`, {
    method: "PATCH",
    token: staff.token,
    body: { summary: "Updated by smoke test" },
  });
  await jsonRequest(`/api/stories/${storyId}`, { method: "DELETE", token: staff.token });

  // Create a pet (staff), move status to available (intake -> medical_hold -> available)
  const petName = `Smoke Pet ${Date.now()}`;
  const createdPet = await jsonRequest("/api/pets", {
    method: "POST",
    token: staff.token,
    body: {
      name: petName,
      species: "dog",
      breed: "Mixed",
      size: "medium",
      gender: "unknown",
      age: { years: 2, months: 3 },
      description: "A friendly smoke-test pet description.",
      intakeType: "rescued",
      shelter: {
        name: "Smoke Shelter",
        address: "123 Test Street",
        location: { coordinates: [77.5946, 12.9716] },
      },
      isNeutered: false,
      isMicrochipped: false,
    },
  });
  const petId = createdPet?.data?.data?._id;
  if (!petId) throw new Error("Pet create did not return _id");
  await jsonRequest(`/api/pets/${petId}/status`, {
    method: "PATCH",
    token: staff.token,
    body: { status: "medical_hold" },
  });
  await jsonRequest(`/api/pets/${petId}/status`, {
    method: "PATCH",
    token: staff.token,
    body: { status: "available" },
  });

  // Medical record (staff)
  await jsonRequest(`/api/medical/${petId}/records`, {
    method: "POST",
    token: staff.token,
    body: {
      type: "vaccination",
      title: "Smoke vaccination",
      notes: "Smoke test vaccination record",
      date: new Date().toISOString(),
    },
  });
  await jsonRequest(`/api/medical/${petId}/summary`);

  // Adoption application (adopter) + realtime notifications for staff
  const staffSocket = connectAuthedSocket(staff.token);
  const adminSocket = connectAuthedSocket(admin.token);
  await Promise.all([
    waitForEvent(staffSocket, "connect", 5000),
    waitForEvent(adminSocket, "connect", 5000),
  ]);

  // createNotification emits 'notification:new' to user room; also application submits emits 'application:submitted' to role rooms
  const staffNotificationPromise = waitForEvent(staffSocket, "notification:new", 5000);
  const adminNotificationPromise = waitForEvent(adminSocket, "notification:new", 5000);
  const staffAppSubmittedPromise = waitForEvent(staffSocket, "application:submitted", 5000);

  await jsonRequest("/api/applications", {
    method: "POST",
    token: adopter.token,
    body: {
      pet: petId,
      questionnaire: {
        housingType: "apartment",
        hasYard: false,
        householdAdults: 2,
        householdChildren: 0,
        otherPets: "none",
        previousPets: "yes",
        hoursAlonePerDay: 3,
        reasonForAdoption: "Smoke test application",
      },
    },
  });

  await Promise.all([
    Promise.any([staffNotificationPromise, adminNotificationPromise]),
    staffAppSubmittedPromise,
  ]);

  // Foster flow: adopter register -> staff approve -> staff assign -> staff return; check adopter notification realtime
  const adopterSocket = connectAuthedSocket(adopter.token);
  await waitForEvent(adopterSocket, "connect", 5000);

  try {
    const adopterNotificationPromise = waitForEvent(
      adopterSocket,
      "notification:new",
      5000
    );
    await jsonRequest("/api/foster/register", {
      method: "POST",
      token: adopter.token,
      body: {},
    });
    await adopterNotificationPromise;
  } catch (error) {
    // Allow re-running smoke tests against a DB that already has this adopter approved/registered.
    if (error?.message?.includes?.("already")) {
      console.warn("Skipping foster register step:", error.message);
    } else {
      throw error;
    }
  }

  await jsonRequest(`/api/foster/${adopter.user._id}/approve`, {
    method: "PATCH",
    token: staff.token,
    body: {},
  });

  const assignmentNotificationPromise = waitForEvent(adopterSocket, "notification:new", 5000);
  const assignment = await jsonRequest("/api/foster/assignments", {
    method: "POST",
    token: staff.token,
    body: {
      pet: petId,
      fosterParent: adopter.user._id,
      startDate: new Date().toISOString(),
      expectedEndDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      notes: "Smoke assignment",
    },
  });
  await assignmentNotificationPromise;

  const assignmentId = assignment?.data?.data?._id;
  if (!assignmentId) throw new Error("Foster assignment did not return _id");

  await jsonRequest(`/api/foster/assignments/${assignmentId}/return`, {
    method: "PATCH",
    token: staff.token,
    body: {},
  });

  // Cleanup sockets
  staffSocket.disconnect();
  adminSocket.disconnect();
  adopterSocket.disconnect();

  console.log("Feature smoke test OK");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Feature smoke test FAILED:", error?.message || error);
    if (error?.payload) {
      console.error("payload:", JSON.stringify(error.payload, null, 2));
    }
    process.exit(1);
  });
