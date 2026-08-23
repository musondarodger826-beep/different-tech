const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDatabaseConnection } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

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

app.listen(PORT, async () => {
  console.log(`Different.Tech API running on port ${PORT}`);

  await testDatabaseConnection();
});