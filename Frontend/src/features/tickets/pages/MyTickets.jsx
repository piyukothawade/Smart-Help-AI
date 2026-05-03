import useTickets from "../hooks/useTickets";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Ticket, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ NEW

const MyTickets = () => {
  const { tickets, loading } = useTickets();
  const navigate = useNavigate(); // ✅ NEW

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (tickets.length > 0) {
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    }
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (tab === "open") return t.status === "open";
        if (tab === "closed") return t.status === "closed";
        return true;
      })
      .filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [tickets, tab, search]);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {showNotif && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded shadow"
        >
          <Bell size={16} className="inline mr-2" />
          Tickets updated
        </motion.div>
      )}

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Ticket className="text-purple-500" />
        My Tickets
      </h2>

      {/* Analytics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: "Total", value: stats.total },
          { label: "Open", value: stats.open },
          { label: "Closed", value: stats.closed }
        ].map((card, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }}
            className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
        <div className="flex items-center border rounded px-2 py-1 w-full md:w-1/3">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {["all", "open", "closed"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded ${
                tab === t ? "bg-purple-500 text-white" : "bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : filteredTickets.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            No tickets found
          </p>
        ) : (
          filteredTickets.map((t) => (
            <motion.div
              key={t._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/tickets/${t._id}`)} // ✅ NAVIGATE
              className="bg-white p-4 rounded shadow cursor-pointer"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{t.title}</h3>

                <span className={`text-xs px-2 py-1 rounded ${getPriorityStyle(t.priority)}`}>
                  {t.priority || "low"}
                </span>
              </div>

              <p className="text-sm text-gray-500">{t.description}</p>

              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{t.status}</span>
                <span>{new Date(t.createdAt).toLocaleString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTickets;