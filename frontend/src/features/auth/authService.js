import api from "../../api/axios";

export const loginAPI = async (data) => {
  const res = await api.post("/user/login", data);
  return res.data.data;
};
export const registerAPI = async (data) => {
  const res = await api.post("/user/register", data);
  return res.data.data;
};

export const updateProfilePictureAPI = async (profilePicture) => {
  const res = await api.patch("/user/profile/picture", { profilePicture });
  return res.data.data;
};