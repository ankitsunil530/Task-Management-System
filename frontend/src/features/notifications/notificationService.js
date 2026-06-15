import api from "../../api/axios";

export const getNotificationsAPI = async () => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const markAsReadAPI = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data.data;
};

export const markAllAsReadAPI = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data;
};

export const deleteNotificationAPI = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return { id, message: res.data.message };
};
