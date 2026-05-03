import { useNavigate } from "react-router-dom";
import TicketStatusBadge from "./TicketStatusBadge";

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket._id}`)}
      className="p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{ticket.title}</h3>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <p className="text-sm text-gray-500 mt-1">
        {new Date(ticket.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default TicketCard;