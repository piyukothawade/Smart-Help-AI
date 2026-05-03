import { createContext, useContext, useState } from "react";
import { getAIReply } from "../../admin/services/aiService"; // ✅ FIXED IMPORT
import { useTicketContext } from "../../tickets/context/TicketContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const { createTicket } = useTicketContext();

  // 💬 SEND MESSAGE
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    try {
      // 👉 Add user message
      setMessages((prev) => [...prev, { sender: "user", text }]);

      setTyping(true);

      // 🤖 Get AI reply
      const aiReply = await getAIReply(text);

      // 👉 Add AI message
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: aiReply },
      ]);

      setTyping(false);

      // 🎫 SMART TICKET CREATION (basic logic for now)
      const shouldCreateTicket =
        text.toLowerCase().includes("not working") ||
        text.toLowerCase().includes("issue") ||
        text.toLowerCase().includes("error");

      if (shouldCreateTicket) {
        await createTicket(text);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I've created a support ticket for your issue. Our team will assist you soon.",
          },
        ]);
      }

    } catch (err) {
      console.error("Chat error:", err);

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typing }}>
      {children}
    </ChatContext.Provider>
  );
};

// ✅ CUSTOM HOOK
export const useChatContext = () => useContext(ChatContext);