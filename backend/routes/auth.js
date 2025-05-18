const express = require("express");
const AuthRouter = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const cookieParser = require("cookie-parser");
const { registerUser, loginUser } = require("../services/authServices");

AuthRouter.post("/api/register", async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, name, password, and role are required" });
    }

    const userId = await registerUser(email, name, password, role);
    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 9 * 1000, // 9 minutes in milliseconds
    });

    res.status(201).json({ accessToken, userId, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

AuthRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "Strict",
      maxAge: 11 * 60 * 1000,
    });

    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

AuthRouter.post("/api/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decoded.id;
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp <= now) {
      return res.status(401).json({ message: "Refresh token has expired" });
    }

    // Fetch user from database
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];

    const [roleRows] = await pool.query(
      "SELECT role_id FROM user_roles WHERE user_id = ?",
      [userId]
    );
    const roles = roleRows.map((row) => {
      const roleNames = { 1: "user", 2: "manager", 3: "admin" };
      return roleNames[row.role_id] || "user";
    });

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );
    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email, roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "11m", // 1 minute for testing
      }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Fixed
      sameSite: "Strict",
      maxAge: 11 * 60 * 1000, // 1 minute
    });

    res.json({
      accessToken: newAccessToken,
      user: { id: user.id, name: user.name, email: user.email, roles }, // Added user
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token has expired" });
    }
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

AuthRouter.post("/api/logout", async (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Strict",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

AuthRouter.get("/test", (req, res) => {
  res.json({ message: "Auth router works!" });
});

module.exports = AuthRouter;
