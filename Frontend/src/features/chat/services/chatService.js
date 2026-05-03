import api from "../../../services/api";

// 🔁 TOGGLE THIS FLAG
const USE_MOCK = true;

// ✅ MOCK RESPONSE (current working)
const mockResponse = async (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // simple fake logic
      if (message.toLowerCase().includes("refund")) {
        resolve({ reply: "Your refund is being processed." });
      } else if (message.toLowerCase().includes("problem")) {
        resolve({ reply: "ESCALATE" }); // simulate complex query
      } else {
        resolve({ reply: "This is a sample AI response." });
      }
    }, 1000);
  });
};

// 🌐 REAL API (future use)
const apiResponse = async (message) => {
  const res = await api.post("/chat", { message });
  return res.data;
};

// 🚀 MAIN FUNCTION
export const sendChatMessage = async (message) => {
  if (USE_MOCK) {
    return await mockResponse(message);
  }

  // 👉 later just set USE_MOCK = false
  return await apiResponse(message);
};