const {
  getActivityLogs: getLogsFromModel,
} = require("../models/activityLogModel");

// =====================================================
// GET ACTIVITY LOGS
// =====================================================

async function getActivityLogs(req, res) {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 100,
      500
    );

    const logs = await getLogsFromModel(limit);

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get activity logs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve activity logs",
    });
  }
}

module.exports = {
  getActivityLogs,
};