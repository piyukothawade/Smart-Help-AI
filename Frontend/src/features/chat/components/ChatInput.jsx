import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 border-t flex gap-2 bg-white">
      <input
        className="flex-1 border rounded-full px-4 py-2 outline-none"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-5 rounded-full"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;