const TicketStatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        status === "open"
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {status}
    </span>
  );
};

export default TicketStatusBadge;