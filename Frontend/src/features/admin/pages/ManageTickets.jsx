import Layout from "../../../components/layout/Layout";
import { useTicketContext } from "../../tickets/context/TicketContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ManageTickets = () => {
  const { tickets } = useTicketContext();
  const navigate = useNavigate();

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">All Tickets</h2>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t, index) => (
              <motion.tr
                key={t._id}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/admin/tickets/${t._id}`)}
                className="border-t cursor-pointer hover:bg-gray-50"
              >
                <td className="p-3">{t.title}</td>
                <td className="capitalize">{t.status}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>

        </table>
      </div>
    </Layout>
  );
};

export default ManageTickets;