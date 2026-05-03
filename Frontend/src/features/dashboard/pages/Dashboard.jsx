import Layout from "../../../components/layout/Layout";
import { useTicketContext } from "../../tickets/context/TicketContext";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { tickets } = useTicketContext();

  const open = tickets.filter((t) => t.status === "open").length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  const cardAnimation = {
    whileHover: { scale: 1.05 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        
        {/* Total Tickets */}
        <motion.div
          {...cardAnimation}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded shadow"
        >
          <h2 className="text-gray-500">Total Tickets</h2>
          <p className="text-2xl font-bold">{tickets.length}</p>
        </motion.div>

        {/* Open Tickets */}
        <motion.div
          {...cardAnimation}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded shadow"
        >
          <h2 className="text-gray-500">Open</h2>
          <p className="text-2xl font-bold text-yellow-500">{open}</p>
        </motion.div>

        {/* Closed Tickets */}
        <motion.div
          {...cardAnimation}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 rounded shadow"
        >
          <h2 className="text-gray-500">Closed</h2>
          <p className="text-2xl font-bold text-green-500">{closed}</p>
        </motion.div>

      </div>
    </Layout>
  );
};

export default Dashboard;