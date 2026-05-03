import { useParams } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import { useTicketContext } from "../../tickets/context/TicketContext";
import { useMemo, useState, useRef, useEffect } from "react";
import API from "../../../services/api";
import { motion } from "framer-motion";
import { Bot, User, Sparkles } from "lucide-react";

const AdminTicketDetails = () => {
  const { id } = useParams();
  const { tickets, updateTicket } = useTicketContext();

  const [reply, setReply] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const bottomRef = useRef(null);

  const ticket = useMemo(
    () => tickets.find((t) => t._id === id),
    [tickets, id]
  );

  // ✅ auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket]);

  if (!ticket) return <p className="p-6">Loading...</p>;

  const sendReply = async () => {
    if (!reply.trim()) return;

    await API.post(`/tickets/${id}/reply`, { text: reply });
    setReply("");
  };

  const closeTicket = async () => {
    await updateTicket(id, { status: "closed" });
  };

  const reopenTicket = async () => {
    await updateTicket(id, { status: "open" });
  };

  const getSuggestion = async () => {
    try {
      setLoadingAI(true);

      const lastMessage =
        ticket.messages[ticket.messages.length - 1]?.text;

      const res = await API.post("/ai/reply", {
        message: lastMessage,
      });

      setSuggestion(res.data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const getStatusStyle = () => {
    return ticket.status === "closed"
      ? "bg-red-100 text-red-600"
      : "bg-green-100 text-green-600";
  };

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{ticket.title}</h2>

            <span
              className={`text-xs px-2 py-1 rounded ${getStatusStyle()}`}
            >
              {ticket.status}
            </span>
          </div>

          <div className="flex gap-2">
            {ticket.status === "open" ? (
              <button
                onClick={closeTicket}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Close
              </button>
            ) : (
              <button
                onClick={reopenTicket}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
              >
                Reopen
              </button>
            )}
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="bg-white rounded-2xl shadow p-4 h-[450px] flex flex-col">

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {ticket.messages.map((m, i) => {
              const isAdmin = m.sender === "admin";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isAdmin ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-end gap-2 ${
                    isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar */}
                  {!isAdmin && (
                    <div className="bg-gray-200 p-2 rounded-full">
                      <User size={14} />
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`p-3 rounded-xl max-w-xs ${
                      isAdmin
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p className="text-sm">{m.text}</p>

                    <span className="text-[10px] opacity-70 block mt-1">
                      {new Date(
                        m.createdAt || Date.now()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="bg-purple-500 text-white p-2 rounded-full">
                      <Bot size={14} />
                    </div>
                  )}
                </motion.div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* 🤖 AI SUGGESTION */}
          <div className="mt-3">
            <button
              onClick={getSuggestion}
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Sparkles size={14} />
              Suggest AI Reply
            </button>

            {loadingAI && (
              <p className="text-xs text-gray-400 mt-1">
                Generating response...
              </p>
            )}

            {suggestion && (
              <div className="bg-blue-50 p-3 mt-2 rounded-lg border">
                <p className="text-sm">{suggestion}</p>

                <button
                  onClick={() => setReply(suggestion)}
                  className="text-blue-600 text-xs mt-2 underline"
                >
                  Use this reply
                </button>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="flex gap-2 mt-3">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type reply..."
              className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
            />

            <button
              onClick={sendReply}
              className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AdminTicketDetails;