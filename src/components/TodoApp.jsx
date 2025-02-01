import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "react-calendar/dist/Calendar.css";
import CalendarView from "./CalendarView";
import UpNextTasks from "./UpNextTasks";
import { getTasks, addTaskapi, deleteTaskapi, toggleTaskComplete } from "../api";

const TodayTasks = ({ tasks, toggleComplete, deleteTask }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">All Tasks</h2>
    <ul className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      {tasks.length > 0 ? tasks.map(task => (
        <li key={task._id || task.id || Math.random()}
          className="p-3 border-b flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all rounded-lg">

          <span
            className={`text-lg font-medium cursor-pointer ${task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-200"}`}
            onClick={() => toggleComplete(task._id || task.id)}
          >
            {task.text}
          </span>

          <button
            onClick={() => deleteTask(task._id || task.id)}
            className="text-white px-2 py-1 rounded-lg hover:bg-blue-200 transition-all"
          >
            ✖
          </button>
        </li>
      )) : <li className="p-3 text-gray-500">No tasks available.</li>}
    </ul>
  </div>
);

const AddTask = ({ newTask, setNewTask, setCategory, setReminderEnabled, reminderTime, setReminderTime, addTask, reminderEnabled }) => (
  <div className="flex flex-col gap-4 mb-6 ">
    {/* Task input */}
    <input
      type="text"
      className="p-3 border rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-700 dark:text-white dark:border-gray-500 placeholder-gray-400 dark:placeholder-gray-300"
      placeholder="Add a new task..."
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />

    <div className="flex items-center gap-2">
      {/* Task category dropdown */}
      <select
        onChange={(e) => setCategory(e.target.value)}
        className="p-3 border rounded-lg bg-white text-black 
                   dark:bg-gray-700 dark:text-white dark:border-gray-500"
      >
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      {/* Set reminder checkbox */}
      <label className="flex items-center gap-2 text-gray-900 dark:text-gray-300">
        <input
          type="checkbox"
          checked={reminderEnabled}
          onChange={(e) => setReminderEnabled(e.target.checked)}
          className="dark:bg-gray-700"
        />
        <span>Set Reminder</span>
      </label>

      {/* Date-Time Picker for Reminder */}
      {reminderEnabled && (
        <input
          type="datetime-local"
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
             dark:bg-gray-700 dark:text-white dark:border-gray-500 
             appearance-none dark:placeholder-gray-300"
          onChange={(e) => setReminderTime(e.target.value)}
        />
      )}
    </div>

    {/* Add Task Button */}
    <button
      onClick={addTask}
      className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 w-full"
    >
      ➕ Add Task
    </button>
  </div>
);




const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
);

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  const [newTask, setNewTask] = useState([]);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [category, setCategory] = useState("General");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const deleteTask = async (id) => {
    try {
      await deleteTaskapi(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task._id === id);
    if (!taskToUpdate) return;

    try {
      const updatedTask = await toggleTaskComplete(id, !taskToUpdate.completed);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: updatedTask.completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const addTask = async () => {
    console.log("Tasks:", tasks);
    if (newTask.trim() === "") return;
    const newTaskObj = {
      text: newTask,
      completed: false,
      category,
      reminder: reminderEnabled ? new Date(reminderTime).getTime() : null,
    };

    try {
      const createdTask = await addTaskapi(newTaskObj);
      setTasks((prev) => [...prev, createdTask]); // Update state with new task from backend
      setNewTask("");
      setReminderTime("");
      setReminderEnabled(false);
      setCategory("General");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className={`flex w-full h-screen justify-center items-center p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex w-full max-w-6xl gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-2/3 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">To-Do List</h1>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <AddTask newTask={newTask} setNewTask={setNewTask} setCategory={setCategory} setReminderEnabled={setReminderEnabled} reminderTime={reminderTime} setReminderTime={setReminderTime} addTask={addTask} reminderEnabled={reminderEnabled} />
          <TodayTasks tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} />
        </div>
        <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <div className="">
          <UpNextTasks tasks={tasks} />
        </div>
      </div>
    </div>
  );
}