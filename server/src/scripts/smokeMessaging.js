/* eslint-disable no-console */

const path = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");

// socket.io-client is installed in the client workspace, not hoisted.
const { io } = require("../../../client/node_modules/socket.io-client");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const DEFAULT_PORT = process.env.PORT || "5001";
const API_BASE_URL =
  process.env.API_BASE_URL || `http://localhost:${DEFAULT_PORT}`;
const ORIGIN = process.env.SMOKE_ORIGIN || "http://localhost:5174";

const jsonRequest = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  return data;
};

const login = async (email, password) => {
  const data = await jsonRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (!data?.accessToken) {
    throw new Error(`Login did not return accessToken for ${email}`);
  }
  return data.accessToken;
};

const connectAuthedSocket = (token) => {
  const socket = io(API_BASE_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: { token },
    extraHeaders: {
      Origin: ORIGIN,
    },
    timeout: 5000,
  });
  return socket;
};

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

const main = async () => {
  console.log(`API_BASE_URL=${API_BASE_URL}`);
  console.log(`ORIGIN=${ORIGIN}`);

  const [adminToken, adopterToken] = await Promise.all([
    login("admin@petadopt.com", "password"),
    login("adopter@petadopt.com", "password"),
  ]);

  const users = await jsonRequest("/api/users", { token: adminToken });
  const adopter = (users?.data || []).find((user) => user.email === "adopter@petadopt.com");
  if (!adopter?._id) {
    throw new Error("Could not find adopter user in /api/users");
  }

  const conversationResponse = await jsonRequest("/api/messages/conversations", {
    method: "POST",
    token: adminToken,
    body: {
      participantIds: [adopter._id],
    },
  });

  const conversationId = conversationResponse?.data?._id;
  if (!conversationId) {
    throw new Error("Failed to create/find conversation");
  }

  const adminSocket = connectAuthedSocket(adminToken);
  const adopterSocket = connectAuthedSocket(adopterToken);

  await Promise.all([
    waitForEvent(adminSocket, "connect", 5000),
    waitForEvent(adopterSocket, "connect", 5000),
  ]);

  adminSocket.emit("conversation:join", conversationId);
  adopterSocket.emit("conversation:join", conversationId);

  // Give the server a moment to register room joins.
  await delay(150);

  const content = `smoke-test ${new Date().toISOString()}`;
  const receivedPromise = waitForEvent(adopterSocket, "message:received", 5000);

  const sent = await jsonRequest(`/api/messages/${conversationId}`, {
    method: "POST",
    token: adminToken,
    body: { content },
  });

  const received = await receivedPromise;

  const receivedContent = received?.content;
  const sentContent = sent?.data?.content;

  if (receivedContent !== content || sentContent !== content) {
    throw new Error(
      `Message mismatch. sent=${JSON.stringify(sentContent)} received=${JSON.stringify(receivedContent)}`
    );
  }

  console.log("Messaging smoke test OK:", { conversationId });

  adminSocket.disconnect();
  adopterSocket.disconnect();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Messaging smoke test FAILED:", error?.message || error);
    if (error?.payload) {
      console.error("payload:", JSON.stringify(error.payload, null, 2));
    }
    process.exit(1);
  });
