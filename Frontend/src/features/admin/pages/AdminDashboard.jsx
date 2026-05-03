import Layout from "../../../components/layout/Layout";
import { useTicketContext } from "../../tickets/context/TicketContext";
import Analytics from "../components/Analytics";
import { motion } from "framer-motion";
import { Ticket, CheckCircle, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const { tickets } = useTicketContext();

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const cards = [
    {
      label: "Total Tickets",
      value: stats.total,
      icon: Ticket,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Open Tickets",
      value: stats.open,
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Closed Tickets",
      value: stats.closed,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <Layout>
      <div className="p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {cards.map((card, i) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-5 rounded-2xl shadow flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>

                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon size={20} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-5 rounded-2xl shadow"
        >
          <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>
          <Analytics tickets={tickets} />
        </motion.div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;