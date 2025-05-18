const jwt = require("jsonwebtoken");

// Define permissions per role
const rolePermissions = {
  user: [
    "create_task",
    "view_task",
    "view_task_by_id",
    "update_own_task",
    "get_users",
    "view_task_by_user",
  ],
  manager: [
    "create_task",
    "view_task",
    "view_task_by_id",
    "update_task",
    "assign_task",
    "delete_own_task",
    "get_users",
    "view_task_by_user",
  ],
  admin: [
    "create_task",
    "view_task",
    "view_task_by_id",
    "update_task",
    "assign_task",
    "delete_task",
    "get_users",
    "view_task_by_user",
  ],
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log(" No Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log(" No token found in header");
    return res.status(401).json({ message: "Malformed token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Middleware to check permissions
const authorize = (permission) => {
  return (req, res, next) => {
    const userRoles = req.user.roles || ["user"];
    const hasPermission = userRoles.some((role) =>
      rolePermissions[role]?.includes(permission)
    );
    if (!hasPermission)
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    next();
  };
};

module.exports = { authenticateToken, authorize };
