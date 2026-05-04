import API from "../../../services/api";

// REGISTER
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const createTenantId = async () => {
  const res = await API.post("/auth/tenant-id");
  return res.data;
};
