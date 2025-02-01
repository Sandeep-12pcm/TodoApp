const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/todoApp", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Task Schema & Model
const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  category: { type: String, default: "General" },
  reminder: Date,
});

const Task = mongoose.model("Task", taskSchema);

// API Routes
// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// POST a new task
app.post("/api/tasks", async (req, res) => {
  const { text, completed, category, reminder } = req.body;

  try {
    const newTask = new Task({ text, completed, category, reminder });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task" });
  }
});

// DELETE a task
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

// PATCH task completion status
app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
