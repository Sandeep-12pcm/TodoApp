import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [setReminder, setSetReminder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState("General");
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const now = new Date().getTime();
    tasks.forEach((task) => {
      if (task.reminder && task.reminder > now) {
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("Task Reminder", {
              body: task.text,
              icon: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
            });
          } else {
            alert(`Reminder: ${task.text}`);
          }
        }, task.reminder - now);
      }
    });
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const reminderTimestamp = setReminder && reminderTime ? new Date(reminderTime).getTime() : null;
    setTasks([...tasks, { id: uuidv4(), text: newTask, completed: false, reminder: reminderTimestamp, category, subtasks: [], priority: "Medium" }]);
    setNewTask("");
    setReminderTime("");
    setSetReminder(false);
    setCategory("General");
  };

  const tasksForDate = tasks.filter(
    (task) => task.reminder && new Date(task.reminder).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"} min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-300`}>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">To-Do List</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="mb-6 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 w-full">
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            className="p-3 border rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <select onChange={(e) => setCategory(e.target.value)} className="p-3 border rounded-lg w-full">
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setReminder}
                onChange={(e) => setSetReminder(e.target.checked)}
              />
              <span>Set Reminder</span>
            </label>
          </div>
          {setReminder && (
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">All Tasks</h2>
        <ul className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 border-b flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all rounded-lg">
              <span className="text-lg font-medium">{task.text} {task.reminder && <span className="text-gray-500 text-sm">({new Date(task.reminder).toLocaleString()})</span>}</span>
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mt-6 text-gray-700 dark:text-gray-300">📅 Calendar View</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mb-4 p-2 border rounded-lg bg-white dark:bg-gray-700 w-full"
        />
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Tasks for {selectedDate.toDateString()}</h3>
        <ul className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          {tasksForDate.length > 0 ? (
            tasksForDate.map((task) => (
              <li key={task.id} className="p-3 border-b hover:bg-gray-200 dark:hover:bg-gray-600 transition-all rounded-lg">
                {task.text}
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500">No tasks for this date.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
