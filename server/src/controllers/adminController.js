const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");

// =====================================================
// GET ALL USERS
// =====================================================

async function getAllUsers(req, res) {
  try {
    const [users] = await pool.query(`
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at,
        updated_at
      FROM users
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve users",
    });
  }
}

// =====================================================
// GET USER BY ID
// =====================================================

async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user",
    });
  }
}

// =====================================================
// CREATE USER
// =====================================================

async function createUser(req, res) {
  try {
    const {
      full_name,
      email,
      phone,
      password,
      role = "user",
    } = req.body;

    // Validate name and password
    if (!full_name || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name and password are required",
      });
    }

    // Require email or phone
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required",
      });
    }

    // Validate role
    const allowedRoles = [
      "admin",
      "manager",
      "user",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check duplicate email
    if (email) {
      const [existingEmail] = await pool.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }
    }

    // Check duplicate phone
    if (phone) {
      const [existingPhone] = await pool.query(
        "SELECT id FROM users WHERE phone = ? LIMIT 1",
        [phone]
      );

      if (existingPhone.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
    }

    // Hash password
    const password_hash = await bcrypt.hash(
      password,
      12
    );

    // Create user
    const [result] = await pool.query(
      `
      INSERT INTO users
      (
        full_name,
        email,
        phone,
        password_hash,
        role,
        status
      )
      VALUES (?, ?, ?, ?, ?, 'active')
      `,
      [
        full_name,
        email || null,
        phone || null,
        password_hash,
        role,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: result.insertId,
        full_name,
        email: email || null,
        phone: phone || null,
        role,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create user",
    });
  }
}

// =====================================================
// UPDATE USER
// =====================================================

async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const {
      full_name,
      email,
      phone,
      password,
      role,
      status,
    } = req.body;

    // Check whether user exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate role
    if (role !== undefined) {
      const allowedRoles = [
        "admin",
        "manager",
        "user",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }
    }

    // Validate status
    if (status !== undefined) {
      const allowedStatuses = [
        "active",
        "inactive",
        "suspended",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }
    }

    // Check duplicate email
    if (email !== undefined && email) {
      const [emailUsers] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = ?
        AND id != ?
        LIMIT 1
        `,
        [email, id]
      );

      if (emailUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }
    }

    // Check duplicate phone
    if (phone !== undefined && phone) {
      const [phoneUsers] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE phone = ?
        AND id != ?
        LIMIT 1
        `,
        [phone, id]
      );

      if (phoneUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
    }

    // Fields to update
    const fields = [];
    const values = [];

    if (full_name !== undefined) {
      fields.push("full_name = ?");
      values.push(full_name);
    }

    if (email !== undefined) {
      fields.push("email = ?");
      values.push(email || null);
    }

    if (phone !== undefined) {
      fields.push("phone = ?");
      values.push(phone || null);
    }

    if (role !== undefined) {
      fields.push("role = ?");
      values.push(role);
    }

    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }

    // Update password if supplied
    if (password) {
      const password_hash = await bcrypt.hash(
        password,
        12
      );

      fields.push("password_hash = ?");
      values.push(password_hash);
    }

    // Nothing to update
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    // Add user ID
    values.push(id);

    // Update database
    await pool.query(
      `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      values
    );

    // Get updated user
    const [updatedUsers] = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUsers[0],
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user",
    });
  }
}

// =====================================================
// UPDATE USER STATUS
// =====================================================

async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "active",
      "inactive",
      "suspended",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Check whether user exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update status
    await pool.query(
      `
      UPDATE users
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    // Get updated user
    const [updatedUsers] = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: `User ${status} successfully`,
      user: updatedUsers[0],
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status",
    });
  }
}

// =====================================================
// DELETE USER
// =====================================================

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent admin from deleting their own account
    if (Number(id) === Number(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Check whether user exists
    const [users] = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await pool.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: users[0],
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete user",
    });
  }
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};