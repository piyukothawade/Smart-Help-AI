import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import useChat from "../hooks/useChat";

const ChatWindow = () => {
  const { messages, loading, sendMessage } = useChat();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full">

      <div className="p-4 border-b font-semibold">
        AI Support Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <MessageBubble key={index} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatWindow;