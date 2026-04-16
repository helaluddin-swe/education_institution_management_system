const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Config env
dotenv.config();

const connectDB = require("./db/dbConfig");

// Routes
const jobRoutes = require("./routes/jobRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const admitRoutes = require("./routes/admitRoutes.js");
const staffRoutes = require("./routes/staffRoutes.js");
const classScheduleRoutes = require("./routes/classScheduleRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes.js");

const app = express();

// DB connect
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Create server
const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: ["https://devspace-pms.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Make io global
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", authRoutes);
app.use("/api/students", admitRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/schedules", classScheduleRoutes);
app.use("/api/jobs", jobRoutes);

// Start server (FIXED)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});