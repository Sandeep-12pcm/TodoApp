import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks"; // Update with your backend URL

export const getTasks = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const addTaskapi = async (task) => {
  const response = await axios.post(API_BASE_URL, task);
  return response.data;
};

export const deleteTaskapi = async (taskId) => {
  await axios.delete(`${API_BASE_URL}/${taskId}`);
};

export const toggleTaskComplete = async (taskId, completed) => {
  const response = await axios.patch(`${API_BASE_URL}/${taskId}`, { completed });
  return response.data;
};

