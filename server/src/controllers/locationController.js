const {
  createLocation,
  getLatestLocations,
  getVehicleLocationHistory,
} = require("../models/locationModel");

// =====================================================
// CREATE LOCATION
// =====================================================

async function addLocation(req, res) {
  try {
    const {
      vehicle_id,
      latitude,
      longitude,
      speed,
      heading,
      ignition_status,
    } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude are required",
      });
    }

    const location = await createLocation({
      vehicle_id,
      latitude,
      longitude,
      speed,
      heading,
      ignition_status,
    });

    res.status(201).json({
      success: true,
      message:
        "Vehicle location recorded successfully",
      location,
    });
  } catch (error) {
    console.error(
      "Add location error:",
      error
    );

    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to record vehicle location",
    });
  }
}

// =====================================================
// GET LATEST LOCATIONS
// =====================================================

async function latestLocations(req, res) {
  try {
    const locations =
      await getLatestLocations();

    res.json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error(
      "Latest locations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load latest vehicle locations",
    });
  }
}

// =====================================================
// GET VEHICLE LOCATION HISTORY
// =====================================================

async function vehicleLocationHistory(
  req,
  res
) {
  try {
    const { vehicleId } = req.params;

    const locations =
      await getVehicleLocationHistory(
        vehicleId
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

module.exports = {
  addLocation,
  latestLocations,
  vehicleLocationHistory,
};