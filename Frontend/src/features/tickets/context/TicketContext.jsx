import { createContext, useContext, useEffect, useState } from "react";
import socket from "../../../services/socket";
import API from "../../../services/api";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  // 🔥 INITIAL FETCH
  useEffect(() => {
    const fetchTickets = async () => {
      const res = await API.get("/tickets");
      setTickets(res.data);
    };

    fetchTickets();
  }, []);

  // 🔥 REAL-TIME LISTENERS
  useEffect(() => {
    // NEW TICKET
    socket.on("ticketCreated", (newTicket) => {
      setTickets((prev) => [newTicket, ...prev]);
    });

    // UPDATE TICKET
    socket.on("ticketUpdated", (updatedTicket) => {
      setTickets((prev) =>
        prev.map((t) =>
          t._id === updatedTicket._id ? updatedTicket : t
        )
      );
    });

    return () => {
      socket.off("ticketCreated");
      socket.off("ticketUpdated");
    };
  }, []);

  // CREATE
  const createTicket = async (title) => {
    const res = await API.post("/tickets", { title });
    return res.data;
  };

  // UPDATE
  const updateTicket = async (id, data) => {
    const res = await API.put(`/tickets/${id}`, data);
    return res.data;
  };

  return (
    <TicketContext.Provider
      value={{ tickets, createTicket, updateTicket }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => useContext(TicketContext);
