const { pool } = require("../config/database");

// Get all vehicles
async function getAllVehicles() {
  const [rows] = await pool.query(`
    SELECT
      id,
      fleet_number,
      registration_number,
      vehicle_type,
      make,
      model,
      year,
      vin,
      gps_imei,
      status,
      created_at,
      updated_at
    FROM vehicles
    ORDER BY id DESC
  `);

  return rows;
}

// Get vehicle by ID
async function getVehicleById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        fleet_number,
        registration_number,
        vehicle_type,
        make,
        model,
        year,
        vin,
        gps_imei,
        status,
        created_at,
        updated_at
      FROM vehicles
      WHERE id = ?
    `,
    [id]
  );

  return rows[0];
}

// Create vehicle
async function createVehicle(vehicle) {
  const {
    fleet_number,
    registration_number,
    vehicle_type,
    make,
    model,
    year,
    vin,
    gps_imei,
    status,
  } = vehicle;

  const [result] = await pool.query(
    `
      INSERT INTO vehicles (
        fleet_number,
        registration_number,
        vehicle_type,
        make,
        model,
        year,
        vin,
        gps_imei,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      fleet_number,
      registration_number,
      vehicle_type || "Truck",
      make || null,
      model || null,
      year || null,
      vin || null,
      gps_imei || null,
      status || "active",
    ]
  );

  return getVehicleById(result.insertId);
}

// Update vehicle
async function updateVehicle(id, vehicle) {
  const {
    fleet_number,
    registration_number,
    vehicle_type,
    make,
    model,
    year,
    vin,
    gps_imei,
    status,
  } = vehicle;

  await pool.query(
    `
      UPDATE vehicles
      SET
        fleet_number = ?,
        registration_number = ?,
        vehicle_type = ?,
        make = ?,
        model = ?,
        year = ?,
        vin = ?,
        gps_imei = ?,
        status = ?
      WHERE id = ?
    `,
    [
      fleet_number,
      registration_number,
      vehicle_type || "Truck",
      make || null,
      model || null,
      year || null,
      vin || null,
      gps_imei || null,
      status || "active",
      id,
    ]
  );

  return getVehicleById(id);
}

// Delete vehicle
async function deleteVehicle(id) {
  const [result] = await pool.query(
    "DELETE FROM vehicles WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};