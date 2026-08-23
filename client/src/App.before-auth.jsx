import { useEffect, useState } from "react";
import ActivityLog from "./pages/admin/ActivityLog";

import Dashboard from "./pages/Dashboard";
import LiveTracking from "./pages/LiveTracking";
import Vehicles from "./pages/Vehicles";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [openSections, setOpenSections] = useState({
    fleet: true,
    tracking: true,
    operations: true,
    management: true,
  });

  function navigate(page) {
    setActivePage(page);
  }

  function toggleSection(section) {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  }

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
      return <PlaceholderPage title={getPageTitle(activePage)} />;
  }
}
  return (
    <div className="app-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <button
            className={`dashboard-button ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("dashboard")}
          >
            <span className="menu-icon dashboard-icon">
              ▣
            </span>

            <span>Dashboard</span>
          </button>


          {/* =================================================
              FLEET MANAGEMENT
          ================================================= */}

          <SectionButton
            title="FLEET MANAGEMENT"
            icon="▣"
            color="blue"
            open={openSections.fleet}
            onClick={() => toggleSection("fleet")}
          />

          {openSections.fleet && (
            <div className="submenu">

              <NavButton
                icon="▣"
                color="blue"
                label="Vehicles"
                active={activePage === "vehicles"}
                onClick={() => navigate("vehicles")}
              />

              <NavButton
                icon="●"
                color="green"
                label="Drivers"
                active={activePage === "drivers"}
                onClick={() => navigate("drivers")}
              />

              <NavButton
                icon="◆"
                color="orange"
                label="Convoys"
                active={activePage === "convoys"}
                onClick={() => navigate("convoys")}
              />

            </div>
          )}


          {/* =================================================
              TRACKING & MONITORING
          ================================================= */}

          <SectionButton
            title="TRACKING & MONITORING"
            icon="◉"
            color="cyan"
            open={openSections.tracking}
            onClick={() => toggleSection("tracking")}
          />

          {openSections.tracking && (
            <div className="submenu">

              <NavButton
                icon="●"
                color="green"
                label="Live Tracking"
                active={activePage === "tracking"}
                onClick={() => navigate("tracking")}
              />

              <NavButton
                icon="↗"
                color="blue"
                label="Trips"
                active={activePage === "trips"}
                onClick={() => navigate("trips")}
              />

              <NavButton
                icon="◷"
                color="purple"
                label="Route History"
                active={activePage === "route-history"}
                onClick={() => navigate("route-history")}
              />

              <NavButton
                icon="◆"
                color="orange"
                label="Escort Tracking"
                active={activePage === "escort-tracking"}
                onClick={() => navigate("escort-tracking")}
              />

            </div>
          )}


          {/* =================================================
              OPERATIONS
          ================================================= */}

          <SectionButton
            title="OPERATIONS"
            icon="⚙"
            color="orange"
            open={openSections.operations}
            onClick={() => toggleSection("operations")}
          />

          {openSections.operations && (
            <div className="submenu">

              <NavButton
                icon="◎"
                color="cyan"
                label="Geofences"
                active={activePage === "geofences"}
                onClick={() => navigate("geofences")}
              />

              <NavButton
                icon="▣"
                color="green"
                label="Truck Parks"
                active={activePage === "truck-parks"}
                onClick={() => navigate("truck-parks")}
              />

              <NavButton
                icon="⌖"
                color="red"
                label="Checkpoints"
                active={activePage === "checkpoints"}
                onClick={() => navigate("checkpoints")}
              />

              <NavButton
                icon="◈"
                color="blue"
                label="Routes"
                active={activePage === "routes"}
                onClick={() => navigate("routes")}
              />

            </div>
          )}


          {/* =================================================
              MANAGEMENT
          ================================================= */}

          <SectionButton
            title="MANAGEMENT"
            icon="●"
            color="purple"
            open={openSections.management}
            onClick={() => toggleSection("management")}
          />

          {openSections.management && (
            <div className="submenu">

              <NavButton
                icon="!"
                color="red"
                label="Alerts"
                active={activePage === "alerts"}
                onClick={() => navigate("alerts")}
              />

              <NavButton
                icon="▥"
                color="blue"
                label="Reports"
                active={activePage === "reports"}
                onClick={() => navigate("reports")}
              />

              <NavButton
                icon="●"
                color="green"
                label="Employees"
                active={activePage === "employees"}
                onClick={() => navigate("employees")}
              />

              <NavButton
                icon="●"
                color="cyan"
                label="Users"
                active={activePage === "users"}
                onClick={() => navigate("users")}
              />

              <NavButton
                icon="◆"
                color="gold"
                label="Tenants"
                active={activePage === "tenants"}
                onClick={() => navigate("tenants")}
              />

              <NavButton
                icon="⚙"
                color="purple"
                label="Roles & Permissions"
                active={activePage === "roles"}
                onClick={() => navigate("roles")}
              />

              <NavButton
                icon="▤"
                color="slate"
                label="Activity Log"
                active={activePage === "activity-log"}
                onClick={() => navigate("activity-log")}
              />

            </div>
          )}


          {/* =================================================
              SETTINGS
          ================================================= */}

          <button
            className={`settings-button ${
              activePage === "settings" ? "active" : ""
            }`}
            onClick={() => navigate("settings")}
          >
            <span className="menu-icon settings-icon">
              ⚙
            </span>

            <span>Settings</span>
          </button>

        </nav>


        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <div className="sidebar-footer">

          <div className="connection-status">

            <span className="connection-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>GPS services active</small>
            </div>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

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
                  Different.Tech
                </strong>

                <small>
                  Administrator
                </small>

              </div>

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


/* =========================================================
   PAGE TITLES
========================================================= */

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


/* =========================================================
   COLLAPSIBLE SECTION BUTTON
========================================================= */

function SectionButton({
  title,
  icon,
  color = "blue",
  open,
  onClick,
}) {
  return (
    <button
      className="section-button"
      onClick={onClick}
    >

      <span className="section-left">

        <span className={`section-icon icon-${color}`}>
          {icon}
        </span>

        <span>
          {title}
        </span>

      </span>

      <span className="section-arrow">
        {open ? "▲" : "▼"}
      </span>

    </button>
  );
}


/* =========================================================
   NAVIGATION BUTTON
========================================================= */

function NavButton({
  icon,
  color = "blue",
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      className={`nav-button ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      <span className={`nav-icon icon-${color}`}>
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );
}


/* =========================================================
   PLACEHOLDER PAGE
========================================================= */

function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        padding: "30px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
      }}
    >
      <div
        style={{
          color: "#2563eb",
          fontSize: "11px",
          fontWeight: "800",
          letterSpacing: "1.5px",
          marginBottom: "8px",
        }}
      >
        DIFFERENT.TECH
      </div>

      <h1
        style={{
          margin: "0 0 8px",
          color: "#0f172a",
          fontSize: "24px",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        This module is ready for implementation.
      </p>
    </div>
  );
}