// src/services/aiService.js

let openai = null;

// ✅ Initialize only if key exists
if (process.env.OPENAI_API_KEY) {
  const OpenAI = (await import("openai")).default;

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log("✅ OpenAI connected");
} else {
  console.log("⚠️ OpenAI not configured — using mock AI");
}

// 🤖 Generate reply
export const generateReply = async (message) => {
  try {
    // 🔹 Fallback if no API
    if (!openai) {
      return "Thanks for reaching out. Our support team will assist you shortly.";
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful customer support assistant. Give short, helpful answers.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error("AI Reply Error:", err);

    return "Sorry, we couldn’t generate a reply right now.";
  }
};

// 🏷️ Classify ticket
export const classifyTicket = async (text) => {
  try {
    // 🔹 Fallback logic
    if (!openai) {
      // simple keyword-based mock
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
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Classify ticket into priority (high/medium/low) and category (login/payment/bug/other). Return JSON.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return JSON.parse(res.choices[0].message.content);
  } catch (err) {
    console.error("AI Classification Error:", err);

    return {
      priority: "low",
      category: "other",
    };
  }
};