import api from "../../api/axios";

export const getMyTasksAPI = async () => {
  const res = await api.get("/tasks/my");
  return res.data.data;
};

export const exportMyTasksCSVAPI = async () => {
  const res = await api.get("/tasks/my/export", {
    responseType: "blob",
  });
  return res;
};

export const createTaskAPI = async (data) => {
  const res = await api.post("/tasks", data);
  return res.data.data;
};

export const updateTaskAPI = async ({ id, data }) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data.data;
};

export const getTaskByIdAPI = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data.data;
};

export const deleteTaskAPI = async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
};

export const getAllTasksAPI = async () => {
  const res = await api.get("/tasks");
  return res.data.data;
};

export const assignTaskAPI = async ({ taskId, userId }) => {
  const res = await api.patch(`/tasks/${taskId}/assign`, { userId });
  return res.data.data;
};

export const getTaskStatsAPI = async () => {
  const res = await api.get("/tasks/stats");
  return res.data.data;
};
