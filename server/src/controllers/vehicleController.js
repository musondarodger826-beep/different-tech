const vehicleModel = require("../models/vehicleModel");

// GET all vehicles
async function getVehicles(req, res) {
  try {
    const vehicles = await vehicleModel.getAllVehicles();

    res.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load vehicles",
    });
  }
}

// GET vehicle by ID
async function getVehicleById(req, res) {
  try {
    const vehicle = await vehicleModel.getVehicleById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error("Get vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load vehicle",
    });
  }
}

// CREATE vehicle
async function createVehicle(req, res) {
  try {
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
    } = req.body;

    if (!fleet_number || !registration_number) {
      return res.status(400).json({
        success: false,
        message:
          "Fleet number and registration number are required",
      });
    }

    const vehicle = await vehicleModel.createVehicle({
      fleet_number,
      registration_number,
      vehicle_type,
      make,
      model,
      year,
      vin,
      gps_imei,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Create vehicle error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "Fleet number, registration number, or GPS IMEI already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
    });
  }
}

// UPDATE vehicle
async function updateVehicle(req, res) {
  try {
    const vehicle = await vehicleModel.updateVehicle(
      req.params.id,
      req.body
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Update vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
}

// DELETE vehicle
async function deleteVehicle(req, res) {
  try {
    const deleted = await vehicleModel.deleteVehicle(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
}

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};