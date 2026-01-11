import axios from "axios";

// Axios instance configured for the task management API
// currently pointing to localhost on port 5236
const api = axios.create({
  baseURL: "http://localhost:5236/api",
});
export async function createTask(newTask) {
  try {
    const response = await api.post("/tasks", newTask);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}

export async function getTasks() {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return null;
  }
}

export async function updateTask(updatedTask) {
  try {
    const response = await api.put(`/tasks`, updatedTask);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    return null;
  }
}

export default {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
