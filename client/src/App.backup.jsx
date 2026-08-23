import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("differentTechToken")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("differentTechUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [activePage, setActivePage] = useState("Dashboard");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // CREATE USER
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  // LOGIN
  const login = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("differentTechToken", data.token);
      localStorage.setItem(
        "differentTechUser",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("differentTechToken");
    localStorage.removeItem("differentTechUser");

    setToken(null);
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // LOAD USERS
  const loadUsers = async () => {
    if (!token) return;

    setUsersLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Users error:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  // CREATE USER
  const createUser = async (e) => {
    e.preventDefault();

    setCreateMessage("");
    setCreateLoading(true);

    try {
      if (!newUser.full_name.trim()) {
        throw new Error("Full name is required");
      }

      if (!newUser.password) {
        throw new Error("Password is required");
      }

      if (!newUser.email.trim() && !newUser.phone.trim()) {
        throw new Error("Email or phone number is required");
      }

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: newUser.full_name.trim(),
          email: newUser.email.trim() || null,
          phone: newUser.phone.trim() || null,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create user");
      }

      setCreateMessage("User created successfully.");

      setNewUser({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });

      await loadUsers();

      setTimeout(() => {
        setShowCreateUser(false);
        setCreateMessage("");
      }, 1200);
    } catch (error) {
      setCreateMessage(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  // HANDLE CREATE FORM
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;

    setNewUser((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (activePage === "Users" && token) {
      loadUsers();
    }
  }, [activePage, token]);

  // LOGIN PAGE
  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo-circle">DT</div>

          <h1>Different.Tech</h1>

          <p className="subtitle">
            Truck Management & Tracking Platform
          </p>

          <form onSubmit={login}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <div className="login-footer">
            Different.Tech © 2026
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">DT</div>

          <div>
            <h2>Different.Tech</h2>
            <span>Fleet Management</span>
          </div>
        </div>

        <nav>

          <button
            className={activePage === "Dashboard" ? "active" : ""}
            onClick={() => setActivePage("Dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className={activePage === "Users" ? "active" : ""}
            onClick={() => setActivePage("Users")}
          >
            👥 Users
          </button>

          <button
            className={activePage === "Vehicles" ? "active" : ""}
            onClick={() => setActivePage("Vehicles")}
          >
            🚛 Vehicles
          </button>

          <button
            className={activePage === "Drivers" ? "active" : ""}
            onClick={() => setActivePage("Drivers")}
          >
            👨‍✈️ Drivers
          </button>

          <button
            className={activePage === "Live Tracking" ? "active" : ""}
            onClick={() => setActivePage("Live Tracking")}
          >
            🗺️ Live Tracking
          </button>

          <button
            className={activePage === "Trips" ? "active" : ""}
            onClick={() => setActivePage("Trips")}
          >
            📍 Trips
          </button>

          <button
            className={activePage === "Geofences" ? "active" : ""}
            onClick={() => setActivePage("Geofences")}
          >
            🔵 Geofences
          </button>

          <button
            className={activePage === "Alerts" ? "active" : ""}
            onClick={() => setActivePage("Alerts")}
          >
            🚨 Alerts
          </button>

          <button
            className={activePage === "Reports" ? "active" : ""}
            onClick={() => setActivePage("Reports")}
          >
            📈 Reports
          </button>

          <button
            className={activePage === "Settings" ? "active" : ""}
            onClick={() => setActivePage("Settings")}
          >
            ⚙️ Settings
          </button>

        </nav>

        <button className="logout" onClick={logout}>
          🚪 Logout
        </button>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>{activePage}</h1>
            <p>Different.Tech Management Platform</p>
          </div>

          <div className="profile">

            <div className="avatar">
              {user?.full_name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.full_name || "Administrator"}
              </strong>

              <span>
                {user?.role || "admin"}
              </span>
            </div>

          </div>

        </header>

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (
          <>
            <section className="welcome">

              <div>
                <h2>
                  Welcome back,{" "}
                  {user?.full_name || "Administrator"}!
                </h2>

                <p>
                  Monitor your fleet, users, drivers and operations
                  from one place.
                </p>
              </div>

            </section>

            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon">🚛</div>

                <div>
                  <span>Total Vehicles</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🟢</div>

                <div>
                  <span>Vehicles Online</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👨‍✈️</div>

                <div>
                  <span>Drivers</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🚨</div>

                <div>
                  <span>Active Alerts</span>
                  <strong>0</strong>
                </div>
              </div>

            </section>

            <section className="dashboard-grid">

              <div className="panel">

                <div className="panel-header">
                  <h2>Fleet Overview</h2>
                  <span>Live</span>
                </div>

                <div className="empty-state">

                  <div>🗺️</div>

                  <h3>Live tracking is ready</h3>

                  <p>
                    Vehicle GPS tracking will appear here once
                    vehicles are registered.
                  </p>

                </div>

              </div>

              <div className="panel">

                <div className="panel-header">
                  <h2>Recent Alerts</h2>
                  <span>0</span>
                </div>

                <div className="empty-state small">

                  <div>🔔</div>

                  <p>No active alerts.</p>

                </div>

              </div>

            </section>
          </>
        )}

        {/* USERS */}

        {activePage === "Users" && (
          <section className="panel users-panel">

            <div className="panel-header">

              <div>
                <h2>System Users</h2>
                <p>
                  Manage Different.Tech platform users.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setShowCreateUser(true);
                  setCreateMessage("");
                }}
              >
                + Add User
              </button>

            </div>

            {usersLoading ? (
              <div className="loading">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">

                <div>👥</div>

                <h3>No users found</h3>

              </div>
            ) : (
              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>

                  </thead>

                  <tbody>

                    {users.map((item) => (
                      <tr key={item.id}>

                        <td>{item.id}</td>

                        <td>{item.full_name}</td>

                        <td>{item.email || "-"}</td>

                        <td>{item.phone || "-"}</td>

                        <td>
                          <span className="role-badge">
                            {item.role}
                          </span>
                        </td>

                        <td>
                          <span className="status-badge">
                            {item.status}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>
        )}

        {/* CREATE USER MODAL */}

        {showCreateUser && (
          <div
            className="modal-overlay"
            onClick={() => setShowCreateUser(false)}
          >

            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>
                  <h2>Create New User</h2>

                  <p>
                    Add a new user to Different.Tech.
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() => setShowCreateUser(false)}
                >
                  ×
                </button>

              </div>

              <form onSubmit={createUser}>

                <label>Full Name *</label>

                <input
                  type="text"
                  name="full_name"
                  placeholder="e.g. John Banda"
                  value={newUser.full_name}
                  onChange={handleNewUserChange}
                  required
                />

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="e.g. john@example.com"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                />

                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +260971234567"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                />

                <small className="field-help">
                  Provide an email address or phone number.
                </small>

                <label>Password *</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  required
                  minLength="6"
                />

                <label>Role</label>

                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>

                {createMessage && (
                  <div
                    className={
                      createMessage.includes("successfully")
                        ? "success-message"
                        : "error-message"
                    }
                  >
                    {createMessage}
                  </div>
                )}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowCreateUser(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="create-button"
                    disabled={createLoading}
                  >
                    {createLoading
                      ? "Creating..."
                      : "Create User"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* OTHER MODULES */}

        {activePage !== "Dashboard" &&
          activePage !== "Users" && (
            <section className="panel coming-soon">

              <div>🚧</div>

              <h2>{activePage}</h2>

              <p>
                This module is ready for development.
                We will connect it to the Different.Tech
                backend next.
              </p>

            </section>
          )}

      </main>
    </div>
  );
}

export default App;