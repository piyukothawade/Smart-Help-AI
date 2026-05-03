import API from "../../../services/api";

export const createTicket = async (data) => {
  const res = await API.post("/tickets", data);
  return res.data;
};

export const getTickets = async () => {
  const res = await API.get("/tickets");
  return res.data;
};