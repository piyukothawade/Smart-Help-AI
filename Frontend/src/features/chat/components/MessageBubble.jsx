const MessageBubble = ({ msg }) => {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default MessageBubble;