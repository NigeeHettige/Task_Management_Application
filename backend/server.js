const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const otherRoutes = require("./routes/other");
const pool = require("./config/db");

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

// Validate and use routes
app.use("/",taskRoutes)
app.use("/",authRoutes)
app.use("/",otherRoutes)
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
  pool.getConnection((err, connection) => {
    if (err) console.error("Database connection error:", err);
    else {
      connection.release();
      console.log("Database connection established");
    }
  });
});
