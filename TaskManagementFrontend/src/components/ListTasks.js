import React, { useEffect } from "react";
import { useTasks, useTasksActions } from "../context/TasksContext";
import TaskFilter from "./TaskFilter";
import { IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const ListTasks = () => {
  const { fetchTasks, deleteTask, openModalWithTask, updateTask } = useTasksActions();
  const { filteredTasks, loading, error, priority } = useTasks();
  useEffect(() => {
    fetchTasks();
  }, []);
  const openEditModal = (task) => {
    openModalWithTask(task);
  };
  return (
    <div>
      <h2 className="p-3 bg-primary-500 text-white mb-0">Task List</h2>
      <TaskFilter />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {error && <p className="text-red-500">Error: {error}</p>}
          <Button variant="contained" className="mb-3" onClick={() => openEditModal(null)}>
            Create Task
          </Button>

          <table className="w-100 border-collapse border border-slate-400">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="pt-3 pb-3">Task Name</th>
                <th className="pt-3 pb-3">Priority</th>

                <th className="pt-3 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks?.map((task, i) => (
                <tr key={task.id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="pb-2 pt-2">{task.name}</td>
                  <td className="pb-2 pt-2">{priority[task.priority]}</td>
                  <td className="pb-2 pt-2">
                    <IconButton
                      onClick={() => updateTask({ ...task, isCompleted: !task.isCompleted })}
                      color={task.isCompleted ? "success" : "default"}
                      sx={{
                        ...(task.isCompleted && { color: "success.main" }), // Ensures green tint
                      }}
                    >
                      <CheckCircleIcon color={task.isCompleted ? "success" : "default"} />
                    </IconButton>
                    <IconButton onClick={() => openEditModal(task)} color={"primary"}>
                      <EditIcon color={"primary"} />
                    </IconButton>
                    <IconButton onClick={() => deleteTask(task.id)} color={"error"}>
                      <DeleteIcon color={"error"} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ListTasks;
