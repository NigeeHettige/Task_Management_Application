const pool = require("../config/db");

const createTask = async (taskData, userId) => {
  const { title, description, priority, assigned_to, due_date } = taskData;
  const [result] = await pool.query(
    "INSERT INTO tasks (title, description, priority, assigned_to, created_by, due_date) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, priority, assigned_to, userId, due_date]
  );
  return result.insertId;
};

const getTaskById = async (taskId) => {
  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
  if (!rows.length) throw new Error("Task not found");
  return rows[0];
};
const getTaskUserById = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM tasks WHERE assigned_to = ?", [parseInt(userId)]);
  if (!rows.length) throw new Error("Task not found");
  return rows;
};

const getTask = async () => {
  const [rows] = await pool.query("SELECT * FROM tasks");
  if (!rows.length) throw new Error("No tasks");
  return rows;
};

const updateTask = async (userId,taskId, updateData) => {
  const { title, description, priority, assigned_to, due_date, status } =
    updateData;

  const [result] = await pool.query(
    "UPDATE tasks SET title = ?, description = ?, assigned_to = ?, due_date = ?, status = ?, priority = ?,created_by =? WHERE id = ?",
    [title, description, assigned_to, due_date, status, priority,userId,taskId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Task not found");
  }
};

const deleteTask = async (taskId) => {
  const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);
  if (result.affectedRows === 0) throw new Error("Task not found");
};

module.exports = { createTask, getTaskById, getTask, updateTask, deleteTask,getTaskUserById };
