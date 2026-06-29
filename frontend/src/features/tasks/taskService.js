import api from "../../api/axios";

export const getMyTasksAPI = async (params = {}) => {
  const res = await api.get("/tasks/my", { params });
  return res.data.data;
};

export const getAllTasksAPI = async (params = {}) => {
  const res = await api.get("/tasks", { params });
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

export const assignTaskAPI = async ({ taskId, userIds }) => {
  // Backend expects { userIds: string[] } and assignedTo is an array field.
  const res = await api.patch(`/tasks/${taskId}/assign`, { userIds });
  return res.data.data;
};

export const getTaskStatsAPI = async () => {
  const res = await api.get("/tasks/stats");
  return res.data.data;
};

export const addSubtaskAPI = async ({ taskId, title }) => {
  const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
  return res.data.data;
};

export const toggleSubtaskAPI = async ({ taskId, subId }) => {
  const res = await api.patch(`/tasks/${taskId}/subtasks/${subId}`);
  return res.data.data;
};

export const deleteSubtaskAPI = async ({ taskId, subId }) => {
  await api.delete(`/tasks/${taskId}/subtasks/${subId}`);
  return subId;
};
