const express = require("express");
const cors = require('cors'); 
const dotenv = require("dotenv");

// Config env before everything else
dotenv.config();


const connectDB = require("./db/dbConfig");

const authRoutes = require("./routes/authRoutes.js");


const app = express();

// Connect to Database
connectDB();

// --- CORS Configuration ---
const allowedOrigins = [
  "https://devspace-hero-client1.vercel.app", 
  "http://localhost:5173", 

];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api",authRoutes)



const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;