const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSingleTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get", getTasks);
router.get("/get-one", getSingleTask);
router.post("/create", createTask);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;
