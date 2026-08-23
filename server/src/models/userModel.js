const { pool } = require("../config/database");

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

async function findUserByPhone(phone) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE phone = ? LIMIT 1",
    [phone]
  );

  return rows[0] || null;
}

async function createUser({
  full_name,
  email,
  phone,
  password_hash,
  role = "user",
}) {
  const [result] = await pool.query(
    `INSERT INTO users
      (full_name, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    [full_name, email || null, phone || null, password_hash, role]
  );

  return result.insertId;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  findUserByEmail,
  findUserByPhone,
  createUser,
  findUserById,
};