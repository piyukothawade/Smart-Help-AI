import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import { motion } from "framer-motion";
import { Send, User, ShieldCheck } from "lucide-react";

const TicketDetails = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await API.get(`/tickets/${id}`);
      setTicket(res.data);
    };

    fetchTicket();
  }, [id]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    const res = await API.post(`/tickets/${id}/reply`, {
      text: reply,
    });

    setTicket(res.data);
    setReply("");
  };

  const updateStatus = async (status) => {
    const res = await API.put(`/tickets/${id}`, { status });
    setTicket(res.data);
  };

  if (!ticket) return <p className="p-6">Loading...</p>;

  const getStatusStyle = () => {
    return ticket.status === "open"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{ticket.title}</h2>

        <div className="flex items-center gap-3 mt-2">
          <span className={`text-xs px-2 py-1 rounded ${getStatusStyle()}`}>
            {ticket.status}
          </span>

          <span className="text-xs text-gray-400">
            {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow p-4 h-[450px] flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {ticket.messages.map((msg, i) => {
            const isAdmin = msg.sender === "admin";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isAdmin ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-end gap-2 ${
                  isAdmin ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar left */}
                {!isAdmin && (
                  <div className="bg-gray-300 p-2 rounded-full">
                    <User size={14} />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    isAdmin
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{msg.text}</p>

                  <span className="text-[10px] opacity-70 block mt-1">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                </div>

                {/* Avatar right */}
                {isAdmin && (
                  <div className="bg-purple-500 text-white p-2 rounded-full">
                    <ShieldCheck size={14} />
                  </div>
                )}
              </motion.div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Reply Box */}
        <div className="mt-3 flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            onKeyDown={(e) => e.key === "Enter" && handleReply()}
          />

          <button
            onClick={handleReply}
            className="bg-purple-500 text-white px-4 rounded flex items-center gap-1 hover:bg-purple-600"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Status Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => updateStatus("open")}
          className="bg-yellow-400 px-4 py-1 rounded hover:bg-yellow-500"
        >
          Mark Open
        </button>

        <button
          onClick={() => updateStatus("closed")}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
        >
          Mark Closed
        </button>
      </div>
    </div>
  );
};

export default TicketDetails;