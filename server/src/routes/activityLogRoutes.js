const express = require("express");

const {
  getActivityLogs,
} = require("../controllers/activityLogController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  requireRole,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// GET ACTIVITY LOGS
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  authenticateToken,
  requireRole("admin"),
  getActivityLogs
);

module.exports = router;