require("dotenv").config();

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function resetAdminPassword() {
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

    const email = "musonda@different.tech";
    const newPassword = "Muzo@7766";

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const [users] = await connection.execute(
      "SELECT id, full_name, email, role, status FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      console.log("USER NOT FOUND:");
      console.log(email);
      return;
    }

    console.log("User found:");
    console.log(users[0]);

    await connection.execute(
      "UPDATE users SET password_hash = ?, status = 'active' WHERE email = ?",
      [passwordHash, email]
    );

    console.log("");
    console.log("========================================");
    console.log("PASSWORD RESET SUCCESSFUL");
    console.log("========================================");
    console.log("Email:    " + email);
    console.log("Password: " + newPassword);
    console.log("Status:   active");
    console.log("========================================");
  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetAdminPassword();