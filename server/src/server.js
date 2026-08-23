const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDatabaseConnection } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const locationRoutes = require("./routes/locationRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// ADMIN ROUTES
// =====================================================

app.use("/api/admin", adminRoutes);

// =====================================================
// VEHICLE ROUTES
// =====================================================

app.use("/api/vehicles", vehicleRoutes);

// =====================================================
// GPS LOCATION ROUTES
// =====================================================

app.use("/api/locations", locationRoutes);

// =====================================================
// ACTIVITY LOG ROUTES
// =====================================================

app.use("/api/activity-logs", activityLogRoutes);

// =====================================================
// TEST API ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Different.Tech API is running",
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Different.Tech API running on port ${PORT}`);
});