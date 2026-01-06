import api from "../../api/axios";

export const loginAPI = async (data) => {
  const res = await api.post("/user/login", data);
  return res.data.data;
};
export const registerAPI = async (data) => {
  const res = await api.post("/user/register", data);
  return res.data.data;
};