import { useEffect, useState } from "react";
import { getSuggestions } from "../services/aiSuggestionService";
import Button from "../../../components/common/Button";

const ReplyBox = ({ ticket, updateTicket }) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    const res = await getSuggestions();
    setSuggestions(res);
  };

  const handleReply = () => {
    if (!text.trim()) return;

    const updated = {
      ...ticket,
      status: "closed",
      messages: [...ticket.messages, { sender: "admin", text }],
    };

    updateTicket(updated);
    setText("");
  };

  return (
    <div className="mt-4">
      <div className="mb-3 space-y-2">
        <p className="text-sm font-medium">AI Suggestions:</p>
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => setText(s)}
            className="p-2 border rounded cursor-pointer hover:bg-gray-100"
          >
            {s}
          </div>
        ))}
      </div>

      <textarea
        className="w-full border p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button onClick={handleReply} className="mt-2">
        Send Reply
      </Button>
    </div>
  );
};

export default ReplyBox;