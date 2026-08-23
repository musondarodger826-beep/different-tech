const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createActivityLog,
} = require("../models/activityLogModel");

const {
  findUserByEmail,
  findUserByPhone,
  createUser,
  findUserById,
} = require("../models/userModel");

// =====================================================
// REGISTER USER
// =====================================================

async function register(req, res) {
  try {
    const {
      full_name,
      email,
      phone,
      password,
    } = req.body;

    // Validate required fields
    if (!full_name || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name and password are required",
      });
    }

    // Require email or phone
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required",
      });
    }

    // Check duplicate email
    if (email) {
      const existingEmail =
        await findUserByEmail(email);

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }
    }

    // Check duplicate phone
    if (phone) {
      const existingPhone =
        await findUserByPhone(phone);

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
    }

    // Hash password
    const password_hash =
      await bcrypt.hash(password, 12);

    // Create user
    const userId = await createUser({
      full_name,
      email,
      phone,
      password_hash,
    });

    // Activity log
    try {
      await createActivityLog({
        user_id: userId,
        action: "REGISTER",
        description: `${full_name} registered a new account`,
        entity_type: "user",
        entity_id: userId,
        ip_address: req.ip,
        user_agent: req.get("user-agent"),
      });
    } catch (logError) {
      console.error(
        "Registration activity log error:",
        logError
      );
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: userId,
        full_name,
        email: email || null,
        phone: phone || null,
        role: "user",
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
}

// =====================================================
// LOGIN USER
// =====================================================

async function login(req, res) {
  try {
    const {
      email,
      phone,
      password,
    } = req.body;

    // Validate login fields
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone and password are required",
      });
    }

    // Find user
    const user = email
      ? await findUserByEmail(email)
      : await findUserByPhone(phone);

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // Check account status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}`,
      });
    }

    // Check password
    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Get safe user information
    const userData =
      await findUserById(user.id);

    // =================================================
    // ACTIVITY LOG - LOGIN
    // =================================================

    try {
      await createActivityLog({
        user_id: user.id,
        action: "LOGIN",
        description:
          `${user.full_name} logged into Different.Tech`,
        entity_type: "user",
        entity_id: user.id,
        ip_address: req.ip,
        user_agent: req.get("user-agent"),
      });
    } catch (logError) {
      console.error(
        "Login activity log error:",
        logError
      );
    }

    // Login response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
}

// =====================================================
// LOGOUT USER
// =====================================================

async function logout(req, res) {
  try {
    const user =
      await findUserById(req.user.id);

    if (user) {
      try {
        await createActivityLog({
          user_id: user.id,
          action: "LOGOUT",
          description:
            `${user.full_name} logged out of Different.Tech`,
          entity_type: "user",
          entity_id: user.id,
          ip_address: req.ip,
          user_agent: req.get("user-agent"),
        });
      } catch (logError) {
        console.error(
          "Logout activity log error:",
          logError
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to logout",
    });
  }
}

// =====================================================
// GET CURRENT LOGGED-IN USER
// =====================================================

async function getMe(req, res) {
  try {
    const user =
      await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve user profile",
    });
  }
}

// =====================================================
// EXPORT CONTROLLER FUNCTIONS
// =====================================================

module.exports = {
  register,
  login,
  logout,
  getMe,
};