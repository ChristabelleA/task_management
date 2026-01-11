import { createContext, useReducer, useContext, useMemo } from "react";
import _ from "lodash";
import api from "../api/taskManagementApi";
export const TasksContext = createContext();

const initialState = {
  tasks: [],
  users: [],
  loading: false,
  error: null,
  openModal: false,
  currentTask: null,
  filters: {
    completedStatus: "all", // "all", "completed", "incompleted"
    priorityStatus: [0, 1, 2, 3, 4], // 0,1,2,3,4, eg. [2,3] means medium and high priority
    sort: [
      ["priority", "name"],
      ["desc", "asc"],
    ], // [field, direction]
  },
  priority: {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Urgent",
  },
};

export function tasksReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
        loading: false,
        error: null,
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        loading: false,
        error: null,
      };
    case "SET_PRIORITY_FILTER":
      return { ...state, filters: { ...state.filters, priorityStatus: action.payload } };
    case "SET_COMPLETED_FILTER":
      return { ...state, filters: { ...state.filters, completedStatus: action.payload } };
    case "OPEN_MODAL_WITH_TASK":
      return { ...state, openModal: true, currentTask: action.payload };
    case "CLOSE_MODAL_WITH_TASK":
      return { ...state, openModal: false, currentTask: null };
    default:
      return state;
  }
}

export const useTasksActions = () => {
  const { dispatch } = useTasks();
  return {
    async fetchTasks() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const tasks = await api.getTasks();
        console.log("Fetched tasks:", tasks);
        dispatch({ type: "SET_TASKS", payload: tasks });
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: e.message });
      }
    },
    async addTask(task) {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const newTask = await api.createTask(task);
        dispatch({ type: "ADD_TASK", payload: newTask });
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: e.message });
      }
    },
    async updateTask(updatedTask) {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const task = await api.updateTask(updatedTask);
        dispatch({ type: "UPDATE_TASK", payload: task });
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: e.message });
      }
    },
    async deleteTask(taskId) {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await api.deleteTask(taskId);
        dispatch({ type: "DELETE_TASK", payload: taskId });
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: e.message });
      }
    },
    setPriorityFilter(priorityStatus) {
      dispatch({ type: "SET_PRIORITY_FILTER", payload: priorityStatus });
    },
    setCompletedFilter(completedStatus) {
      dispatch({ type: "SET_COMPLETED_FILTER", payload: completedStatus });
    },
    openModalWithTask(task) {
      dispatch({ type: "OPEN_MODAL_WITH_TASK", payload: task });
    },
    openModal() {
      dispatch({ type: "OPEN_MODAL_WITH_TASK", payload: null });
    },
    closeTaskModal() {
      dispatch({ type: "CLOSE_MODAL_WITH_TASK", payload: null });
    },
  };
};

export const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const filteredTasks = useMemo(
    () =>
      _.orderBy(
        state.tasks.filter((task) => {
          if (!state.filters.priorityStatus.includes(task.priority)) return false;
          if (state.filters.completedStatus !== "all") {
            if (state.filters.completedStatus === "completed" && task.isCompleted) return false;
            if (state.filters.completedStatus === "incompleted" && !task.isCompleted) return false;
          }
          return true;
        }),
        state.filters.sort[0],
        state.filters.sort[1]
      ),
    [state.tasks, state.filters, state.tasks.length]
  );

  return <TasksContext.Provider value={{ ...state, filteredTasks, dispatch }}>{children}</TasksContext.Provider>;
};

export const useTasks = () => useContext(TasksContext);
