import Layout from "../../../components/layout/Layout";
import { useChatContext } from "../context/ChatContext";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

const ChatPage = () => {
  const { messages, sendMessage } = useChatContext();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  // ✅ Smooth auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Layout>
      <div className="flex flex-col h-[80vh] bg-white rounded shadow p-4">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((m, i) => {
            const isUser = m.sender === "user";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isUser ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar (left for bot) */}
                {!isUser && (
                  <div className="bg-gray-300 p-2 rounded-full">
                    <Bot size={16} />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    isUser
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Timestamp */}
                  <span className="block text-[10px] mt-1 opacity-70">
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Avatar (right for user) */}
                {isUser && (
                  <div className="bg-purple-500 text-white p-2 rounded-full">
                    <User size={16} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Scroll target */}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-purple-500 text-white px-4 rounded hover:bg-purple-600"
          >
            Send
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default ChatPage;