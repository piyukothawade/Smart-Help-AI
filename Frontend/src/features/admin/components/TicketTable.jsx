import { useNavigate } from "react-router-dom";

const TicketTable = ({ tickets }) => {
  const navigate = useNavigate();

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Title</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((t) => (
          <tr
            key={t._id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/admin/tickets/${t._id}`)}
          >
            <td className="p-2">{t.title}</td>
            <td>{t.status}</td>
            <td>{new Date(t.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TicketTable;