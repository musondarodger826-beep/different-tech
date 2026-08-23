import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  UserRound,
  Map,
  Route,
  MapPin,
  ShieldAlert,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  History,
  CircleUserRound,
  Building2,
  ClipboardList,
  X,
  Plus,
} from "lucide-react";

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
  const [openGroups, setOpenGroups] = useState({
    Fleet: true,
    Tracking: true,
    Operations: true,
    Administration: true,
  });

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

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

  // =====================================================
  // LOGIN
  // =====================================================

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
      setMessage(
        error.message || "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("differentTechToken");
    localStorage.removeItem("differentTechUser");

    setToken(null);
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    if (!token) return;

    setUsersLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Users error:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  // =====================================================
  // CREATE USER
  // =====================================================

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

      if (
        !newUser.email.trim() &&
        !newUser.phone.trim()
      ) {
        throw new Error(
          "Email or phone number is required"
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
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
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create user"
        );
      }

      setCreateMessage(
        "User created successfully."
      );

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

  // =====================================================
  // NAVIGATION
  // =====================================================

  const toggleGroup = (group) => {
    setOpenGroups((previous) => ({
      ...previous,
      [group]: !previous[group],
    }));
  };

  const navigationItem = (
    page,
    Icon,
    label
  ) => (
    <button
      className={
        activePage === page
          ? "nav-item active"
          : "nav-item"
      }
      onClick={() => setActivePage(page)}
      key={page}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );

  const navigationGroup = (
    title,
    group,
    items
  ) => (
    <div className="nav-group" key={group}>
      <button
        className="nav-group-title"
        onClick={() => toggleGroup(group)}
      >
        <span>{title}</span>

        {openGroups[group] ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}
      </button>

      {openGroups[group] && (
        <div className="nav-group-items">
          {items.map((item) =>
            navigationItem(
              item.page,
              item.icon,
              item.label
            )
          )}
        </div>
      )}
    </div>
  );

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="logo-circle">
            DT
          </div>

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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
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

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            DT
          </div>

          <div>
            <h2>Different.Tech</h2>
            <span>Fleet Management</span>
          </div>

        </div>

        <nav>

          {navigationItem(
            "Dashboard",
            LayoutDashboard,
            "Dashboard"
          )}

          {navigationGroup(
            "FLEET",
            "Fleet",
            [
              {
                page: "Vehicles",
                icon: Truck,
                label: "Vehicles",
              },
              {
                page: "Drivers",
                icon: UserRound,
                label: "Drivers",
              },
            ]
          )}

          {navigationGroup(
            "TRACKING",
            "Tracking",
            [
              {
                page: "Live Tracking",
                icon: Map,
                label: "Live Tracking",
              },
              {
                page: "Trips",
                icon: Route,
                label: "Trips",
              },
              {
                page: "Route History",
                icon: History,
                label: "Route History",
              },
            ]
          )}

          {navigationGroup(
            "OPERATIONS",
            "Operations",
            [
              {
                page: "Geofences",
                icon: MapPin,
                label: "Geofences",
              },
              {
                page: "Truck Parks",
                icon: Building2,
                label: "Truck Parks",
              },
              {
                page: "Checkpoints",
                icon: ClipboardList,
                label: "Checkpoints",
              },
            ]
          )}

          {navigationItem(
            "Alerts",
            ShieldAlert,
            "Alerts"
          )}

          {navigationItem(
            "Reports",
            BarChart3,
            "Reports"
          )}

          {navigationGroup(
            "ADMINISTRATION",
            "Administration",
            [
              {
                page: "Users",
                icon: Users,
                label: "Users",
              },
              {
                page: "Roles & Permissions",
                icon: ShieldAlert,
                label: "Roles & Permissions",
              },
              {
                page: "Activity Log",
                icon: ClipboardList,
                label: "Activity Log",
              },
            ]
          )}

          {navigationItem(
            "Settings",
            Settings,
            "Settings"
          )}

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="avatar">
              {user?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.full_name ||
                  "Administrator"}
              </strong>

              <span>
                {user?.role || "admin"}
              </span>
            </div>

          </div>

          <button
            className="logout"
            onClick={logout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>{activePage}</h1>

            <p>
              Different.Tech Management Platform
            </p>
          </div>

          <div className="topbar-actions">

            <button className="notification-button">
              <ShieldAlert size={18} />
              <span className="notification-dot" />
            </button>

            <div className="top-profile">

              <div className="avatar">
                {user?.full_name
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>

              <div>
                <strong>
                  {user?.full_name ||
                    "Administrator"}
                </strong>

                <span>
                  {user?.role || "admin"}
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            DASHBOARD PAGE
        ================================================= */}

        {activePage === "Dashboard" && (
          <>

            <section className="welcome">

              <div>
                <span className="section-label">
                  FLEET OVERVIEW
                </span>

                <h2>
                  Welcome back,{" "}
                  {user?.full_name ||
                    "Administrator"}
                </h2>

                <p>
                  Monitor your fleet, drivers,
                  trips and operations from one
                  central platform.
                </p>
              </div>

              <div className="welcome-status">
                <span />
                System Online
              </div>

            </section>

            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon">
                  <Truck size={22} />
                </div>

                <div>
                  <span>Total Vehicles</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon online">
                  <Map size={22} />
                </div>

                <div>
                  <span>Vehicles Online</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon driver">
                  <UserRound size={22} />
                </div>

                <div>
                  <span>Drivers</span>
                  <strong>0</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon alert">
                  <ShieldAlert size={22} />
                </div>

                <div>
                  <span>Active Alerts</span>
                  <strong>0</strong>
                </div>
              </div>

            </section>

            <section className="dashboard-grid">

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h2>Live Fleet Tracking</h2>
                    <p>
                      Real-time vehicle monitoring
                    </p>
                  </div>

                  <span>
                    LIVE
                  </span>

                </div>

                <div className="empty-state">

                  <Map size={42} />

                  <h3>
                    Live tracking is ready
                  </h3>

                  <p>
                    Vehicle GPS locations will
                    appear here once vehicles are
                    registered and connected.
                  </p>

                </div>

              </div>

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h2>Recent Alerts</h2>
                    <p>
                      Fleet events requiring attention
                    </p>
                  </div>

                  <span className="alert-count">
                    0
                  </span>

                </div>

                <div className="empty-state small">

                  <ShieldAlert size={36} />

                  <p>
                    No active alerts.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

        {/* =================================================
            USERS
        ================================================= */}

        {activePage === "Users" && (
          <section className="panel users-panel">

            <div className="panel-header">

              <div>
                <span className="section-label">
                  ADMINISTRATION
                </span>

                <h2>System Users</h2>

                <p>
                  Manage Different.Tech users,
                  roles and access.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setShowCreateUser(true);
                  setCreateMessage("");
                }}
              >
                <Plus size={17} />
                Add User
              </button>

            </div>

            {usersLoading ? (

              <div className="loading">
                Loading users...
              </div>

            ) : users.length === 0 ? (

              <div className="empty-state">
                <Users size={40} />
                <h3>No users found</h3>
              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {users.map((item) => (

                      <tr key={item.id}>

                        <td>
                          #{item.id}
                        </td>

                        <td>
                          <strong>
                            {item.full_name}
                          </strong>
                        </td>

                        <td>
                          {item.email || "-"}
                        </td>

                        <td>
                          {item.phone || "-"}
                        </td>

                        <td>
                          <span className="role-badge">
                            {item.role}
                          </span>
                        </td>

                        <td>
                          <span className="status-badge">
                            <span />
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

        {/* =================================================
            CREATE USER MODAL
        ================================================= */}

        {showCreateUser && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowCreateUser(false)
            }
          >

            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>
                  <span className="section-label">
                    ADMINISTRATION
                  </span>

                  <h2>
                    Create New User
                  </h2>

                  <p>
                    Add a new user to
                    Different.Tech.
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowCreateUser(false)
                  }
                >
                  <X size={19} />
                </button>

              </div>

              <form onSubmit={createUser}>

                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="full_name"
                  placeholder="e.g. John Banda"
                  value={newUser.full_name}
                  onChange={handleNewUserChange}
                  required
                />

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="e.g. john@example.com"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                />

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="+260 97 1234567"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                />

                <small className="field-help">
                  Provide an email address or phone
                  number.
                </small>

                <label>
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  required
                  minLength="6"
                />

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                >
                  <option value="user">
                    User
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Administrator
                  </option>
                </select>

                {createMessage && (
                  <div
                    className={
                      createMessage.includes(
                        "successfully"
                      )
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
                    onClick={() =>
                      setShowCreateUser(false)
                    }
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

        {/* =================================================
            OTHER MODULES
        ================================================= */}

        {activePage !== "Dashboard" &&
          activePage !== "Users" && (

            <section className="panel coming-soon">

              <Map size={45} />

              <h2>
                {activePage}
              </h2>

              <p>
                This module has been added to the
                Different.Tech platform structure.
                We will connect it to the backend
                during the next development stage.
              </p>

            </section>

          )}

      </main>

    </div>
  );
}

export default App;