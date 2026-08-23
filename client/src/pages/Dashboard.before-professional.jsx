import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

export default function Dashboard({ onNavigate }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const response = await fetch(
        `${API_URL}/api/locations/latest`
      );

      const data = await response.json();

      if (data.success) {
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  const totalVehicles = locations.length;

  const moving = locations.filter(
    (vehicle) =>
      Number(vehicle.speed || 0) > 0 &&
      vehicle.latitude !== null &&
      vehicle.longitude !== null
  ).length;

  const stopped = locations.filter(
    (vehicle) =>
      Number(vehicle.speed || 0) === 0 &&
      vehicle.latitude !== null &&
      vehicle.longitude !== null
  ).length;

  const offline = locations.filter(
    (vehicle) =>
      vehicle.latitude === null ||
      vehicle.longitude === null
  ).length;

  return (
    <section className="panel">

      {/* HEADER */}

      <div className="panel-header">

        <div>
          <span className="section-label">
            DASHBOARD
          </span>

          <h2>
            Different.Tech Fleet Dashboard
          </h2>

          <p>
            Fleet operations and vehicle tracking
            overview.
          </p>
        </div>

        <div className="welcome-status">
          <span />
          SYSTEM ONLINE
        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginTop: "25px",
        }}
      >

        {/* TOTAL */}

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            TOTAL VEHICLES
          </div>

          <strong
            style={{
              display: "block",
              fontSize: "32px",
              marginTop: "8px",
            }}
          >
            {loading ? "..." : totalVehicles}
          </strong>
        </div>

        {/* MOVING */}

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
          }}
        >
          <div
            style={{
              color: "#15803d",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            🟢 MOVING
          </div>

          <strong
            style={{
              display: "block",
              fontSize: "32px",
              marginTop: "8px",
              color: "#16a34a",
            }}
          >
            {loading ? "..." : moving}
          </strong>
        </div>

        {/* STOPPED */}

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              color: "#1d4ed8",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            🔵 STOPPED
          </div>

          <strong
            style={{
              display: "block",
              fontSize: "32px",
              marginTop: "8px",
              color: "#2563eb",
            }}
          >
            {loading ? "..." : stopped}
          </strong>
        </div>

        {/* OFFLINE */}

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          <div
            style={{
              color: "#b91c1c",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            🔴 OFFLINE
          </div>

          <strong
            style={{
              display: "block",
              fontSize: "32px",
              marginTop: "8px",
              color: "#dc2626",
            }}
          >
            {loading ? "..." : offline}
          </strong>
        </div>

      </div>

      {/* QUICK ACCESS */}

      <div
        style={{
          marginTop: "30px",
        }}
      >

        <h3>
          Fleet Operations
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "15px",
          }}
        >

          <button
            onClick={() =>
              onNavigate("vehicles")
            }
            style={{
              padding: "22px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong>
              🚛 Vehicles
            </strong>

            <p>
              Manage fleet vehicles and vehicle
              information.
            </p>
          </button>

          <button
            onClick={() =>
              onNavigate("tracking")
            }
            style={{
              padding: "22px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong>
              📍 Live Tracking
            </strong>

            <p>
              Monitor vehicle GPS positions in
              real time.
            </p>
          </button>

          <button
            onClick={() =>
              onNavigate("vehicles")
            }
            style={{
              padding: "22px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong>
              🚨 Fleet Alerts
            </strong>

            <p>
              Monitor vehicle conditions and
              operational warnings.
            </p>
          </button>

        </div>

      </div>

    </section>
  );
}