const Task = require("../models/task.model"); // Adjust the path if necessary
const User = require("../models/user.model"); // Adjust the path if necessary

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }); // Find tasks for the logged-in user
    res.status(200).json({ code: 200, message: "Success!", data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task by ID
const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.query.id); // Use query params for ID
    if (!task) {
      return res.status(200).json({ code: 404, message: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(200).json({ code: 403, message: "Not authorized" });
    }
    res.status(200).json({ code: 200, message: "Success!", data: task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { title, description, priority, status } = req.body;
  try {
    const newTask = new Task({
      user: req.user.id, // Assign the task to the logged-in user
      title,
      description,
      priority,
      status,
    });
    await newTask.save();
    res.status(200).json({ code: 201, message: "Created!", data: newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  const { title, description, priority, status } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(200).json({ code: 404, message: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(200).json({ code: 403, message: "Not authorized" });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    await task.save();
    res.status(200).json({ code: 200, message: "Updated!", data: task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    console.log(req.params.id, "task", task);
    if (!task) {
      return res.status(200).json({ code: 404, message: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(200).json({ code: 403, message: "Not authorized" });
    }
    await task.deleteOne();
    res.status(200).json({ code: 200, message: "Task removed" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSingleTask,
};
