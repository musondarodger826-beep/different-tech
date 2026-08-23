require("dotenv").config();

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function createAdmin() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to Different.Tech database.");

    const fullName = "Different.Tech Administrator";
    const email = "musonda@different.tech";
    const phone = "+260971234567";
    const password = "Muzo@7766";
    const role = "admin";
    const status = "active";

    const passwordHash = await bcrypt.hash(password, 10);

    // Check whether the user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id, full_name, email, role, status FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Administrator already exists.");
      console.log(existingUsers[0]);

      await connection.execute(
        `UPDATE users
         SET full_name = ?,
             phone = ?,
             password_hash = ?,
             role = ?,
             status = ?
         WHERE email = ?`,
        [
          fullName,
          phone,
          passwordHash,
          role,
          status,
          email,
        ]
      );

      console.log("");
      console.log("========================================");
      console.log("ADMINISTRATOR UPDATED");
      console.log("========================================");
      console.log("Email:    " + email);
      console.log("Password: " + password);
      console.log("Role:     " + role);
      console.log("Status:   " + status);
      console.log("========================================");

      return;
    }

    // Create administrator
    const [result] = await connection.execute(
      `INSERT INTO users
       (full_name, email, phone, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        email,
        phone,
        passwordHash,
        role,
        status,
      ]
    );

    console.log("");
    console.log("========================================");
    console.log("ADMINISTRATOR CREATED SUCCESSFULLY");
    console.log("========================================");
    console.log("ID:       " + result.insertId);
    console.log("Name:     " + fullName);
    console.log("Email:    " + email);
    console.log("Password: " + password);
    console.log("Role:     " + role);
    console.log("Status:   " + status);
    console.log("========================================");

  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();