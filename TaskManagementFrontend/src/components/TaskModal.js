import { FormControl, MenuItem, Modal, InputLabel, Select, Button, Typography, OutlinedInput } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect } from "react";
import { useTasksActions, useTasks } from "../context/TasksContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box } from "@mui/system";

const schema = yup.object().shape({
  name: yup.string().required("Task name is required"),
  description: yup.string(),
  priority: yup.number().min(0).max(4),
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  border: "2px solid #0000004f",
  boxShadow: 24,
  p: 4,
  zIndex: 1300,
};
export default function TaskModal() {
  const { closeTaskModal, addTask, updateTask } = useTasksActions();
  const { currentTask, openModal, priority } = useTasks();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: currentTask?.name || "",
      description: currentTask?.description || "",
      priority: currentTask?.priority || 0,
    },
  });

  useEffect(() => {
    if (currentTask) {
      setValue("name", currentTask.name);
      setValue("description", currentTask.description);
      setValue("priority", currentTask.priority);
    } else {
      setValue("name", "");
      setValue("description", "");
      setValue("priority", 0);
    }
  }, [currentTask, setValue]);

  const onSubmit = (data) => {
    const taskData = currentTask
      ? { ...currentTask, ...data } // Merge updates, preserve id
      : data;

    if (taskData.id) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    closeTaskModal();
  };

  return (
    <Modal open={openModal} onClose={closeTaskModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {currentTask ? "Update Task" : "Create a new task"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.name}>
            <OutlinedInput placeholder="Input task name" label="Task Name" required {...register("name")} error={!!errors.name} />
            {errors.name && (
              <Typography variant="caption" color="error">
                {errors.name.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.description}>
            <OutlinedInput placeholder="Input task description" label="Task Description" multiline rows={4} {...register("description")} error={!!errors.description} />
            {errors.description && (
              <Typography variant="caption" color="error">
                {errors.description.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.priority}>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Priority">
                  {priority &&
                    Object.entries(priority).map(([key, value]) => (
                      <MenuItem key={key} value={parseInt(key)}>
                        {value}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
            {errors.priority && (
              <Typography variant="caption" color="error">
                {errors.priority.message}
              </Typography>
            )}
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            {currentTask ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
