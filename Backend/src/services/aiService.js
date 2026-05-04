import dotenv from "dotenv";
import { Mistral } from "@mistralai/mistralai";

dotenv.config();

const mistralApiKey = process.env.MISTRAL_API_KEY;
const mistralModel = process.env.MISTRAL_MODEL || "mistral-small-latest";

let mistral = null;

if (mistralApiKey) {
  mistral = new Mistral({ apiKey: mistralApiKey });
  console.log("Mistral connected");
} else {
  console.log("Mistral not configured - using mock AI");
}

const getMessageText = (messageContent) => {
  if (typeof messageContent === "string") {
    return messageContent.trim();
  }

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((item) => item?.text || item?.content || "")
      .join("")
      .trim();
  }

  return "";
};

const generateMistralText = async (
  userContent,
  systemContent,
  options = {}
) => {
  const response = await mistral.chat.complete({
    model: mistralModel,
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    temperature: 0.4,
    ...options,
  });

  return getMessageText(response.choices?.[0]?.message?.content);
};

const getMockClassification = (text) => {
  const lower = text.toLowerCase();

  return {
    priority: lower.includes("urgent")
      ? "high"
      : lower.includes("issue")
      ? "medium"
      : "low",
    category: lower.includes("login")
      ? "login"
      : lower.includes("payment")
      ? "payment"
      : lower.includes("error")
      ? "bug"
      : "other",
  };
};

const parseClassification = (rawText) => {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

  const priority = ["high", "medium", "low"].includes(parsed.priority)
    ? parsed.priority
    : "low";
  const category = ["login", "payment", "bug", "other"].includes(
    parsed.category
  )
    ? parsed.category
    : "other";

  return { priority, category };
};

export const generateReply = async (message) => {
  try {
    if (!mistral) {
      return "Thanks for reaching out. Our support team will assist you shortly.";
    }

    return await generateMistralText(
      message,
      "You are a helpful customer support chatbot. Give short, clear, friendly answers."
    );
  } catch (err) {
    console.error("Mistral Reply Error:", err.message || err);

    return "Sorry, we couldn't generate a reply right now.";
  }
};

export const classifyTicket = async (text) => {
  try {
    if (!mistral) {
      return getMockClassification(text);
    }

    const rawClassification = await generateMistralText(
      text,
      "Classify this support ticket. Return only valid JSON with priority as high, medium, or low and category as login, payment, bug, or other.",
      {
        temperature: 0,
        responseFormat: { type: "json_object" },
      }
    );

    return parseClassification(rawClassification);
  } catch (err) {
    console.error("Mistral Classification Error:", err.message || err);

    return {
      priority: "low",
      category: "other",
    };
  }
};
