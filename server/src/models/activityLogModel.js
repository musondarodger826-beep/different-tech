const { pool } = require("../config/database");

// =====================================================
// CREATE ACTIVITY LOG
// =====================================================

async function createActivityLog({
  user_id = null,
  action,
  description = null,
  entity_type = null,
  entity_id = null,
  ip_address = null,
  user_agent = null,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO activity_logs
    (
      user_id,
      action,
      description,
      entity_type,
      entity_id,
      ip_address,
      user_agent
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user_id,
      action,
      description,
      entity_type,
      entity_id,
      ip_address,
      user_agent,
    ]
  );

  return result.insertId;
}

// =====================================================
// GET ACTIVITY LOGS
// =====================================================

async function getActivityLogs() {
  const [logs] = await pool.query(
    `
    SELECT
      al.id,
      al.user_id,
      u.full_name,
      u.email,
      al.action,
      al.description,
      al.entity_type,
      al.entity_id,
      al.ip_address,
      al.user_agent,
      al.created_at
    FROM activity_logs al
    LEFT JOIN users u
      ON al.user_id = u.id
    ORDER BY al.created_at DESC
    `
  );

  return logs;
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createActivityLog,
  getActivityLogs,
};