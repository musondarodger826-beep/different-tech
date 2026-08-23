const { pool } = require("../config/database");

// =====================================================
// CREATE VEHICLE LOCATION
// =====================================================

async function createLocation({
  vehicle_id,
  latitude,
  longitude,
  speed = 0,
  heading = 0,
  ignition_status = 0,
}) {
  const [vehicle] = await pool.query(
    "SELECT id FROM vehicles WHERE id = ? LIMIT 1",
    [vehicle_id]
  );

  if (vehicle.length === 0) {
    throw new Error("Vehicle not found");
  }

  const [result] = await pool.query(
    `
    INSERT INTO vehicle_locations
    (
      vehicle_id,
      latitude,
      longitude,
      speed,
      heading,
      ignition_status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      vehicle_id,
      latitude,
      longitude,
      speed,
      heading,
      ignition_status,
    ]
  );

  return {
    id: result.insertId,
    vehicle_id,
    latitude,
    longitude,
    speed,
    heading,
    ignition_status,
  };
}

// =====================================================
// GET LATEST LOCATION FOR ALL VEHICLES
// =====================================================

async function getLatestLocations() {
  const [locations] = await pool.query(`
    SELECT
      v.id AS vehicle_id,
      v.fleet_number,
      v.registration_number,
      v.vehicle_type,
      v.make,
      v.model,
      v.status AS vehicle_status,

      vl.latitude,
      vl.longitude,
      vl.speed,
      vl.heading,
      vl.ignition_status,
      vl.recorded_at

    FROM vehicles v

    LEFT JOIN vehicle_locations vl
      ON vl.id = (
        SELECT vl2.id
        FROM vehicle_locations vl2
        WHERE vl2.vehicle_id = v.id
        ORDER BY vl2.recorded_at DESC, vl2.id DESC
        LIMIT 1
      )

    ORDER BY v.fleet_number ASC
  `);

  return locations;
}

// =====================================================
// GET LOCATION HISTORY FOR ONE VEHICLE
// =====================================================

async function getVehicleLocationHistory(vehicleId) {
  const [locations] = await pool.query(
    `
    SELECT
      id,
      vehicle_id,
      latitude,
      longitude,
      speed,
      heading,
      ignition_status,
      recorded_at
    FROM vehicle_locations
    WHERE vehicle_id = ?
    ORDER BY recorded_at DESC, id DESC
    LIMIT 500
    `,
    [vehicleId]
  );

  return locations;
}

module.exports = {
  createLocation,
  getLatestLocations,
  getVehicleLocationHistory,
};