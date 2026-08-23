const express = require("express");

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireRole,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  register
);

// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  login
);

// =====================================================
// LOGOUT
// =====================================================

router.post(
  "/logout",
  authenticateToken,
  logout
);

// =====================================================
// GET CURRENT LOGGED-IN USER
// =====================================================

router.get(
  "/me",
  authenticateToken,
  getMe
);

// =====================================================
// ADMIN TEST ROUTE
// =====================================================

router.get(
  "/admin-test",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to the admin area",
      user: req.user,
    });
  }
);

module.exports = router;