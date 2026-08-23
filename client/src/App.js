import { useState } from "react";

import {
  LayoutDashboard,
  Truck,
  Users,
  UsersRound,
  Route,
  MapPinned,
  Navigation,
  History,
  ShieldCheck,
  Fence,
  Map,
  MapPinCheck,
  BellRing,
  FileText,
  UserCog,
  UserRound,
  Building2,
  Settings,
  Activity,
  ChevronDown,
  ChevronRight,
  LogOut,
  Radio,
  CircleAlert,
  Shield,
} from "lucide-react";

import "./App.css";

import ActivityLog from "./pages/admin/ActivityLog";
import Dashboard from "./pages/Dashboard";
import LiveTracking from "./pages/LiveTracking";
import Vehicles from "./pages/Vehicles";

const API_URL = "http://127.0.0.1:5000";

export default function App() {
  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [token, setToken] = useState(
    localStorage.getItem("differentTechToken")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("differentTechUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [email, setEmail] = useState("musonda@different.tech");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const [activePage, setActivePage] = useState("dashboard");

  const [openSections, setOpenSections] = useState({
    fleet: true,
    tracking: true,
    operations: true,
    management: true,
  });

  // =====================================================
  // LOGIN
  // =====================================================

  async function login(event) {
    event.preventDefault();

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

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "differentTechToken",
        data.token
      );

      localStorage.setItem(
        "differentTechUser",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);
      setPassword("");
      setMessage("");
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.message || "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("differentTechToken");
    localStorage.removeItem("differentTechUser");

    setToken(null);
    setUser(null);
    setPassword("");
    setMessage("");
    setActivePage("dashboard");
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  function navigate(page) {
    setActivePage(page);
  }

  function toggleSection(section) {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  }

  // =====================================================
  // PAGE RENDERING
  // =====================================================

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;

      case "vehicles":
        return <Vehicles />;

      case "tracking":
        return <LiveTracking />;

      case "activity-log":
        return <ActivityLog />;

      default:
        return (
          <PlaceholderPage
            title={getPageTitle(activePage)}
          />
        );
    }
  }

  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  if (!token) {
    return (
      <div className="login-screen">

        <div className="login-background-grid"></div>

        <div className="login-glow login-glow-one"></div>
        <div className="login-glow login-glow-two"></div>

        <div className="login-container">

          {/* BRAND */}

          <div className="login-brand">

            <div className="login-logo">
              DT
            </div>

            <div className="login-brand-text">

              <div className="login-brand-name">
                DIFFERENT<span>.TECH</span>
              </div>

              <div className="login-brand-subtitle">
                FLEET MANAGEMENT PLATFORM
              </div>

            </div>

          </div>

          {/* LOGIN CARD */}

          <div className="login-card">

            <div className="login-card-header">

              <div className="login-status">
                <span className="login-status-dot"></span>
                SYSTEM ONLINE
              </div>

              <h1>
                Administrator Sign In
              </h1>

              <p>
                Secure access to the Different.Tech
                fleet management and tracking platform.
              </p>

            </div>

            <form onSubmit={login}>

              {/* EMAIL */}

              <div className="login-field">

                <label>
                  EMAIL ADDRESS
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    @
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="login-field">

                <label>
                  PASSWORD
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    ●
                  </span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* ERROR */}

              {message && (
                <div className="login-error">

                  <span>!</span>

                  <div>
                    {message}
                  </div>

                </div>
              )}

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "AUTHENTICATING..."
                    : "SIGN IN"}
                </span>

                {!loading && (
                  <span className="login-submit-arrow">
                    →
                  </span>
                )}

              </button>

            </form>

            {/* SECURITY */}

            <div className="login-security">

              <div className="security-icon">
                ✓
              </div>

              <div>

                <strong>
                  Secure Administrator Access
                </strong>

                <span>
                  Your connection is protected by
                  authenticated access control.
                </span>

              </div>

            </div>

          </div>

          {/* FEATURES */}

          <div className="login-features">

            <LoginFeature
              icon={<Truck />}
              color="blue"
              title="FLEET"
              description="Vehicle Management"
            />

            <LoginFeature
              icon={<Radio />}
              color="green"
              title="TRACKING"
              description="Live GPS Monitoring"
            />

            <LoginFeature
              icon={<Navigation />}
              color="orange"
              title="OPERATIONS"
              description="Logistics Control"
            />

            <LoginFeature
              icon={<Shield />}
              color="purple"
              title="SECURITY"
              description="Access Management"
            />

          </div>

          {/* FOOTER */}

          <div className="login-footer">

            <span>
              ● Different.Tech Systems Online
            </span>

            <span>
              © 2026 Different.Tech
            </span>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (
    <div className="app-shell">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-name">
            DIFFERENT<span>.TECH</span>
          </div>

          <div className="brand-subtitle">
            FLEET TRACKING PLATFORM
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <NavButton
            icon={<LayoutDashboard />}
            color="blue"
            label="Dashboard"
            active={activePage === "dashboard"}
            onClick={() => navigate("dashboard")}
            main
          />

          {/* FLEET MANAGEMENT */}

          <SectionButton
            title="FLEET MANAGEMENT"
            icon={<Truck />}
            color="blue"
            open={openSections.fleet}
            onClick={() => toggleSection("fleet")}
          />

          {openSections.fleet && (
            <div className="submenu">

              <NavButton
                icon={<Truck />}
                color="blue"
                label="Vehicles"
                active={activePage === "vehicles"}
                onClick={() => navigate("vehicles")}
              />

              <NavButton
                icon={<Users />}
                color="green"
                label="Drivers"
                active={activePage === "drivers"}
                onClick={() => navigate("drivers")}
              />

              <NavButton
                icon={<UsersRound />}
                color="orange"
                label="Convoys"
                active={activePage === "convoys"}
                onClick={() => navigate("convoys")}
              />

            </div>
          )}

          {/* TRACKING */}

          <SectionButton
            title="TRACKING & MONITORING"
            icon={<Radio />}
            color="cyan"
            open={openSections.tracking}
            onClick={() => toggleSection("tracking")}
          />

          {openSections.tracking && (
            <div className="submenu">

              <NavButton
                icon={<MapPinned />}
                color="green"
                label="Live Tracking"
                active={activePage === "tracking"}
                onClick={() => navigate("tracking")}
              />

              <NavButton
                icon={<Navigation />}
                color="blue"
                label="Trips"
                active={activePage === "trips"}
                onClick={() => navigate("trips")}
              />

              <NavButton
                icon={<History />}
                color="purple"
                label="Route History"
                active={activePage === "route-history"}
                onClick={() =>
                  navigate("route-history")
                }
              />

              <NavButton
                icon={<ShieldCheck />}
                color="orange"
                label="Escort Tracking"
                active={
                  activePage === "escort-tracking"
                }
                onClick={() =>
                  navigate("escort-tracking")
                }
              />

            </div>
          )}

          {/* OPERATIONS */}

          <SectionButton
            title="OPERATIONS"
            icon={<Navigation />}
            color="orange"
            open={openSections.operations}
            onClick={() =>
              toggleSection("operations")
            }
          />

          {openSections.operations && (
            <div className="submenu">

              <NavButton
                icon={<Fence />}
                color="cyan"
                label="Geofences"
                active={activePage === "geofences"}
                onClick={() =>
                  navigate("geofences")
                }
              />

              <NavButton
                icon={<Building2 />}
                color="green"
                label="Truck Parks"
                active={
                  activePage === "truck-parks"
                }
                onClick={() =>
                  navigate("truck-parks")
                }
              />

              <NavButton
                icon={<MapPinCheck />}
                color="red"
                label="Checkpoints"
                active={
                  activePage === "checkpoints"
                }
                onClick={() =>
                  navigate("checkpoints")
                }
              />

              <NavButton
                icon={<Route />}
                color="blue"
                label="Routes"
                active={activePage === "routes"}
                onClick={() => navigate("routes")}
              />

            </div>
          )}

          {/* MANAGEMENT */}

          <SectionButton
            title="MANAGEMENT"
            icon={<UserCog />}
            color="purple"
            open={openSections.management}
            onClick={() =>
              toggleSection("management")
            }
          />

          {openSections.management && (
            <div className="submenu">

              <NavButton
                icon={<BellRing />}
                color="red"
                label="Alerts"
                active={activePage === "alerts"}
                onClick={() => navigate("alerts")}
              />

              <NavButton
                icon={<FileText />}
                color="blue"
                label="Reports"
                active={activePage === "reports"}
                onClick={() => navigate("reports")}
              />

              <NavButton
                icon={<UserRound />}
                color="green"
                label="Employees"
                active={activePage === "employees"}
                onClick={() =>
                  navigate("employees")
                }
              />

              <NavButton
                icon={<Users />}
                color="cyan"
                label="Users"
                active={activePage === "users"}
                onClick={() => navigate("users")}
              />

              <NavButton
                icon={<Building2 />}
                color="gold"
                label="Tenants"
                active={activePage === "tenants"}
                onClick={() => navigate("tenants")}
              />

              <NavButton
                icon={<Shield />}
                color="purple"
                label="Roles & Permissions"
                active={activePage === "roles"}
                onClick={() => navigate("roles")}
              />

              <NavButton
                icon={<Activity />}
                color="slate"
                label="Activity Log"
                active={
                  activePage === "activity-log"
                }
                onClick={() =>
                  navigate("activity-log")
                }
              />

            </div>
          )}

          {/* SETTINGS */}

          <NavButton
            icon={<Settings />}
            color="slate"
            label="Settings"
            active={activePage === "settings"}
            onClick={() => navigate("settings")}
            main
          />

        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="sidebar-footer">

          <div className="connection-status">

            <span className="connection-dot"></span>

            <div>

              <strong>
                System Online
              </strong>

              <small>
                GPS services active
              </small>

            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="topbar-title">

            <span className="topbar-brand">
              Different<span>.Tech</span>
            </span>

            <span className="topbar-divider">
              /
            </span>

            <span className="topbar-page">
              {getPageTitle(activePage)}
            </span>

          </div>

          <div className="topbar-right">

            <div className="topbar-system-status">

              <span className="status-dot"></span>

              <span>
                System Online
              </span>

            </div>

            <div className="user-profile">

              <div className="user-avatar">
                DT
              </div>

              <div className="user-info">

                <strong>
                  {user?.full_name ||
                    "Different.Tech"}
                </strong>

                <small>
                  {user?.role ||
                    "Administrator"}
                </small>

              </div>

              <button
                type="button"
                className="logout-button"
                onClick={logout}
              >
                <LogOut size={14} />
                Logout
              </button>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <section className="page-content">
          {renderPage()}
        </section>

      </main>

    </div>
  );
}

