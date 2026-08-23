const express = require("express");

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

// Get all vehicles
router.get("/", getVehicles);

// Get one vehicle
router.get("/:id", getVehicleById);

// Create vehicle
router.post("/", createVehicle);

// Update vehicle
router.put("/:id", updateVehicle);

// Delete vehicle
router.delete("/:id", deleteVehicle);

module.exports = router;