const express = require("express");

const { pool } = require("../config/database");

const router = express.Router();

// =====================================================
// POST /api/locations
// Record GPS location
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      vehicle_id,
      latitude,
      longitude,
      speed = 0,
      heading = 0,
      ignition_status = 0,
    } = req.body;

    // Validate vehicle ID
    if (!vehicle_id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    // Validate GPS coordinates
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Check vehicle exists
    const [vehicle] = await pool.query(
      "SELECT id FROM vehicles WHERE id = ? LIMIT 1",
      [vehicle_id]
    );

    if (vehicle.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Insert GPS location
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

    res.status(201).json({
      success: true,
      message: "Vehicle location recorded successfully",
      location: {
        id: result.insertId,
        vehicle_id,
        latitude,
        longitude,
        speed,
        heading,
        ignition_status,
      },
    });
  } catch (error) {
    console.error(
      "GPS location error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to record vehicle location",
    });
  }
});

// =====================================================
// GET /api/locations/latest
// Latest GPS location for every vehicle
// =====================================================

router.get("/latest", async (req, res) => {
  try {
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
          ORDER BY vl2.recorded_at DESC
          LIMIT 1
        )

      ORDER BY v.fleet_number ASC
    `);

    res.json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error(
      "Latest GPS locations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load latest vehicle locations",
    });
  }
});

// =====================================================
// GET /api/locations/vehicle/:vehicleId
// GPS history for one vehicle
// =====================================================

router.get(
  "/vehicle/:vehicleId",
  async (req, res) => {
    try {
      const { vehicleId } = req.params;

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
        ORDER BY recorded_at DESC
        LIMIT 500
        `,
        [vehicleId]
      );

      res.json({
        success: true,
        locations,
      });
    } catch (error) {
      console.error(
        "Vehicle location history error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to load vehicle location history",
      });
    }
  }
);

module.exports = router;