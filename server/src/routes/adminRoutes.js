const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require("../controllers/adminController");

const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

router.get(
  "/users",
  authenticateToken,
  requireRole("admin"),
  getAllUsers
);

// =====================================================
// GET USER BY ID
// ADMIN ONLY
// =====================================================

router.get(
  "/users/:id",
  authenticateToken,
  requireRole("admin"),
  getUserById
);

// =====================================================
// CREATE USER
// ADMIN ONLY
// =====================================================

router.post(
  "/users",
  authenticateToken,
  requireRole("admin"),
  createUser
);

// =====================================================
// UPDATE USER
// ADMIN ONLY
// =====================================================

router.put(
  "/users/:id",
  authenticateToken,
  requireRole("admin"),
  updateUser
);

// =====================================================
// UPDATE USER STATUS
// ADMIN ONLY
// =====================================================

router.patch(
  "/users/:id/status",
  authenticateToken,
  requireRole("admin"),
  updateUserStatus
);

// =====================================================
// DELETE USER
// ADMIN ONLY
// =====================================================

router.delete(
  "/users/:id",
  authenticateToken,
  requireRole("admin"),
  deleteUser
);

module.exports = router;