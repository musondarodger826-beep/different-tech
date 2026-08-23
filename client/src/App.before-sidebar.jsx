import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import LiveTracking from "./pages/LiveTracking";
import Vehicles from "./pages/Vehicles";

export default function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  function navigate(page) {
    setActivePage(page);
  }

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={navigate}
          />
        );

      case "vehicles":
        return <Vehicles />;

      case "tracking":
        return <LiveTracking />;

      default:
        return (
          <Dashboard
            onNavigate={navigate}
          />
        );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f8fafc",
      }}
    >

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "#111827",
          color: "#ffffff",
          padding: "20px 15px",
          boxSizing: "border-box",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >

        {/* LOGO */}

        <div
          style={{
            padding:
              "10px 12px 25px",
            borderBottom:
              "1px solid #374151",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            DIFFERENT<span
              style={{
                color: "#d4af37",
              }}
            >
              .TECH
            </span>
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              marginTop: "4px",
            }}
          >
            FLEET TRACKING PLATFORM
          </div>
        </div>

        {/* DASHBOARD */}

        <button
          onClick={() =>
            navigate("dashboard")
          }
          style={menuStyle(
            activePage === "dashboard"
          )}
        >
          📊 Dashboard
        </button>

        {/* FLEET */}

        <div style={sectionStyle}>
          FLEET
        </div>

        <button
          onClick={() =>
            navigate("vehicles")
          }
          style={menuStyle(
            activePage === "vehicles"
          )}
        >
          🚛 Vehicles
        </button>

        <button
          style={menuStyle(false)}
        >
          👤 Drivers
        </button>

        <button
          style={menuStyle(false)}
        >
          🚚 Convoys
        </button>

        {/* TRACKING */}

        <div style={sectionStyle}>
          TRACKING
        </div>

        <button
          onClick={() =>
            navigate("tracking")
          }
          style={menuStyle(
            activePage === "tracking"
          )}
        >
          📍 Live Tracking
        </button>

        <button
          style={menuStyle(false)}
        >
          🛣️ Trips
        </button>

        <button
          style={menuStyle(false)}
        >
          🕘 Route History
        </button>

        <button
          style={menuStyle(false)}
        >
          🛡️ Escort Tracking
        </button>

        {/* OPERATIONS */}

        <div style={sectionStyle}>
          OPERATIONS
        </div>

        <button
          style={menuStyle(false)}
        >
          📐 Geofences
        </button>

        <button
          style={menuStyle(false)}
        >
          🅿️ Truck Parks
        </button>

        <button
          style={menuStyle(false)}
        >
          📍 Checkpoints
        </button>

        <button
          style={menuStyle(false)}
        >
          🛣️ Routes
        </button>

        {/* MANAGEMENT */}

        <div style={sectionStyle}>
          MANAGEMENT
        </div>

        <button
          style={menuStyle(false)}
        >
          🚨 Alerts
        </button>

        <button
          style={menuStyle(false)}
        >
          📑 Reports
        </button>

        {/* ADMIN */}

        <div style={sectionStyle}>
          ADMINISTRATION
        </div>

        <button
          style={menuStyle(false)}
        >
          👥 Employees
        </button>

        <button
          style={menuStyle(false)}
        >
          🔐 Users
        </button>

        <button
          style={menuStyle(false)}
        >
          ⚙️ Settings
        </button>

      </aside>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
        }}
      >

        {/* TOP BAR */}

        <header
          style={{
            height: "65px",
            background: "#ffffff",
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            padding: "0 25px",
            boxSizing: "border-box",
          }}
        >

          <strong>
            Different.Tech
          </strong>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                background:
                  "#16a34a",
                borderRadius: "50%",
              }}
            />

            System Online
          </div>

        </header>

        {/* PAGE */}

        <div
          style={{
            padding: "25px",
          }}
        >
          {renderPage()}
        </div>

      </main>

    </div>
  );
}

/* ================================================
   MENU STYLES
================================================ */

function menuStyle(active) {
  return {
    width: "100%",
    border: "none",
    borderRadius: "8px",
    padding: "11px 12px",
    marginBottom: "5px",
    textAlign: "left",
    cursor: "pointer",

    background: active
      ? "#d4af37"
      : "transparent",

    color: active
      ? "#111827"
      : "#d1d5db",

    fontWeight: active
      ? "700"
      : "500",

    fontSize: "14px",
  };
}

const sectionStyle = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#6b7280",
  marginTop: "20px",
  marginBottom: "7px",
  paddingLeft: "12px",
  letterSpacing: "1px",
};