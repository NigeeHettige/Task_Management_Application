const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const roleMap = {
  user: 1,
  manager: 2,
  admin: 3,
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const registerUser = async (email, name,password, role) => {
  // Validate input
  if (!email || !password || !role|| !name) {
    throw new Error('Email, password,name and role are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  const normalizedRole = role.toLowerCase();
  if (!roleMap[normalizedRole]) {
    throw new Error('Invalid role. Supported roles are: user, manager, admin');
  }

  // Optional: Validate password length
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const hashedPassword = await hashPassword(password);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name,email, password) VALUES (?,?, ?)',
      [name,email, hashedPassword]
    );

    const roleId = roleMap[normalizedRole];
    await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [
      result.insertId,
      roleId,
    ]);

    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('User already exists');
    }
    throw new Error('Failed to register user: ' + error.message);
  }
};

const loginUser = async (email, password) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (!rows.length) throw new Error("User not found");
  const user = rows[0];
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  const [rolesRow] = await pool.query(
    "SELECT role_id from user_roles WHERE user_id = ?",
    [user.id]
  );
  const roles = rolesRow.map((row) => {
    const roleNames = { 1: "user", 2: "manager", 3: "admin" };
    return roleNames[row.role_id] || "invalid";
  });

  const accessToken = jwt.sign({ id: user.id, email: user.email, roles }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign({ id: user.id, email: user.email, roles }, process.env.JWT_SECRET, {
    expiresIn: "11m",
  });
  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, roles ,name:user.name},
  };
};
module.exports = { registerUser, loginUser };
