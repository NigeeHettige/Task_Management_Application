const express = require("express");
const TaskRouter = express.Router();
const { authenticateToken, authorize } = require("../middlewear/auth");
const {
  createTask,
  getTaskById,
  getTaskUserById,
  updateTask,
  deleteTask,
  getTask,
} = require("../services/taskServices");

TaskRouter.post(
  "/api/createtask",
  authenticateToken,
  authorize("create_task"),
  async (req, res) => {
    try {
      const taskId = await createTask(req.body, req.user.id);
      res.status(200).json({ id: taskId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

TaskRouter.get(
  "/api/gettaskbyid/:id",
  authenticateToken,
  authorize("view_task_by_id"),
  async (req, res) => {
    try {
      const task = await getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);
TaskRouter.get(
  "/api/gettaskbyuserid/:id",
  authenticateToken,
  authorize("view_task_by_user"),
  async (req, res) => {
    try {
      const task = await getTaskUserById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

TaskRouter.get(
  "/api/gettask",
  authenticateToken,
  authorize("view_task"),
  async (req, res) => {
    try {
      const task = await getTask();
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

TaskRouter.put("/api/updatetask/:id", authenticateToken, async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (
      task.created_by !== req.user.id &&
      !req.user.roles.includes("manager") &&
      !req.user.roles.includes("admin")
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot update this task" });
    }
    await updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json({ message: "Task updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

TaskRouter.delete(
  "/api/deletetask/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const task = await getTaskById(req.params.id);
      if (
        task.created_by !== req.user.id &&
        !req.user.roles.includes("admin")
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden: Cannot delete this task" });
      }
      await deleteTask(req.params.id);
      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = TaskRouter;
