import API from "../../../services/api";

export const getAIReply = async (message) => {
  const res = await API.post("/ai/reply", { message });
  return res.data.reply;
};