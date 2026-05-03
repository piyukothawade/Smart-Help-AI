import { useTicketContext } from "../context/TicketContext";

const useTickets = () => {
  return useTicketContext();
};

export default useTickets;