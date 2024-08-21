const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
const taskRoutes = require("./routes/task.route");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors("*"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", protect, taskRoutes);
// Health
app.get("/health", (req, res) => {
  res.status(200).json({ code: 200, message: "Healthy" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
