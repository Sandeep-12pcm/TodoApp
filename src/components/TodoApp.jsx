import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "react-calendar/dist/Calendar.css";
import CalendarView from "./CalendarView";

const Task = ({ task }) => (
  <li className="p-3 border-b flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all rounded-lg">
    <span className="text-lg font-medium">{task.text} {task.reminder && <span className="text-gray-500 text-sm">({new Date(task.reminder).toLocaleString()})</span>}</span>
  </li>
);

const TodayTasks = ({ tasks }) => (
  <ul className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
    {tasks.map((task) => (
      <Task key={task.id} task={task} />
    ))}
  </ul>
);

const AddTask = ({ newTask, setNewTask, setCategory, setReminder, reminderTime, setReminderTime, addTask, reminderEnabled }) => (
  <div className="flex flex-col gap-4 mb-6">
    <input
      type="text"
      className="p-3 border rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Add a new task..."
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />
    <div className="flex items-center gap-2">
      <select onChange={(e) => setCategory(e.target.value)} className="p-3 border rounded-lg">
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={reminderEnabled}
          onChange={(e) => setReminder(e.target.checked)}
        />
        <span>Set Reminder</span>
      </label>
    </div>
    {reminderEnabled && (
      <input
        type="datetime-local"
        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
      />
    )}
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
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [category, setCategory] = useState("General");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const reminderTimestamp = reminderEnabled && reminderTime ? new Date(reminderTime).getTime() : null;
    setTasks([...tasks, { id: uuidv4(), text: newTask, completed: false, reminder: reminderTimestamp, category }]);
    setNewTask("");
    setReminderTime("");
    setReminderEnabled(false);
    setCategory("General");
  };

  return (
    <div className={`min-h-screen flex items-start p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex w-full max-w-6xl gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-2/3 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">To-Do List</h1>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <AddTask newTask={newTask} setNewTask={setNewTask} setCategory={setCategory} setReminder={setReminderEnabled} reminderTime={reminderTime} setReminderTime={setReminderTime} addTask={addTask} reminderEnabled={reminderEnabled} />
          <TodayTasks tasks={tasks} />
        </div>
        <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
    </div>
  );
}
