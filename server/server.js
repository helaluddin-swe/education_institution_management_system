const express = require("express");
const cors = require('cors'); 
const dotenv = require("dotenv");

// Config env before everything else
dotenv.config();


const connectDB = require("./db/dbConfig");

const jobRoutes=require("./routes/jobRoutes.js")


const authRoutes = require("./routes/authRoutes.js");
const admitRoutes = require("./routes/admitRoutes.js");




const app = express();

// Connect to Database
connectDB();

// --- CORS Configuration ---
const allowedOrigins = [
  "https://devspace-pms.vercel.app", 
  "http://localhost:5173", 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"], // CRITICAL for JWT
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user",authRoutes)
app.use("/api/students",admitRoutes)

app.use('/api/jobs',jobRoutes)





const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;