// =========================================================
// LOGIN FEATURE
// =========================================================

function LoginFeature({
  icon,
  color,
  title,
  description,
}) {
  return (
    <div className="login-feature">

      <div
        className={`feature-icon feature-${color}`}
      >
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>

    </div>
  );
}

// =========================================================
// PAGE TITLES
// =========================================================

function getPageTitle(page) {
  const titles = {
    dashboard: "Dashboard",

    vehicles: "Vehicles",
    drivers: "Drivers",
    convoys: "Convoys",

    tracking: "Live Tracking",
    trips: "Trips",
    "route-history": "Route History",
    "escort-tracking": "Escort Tracking",

    geofences: "Geofences",
    "truck-parks": "Truck Parks",
    checkpoints: "Checkpoints",
    routes: "Routes",

    alerts: "Alerts",
    reports: "Reports",
    employees: "Employees",
    users: "Users",
    tenants: "Tenants",
    roles: "Roles & Permissions",
    "activity-log": "Activity Log",

    settings: "Settings",
  };

  return titles[page] || "Dashboard";
}

// =========================================================
// SECTION BUTTON
// =========================================================

function SectionButton({
  title,
  icon,
  color = "blue",
  open,
  onClick,
}) {
  return (
    <button
      type="button"
      className="section-button"
      onClick={onClick}
    >

      <span className="section-left">

        <span
          className={`section-icon section-icon-${color}`}
        >
          {icon}
        </span>

        <span>
          {title}
        </span>

      </span>

      <span className="section-arrow">

        {open ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}

      </span>

    </button>
  );
}

// =========================================================
// NAVIGATION BUTTON
// =========================================================

function NavButton({
  icon,
  color = "blue",
  label,
  active = false,
  onClick,
  main = false,
}) {
  return (
    <button
      type="button"
      className={`nav-button ${
        active ? "active" : ""
      } ${main ? "nav-main-button" : ""}`}
      onClick={onClick}
    >

      <span
        className={`nav-icon nav-icon-${color}`}
      >
        {icon}
      </span>

      <span className="nav-label">
        {label}
      </span>

      {active && (
        <span className="nav-active-indicator"></span>
      )}

    </button>
  );
}

// =========================================================
// PLACEHOLDER PAGE
// =========================================================

function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">

      <div className="placeholder-label">
        DIFFERENT.TECH
      </div>

      <h1>
        {title}
      </h1>

      <p>
        This module is ready for implementation.
      </p>

    </div>
  );
}