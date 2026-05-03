import TicketCard from "./TicketCard";

const TicketList = ({ tickets }) => {
  if (!tickets.length) {
    return <p>No tickets found</p>;
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketList;