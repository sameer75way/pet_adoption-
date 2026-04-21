import { Pet } from "../pet/pet.model";
import { getEnv } from "../../common/config/env.config";
import { serviceUnavailable } from "../../common/errors/httpErrors";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
};

const extractText = (response: GeminiResponse): string => {
  const parts = response.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text).filter(Boolean).join("\n").trim();
};

const buildAppContext = () => {
  return [
    "App routes:",
    "- Browse pets: /pets",
    "- Pet details: /pets/:id",
    "- Apply to adopt: /pets/:id/apply (login required)",
    "- Messages: /messages (login required)",
    "- Notifications: /notifications (login required)",
    "- Adopter dashboard: /adopter",
    "- Favorites: /adopter/favorites",
    "- Foster: /adopter/foster",
    "- Stories: /stories",
    "- FAQ: /faq",
    "",
    "General adoption flow:",
    "1) Browse pets",
    "2) Open a pet and click Apply",
    "3) Fill the application questionnaire",
    "4) Shelter staff reviews and updates status",
    "5) Use Messages/Notifications for updates",
  ].join("\n");
};

const findRelevantPets = async (message: string) => {
  const tokens = message
    .split(/[\s,.;:!?()]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 6);

  if (tokens.length === 0) {
    return [];
  }

  const species = ["dog", "cat", "rabbit", "bird", "other"] as const;
  const speciesToken = tokens.find((t) =>
    (species as readonly string[]).includes(t.toLowerCase())
  );

  const orClauses = tokens.map((token) => ({
    $or: [
      { name: { $regex: token, $options: "i" } },
      { breed: { $regex: token, $options: "i" } },
      { description: { $regex: token, $options: "i" } },
    ],
  }));

  const query: Record<string, unknown> = {
    deletedAt: null,
    ...(speciesToken ? { species: speciesToken.toLowerCase() } : {}),
    ...(orClauses.length ? { $and: orClauses } : {}),
  };

  return Pet.find(query)
    .select("name species breed age status shelter.name photos")
    .limit(5);
};

export const chatWithAssistant = async (params: {
  message: string;
  previousResponseId?: string;
  user?: { id: string; role: string; name?: string };
}) => {
  const env = getEnv();
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    throw serviceUnavailable(
      "AI chat is not configured. Set GEMINI_API_KEY on the server."
    );
  }

  const model = env.GEMINI_MODEL || "gemini-2.5-flash";

  const pets = await findRelevantPets(params.message);

  const instructions = [
    "You are PetAdopt's helpful assistant.",
    "Answer questions about pets in the database and about how to use this app.",
    "Be concise and practical. When listing pets, include name, species, breed, age, and adoption status.",
    "If you are unsure or the question needs account-specific data, ask a clarifying question.",
    "Do not claim to be a veterinarian; for medical concerns advise contacting the shelter/vet.",
    "",
    buildAppContext(),
    "",
    pets.length
      ? `Relevant pets (sample):\n${JSON.stringify(
          pets.map((p) => ({
            id: (p as any)._id,
            name: (p as any).name,
            species: (p as any).species,
            breed: (p as any).breed,
            age: (p as any).age,
            status: (p as any).status,
            shelter: (p as any).shelter?.name,
            hasPhoto: Boolean((p as any).photos?.[0]?.url),
          })),
          null,
          2
        )}`
      : "No relevant pets were found for this question.",
    "",
    params.user
      ? `User context: id=${params.user.id}, role=${params.user.role}, name=${params.user.name || ""}`
      : "User context: anonymous",
  ].join("\n");

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${instructions}\n\nUser question:\n${params.message}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  const json = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    const providerMessage =
      json?.error?.message || `Gemini request failed (${response.status})`;

    if (response.status === 401 || response.status === 403) {
      throw serviceUnavailable(
        `Gemini access denied. Check GEMINI_API_KEY and that the Gemini API is enabled for your project. Provider message: ${providerMessage}`
      );
    }

    if (response.status === 429) {
      throw serviceUnavailable(
        `Gemini rate limit exceeded. Please try again later. Provider message: ${providerMessage}`
      );
    }

    throw new Error(providerMessage);
  }

  const answer = extractText(json);

  return {
    answer: answer || "I couldn't generate an answer. Try rephrasing your question.",
    responseId: undefined,
  };
};
