const express = require("express");
const otherRouter = express.Router();
const { authenticateToken, authorize } = require("../middlewear/auth"); // Fixed typo
const { getUsers } = require("../services/othrServices");

otherRouter.get(
  "/api/getusers", // Changed to GET
  authenticateToken,
  authorize("get_users"),
  async (req, res) => {
    try {
      const users = await getUsers();
      if (!users.length) {
        return res.status(200).json({ message: "No users found", data: [] });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error in getUsers route:", error);
      res.status(error.message.includes('database') ? 500 : 400).json({ message: error.message });
    }
  }
);

module.exports = otherRouter;