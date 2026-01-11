import "./App.css";
import ListTasks from "./components/ListTasks";
import { TasksProvider } from "./context/TasksContext";
import TaskModal from "./components/TaskModal";
function App() {
  return (
    <TasksProvider>
      <div className="App">
        <ListTasks />
        <TaskModal />
      </div>
    </TasksProvider>
  );
}

export default App;
