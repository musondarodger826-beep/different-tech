import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const API_URL = "http://127.0.0.1:5000";

// =====================================================
// VEHICLE STATUS
// =====================================================

function getVehicleStatus(vehicle) {
  const latitude = Number(vehicle.latitude);
  const longitude = Number(vehicle.longitude);
  const speed = Number(vehicle.speed || 0);

  const hasGps =
    vehicle.latitude !== null &&
    vehicle.longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  if (!hasGps) {
    return {
      status: "OFFLINE",
      label: "OFFLINE / CRITICAL",
      color: "#dc2626",
    };
  }

  if (speed > 0) {
    return {
      status: "MOVING",
      label: "MOVING",
      color: "#16a34a",
    };
  }

  if (vehicle.ignition_status) {
    return {
      status: "IDLE",
      label: "IDLE / WARNING",
      color: "#eab308",
    };
  }

  return {
    status: "STOPPED",
    label: "STOPPED",
    color: "#2563eb",
  };
}

// =====================================================
// COLORED VEHICLE ICON
// =====================================================

function createVehicleIcon(color) {
  return L.divIcon({
    className: "different-tech-vehicle-marker",

    html: `
      <div
        style="
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 21px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        "
      >
        🚛
      </div>
    `,

    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

// =====================================================
// MAP FIT
// =====================================================

function MapFitVehicles({ vehicles }) {
  const map = useMap();

  useEffect(() => {
    if (!vehicles.length) {
      return;
    }

    const bounds = L.latLngBounds(
      vehicles.map((vehicle) => [
        Number(vehicle.latitude),
        Number(vehicle.longitude),
      ])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 13,
    });
  }, [vehicles, map]);

  return null;
}

// =====================================================
// SELECTED VEHICLE MAP CONTROLLER
// =====================================================

function MapVehicleController({
  selectedVehicle,
  markerRefs,
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedVehicle) {
      return;
    }

    const latitude = Number(selectedVehicle.latitude);
    const longitude = Number(selectedVehicle.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    map.setView(
      [latitude, longitude],
      16,
      {
        animate: true,
      }
    );

    const marker =
      markerRefs.current[selectedVehicle.vehicle_id];

    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 400);
    }
  }, [selectedVehicle, map, markerRefs]);

  return null;
}

// =====================================================
// STATUS CARD
// =====================================================

function StatusCard({
  title,
  count,
  color,
  background,
}) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "14px",
        background,
        border: `1px solid ${color}40`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color,
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: color,
          }}
        />

        {title}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "28px",
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {count}
      </div>
    </div>
  );
}

// =====================================================
// LIVE TRACKING PAGE
// =====================================================

export default function LiveTracking() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  const markerRefs = useRef({});

  // ===================================================
  // LOAD VEHICLE LOCATIONS
  // ===================================================

  async function loadLocations() {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/locations/latest`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load vehicle locations"
        );
      }

      const newLocations = data.locations || [];

      setLocations(newLocations);

      setSelectedVehicle((current) => {
        if (!current) {
          return newLocations[0] || null;
        }

        return (
          newLocations.find(
            (vehicle) =>
              vehicle.vehicle_id ===
              current.vehicle_id
          ) || current
        );
      });
    } catch (err) {
      console.error(
        "Live tracking error:",
        err
      );

      setError(
        err.message ||
          "Unable to load vehicle locations"
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // INITIAL LOAD + 10 SECOND REFRESH
  // ===================================================

  useEffect(() => {
    loadLocations();

    const interval = setInterval(
      loadLocations,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  // ===================================================
  // VEHICLES WITH GPS
  // ===================================================

  const mappedVehicles = useMemo(() => {
    return locations.filter((vehicle) => {
      const latitude = Number(vehicle.latitude);
      const longitude = Number(vehicle.longitude);

      return (
        vehicle.latitude !== null &&
        vehicle.longitude !== null &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });
  }, [locations]);

  // ===================================================
  // STATUS COUNTS
  // ===================================================

  const statusCounts = useMemo(() => {
    let moving = 0;
    let stopped = 0;
    let idle = 0;
    let offline = 0;

    locations.forEach((vehicle) => {
      const status = getVehicleStatus(vehicle);

      if (status.status === "MOVING") {
        moving++;
      } else if (status.status === "STOPPED") {
        stopped++;
      } else if (status.status === "IDLE") {
        idle++;
      } else if (status.status === "OFFLINE") {
        offline++;
      }
    });

    return {
      moving,
      stopped,
      idle,
      offline,
    };
  }, [locations]);

  // ===================================================
  // TOTALS
  // ===================================================

  const totalVehicles = locations.length;
  const gpsOnline = mappedVehicles.length;
  const withoutGps =
    totalVehicles - gpsOnline;

  // ===================================================
  // SELECT VEHICLE
  // ===================================================

  function selectVehicle(vehicle) {
    if (
      vehicle.latitude === null ||
      vehicle.longitude === null
    ) {
      return;
    }

    setSelectedVehicle(vehicle);
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section className="panel">
        <div className="loading">
          Loading vehicle locations...
        </div>
      </section>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <section className="panel">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="panel-header">
        <div>
          <span className="section-label">
            TRACKING
          </span>

          <h2>
            Live Fleet Tracking
          </h2>

          <p>
            Monitor vehicle GPS locations
            in real time.
          </p>
        </div>

        <div className="welcome-status">
          <span />
          LIVE
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =================================================
          MAIN SUMMARY
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >

        <StatusCard
          title="TOTAL VEHICLES"
          count={totalVehicles}
          color="#111827"
          background="#f8fafc"
        />

        <StatusCard
          title="MOVING"
          count={statusCounts.moving}
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatusCard
          title="STOPPED"
          count={statusCounts.stopped}
          color="#2563eb"
          background="#eff6ff"
        />

        <StatusCard
          title="IDLE / WARNING"
          count={statusCounts.idle}
          color="#eab308"
          background="#fefce8"
        />

        <StatusCard
          title="OFFLINE / CRITICAL"
          count={statusCounts.offline}
          color="#dc2626"
          background="#fef2f2"
        />
      </div>

      {/* =================================================
          GPS SUMMARY
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginTop: "15px",
        }}
      >

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
          }}
        >
          <span
            style={{
              color: "#6b7280",
              fontSize: "12px",
            }}
          >
            GPS ONLINE
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "22px",
              color: "#16a34a",
            }}
          >
            {gpsOnline}
          </strong>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
          }}
        >
          <span
            style={{
              color: "#6b7280",
              fontSize: "12px",
            }}
          >
            WITHOUT GPS
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "22px",
              color:
                withoutGps > 0
                  ? "#dc2626"
                  : "#16a34a",
            }}
          >
            {withoutGps}
          </strong>
        </div>
      </div>

      {/* =================================================
          VEHICLES
      ================================================= */}

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "15px",
        }}
      >

        {locations.map((vehicle) => {
          const vehicleStatus =
            getVehicleStatus(vehicle);

          const speed =
            Number(vehicle.speed || 0);

          const hasGps =
            vehicle.latitude !== null &&
            vehicle.longitude !== null;

          const isSelected =
            selectedVehicle?.vehicle_id ===
            vehicle.vehicle_id;

          return (
            <div
              key={vehicle.vehicle_id}
              onClick={() =>
                selectVehicle(vehicle)
              }
              style={{
                padding: "18px",
                borderRadius: "14px",
                background: isSelected
                  ? "#fffbeb"
                  : "#ffffff",
                border: isSelected
                  ? "2px solid #d4af37"
                  : "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.06)",
                cursor: hasGps
                  ? "pointer"
                  : "not-allowed",
              }}
            >

              {/* VEHICLE HEADER */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                }}
              >

                <div>
                  <strong
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    {vehicle.fleet_number}
                  </strong>

                  <div
                    style={{
                      color: "#6b7280",
                      marginTop: "3px",
                    }}
                  >
                    {vehicle.registration_number}
                  </div>
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "20px",
                    background:
                      `${vehicleStatus.color}20`,
                    color:
                      vehicleStatus.color,
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  {vehicleStatus.label}
                </div>
              </div>

              {/* DETAILS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                  marginTop: "18px",
                  fontSize: "13px",
                }}
              >

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Vehicle
                  </span>

                  <strong
                    style={{
                      display: "block",
                    }}
                  >
                    {vehicle.vehicle_type}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Speed
                  </span>

                  <strong
                    style={{
                      display: "block",
                    }}
                  >
                    {speed.toFixed(0)} km/h
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Ignition
                  </span>

                  <strong
                    style={{
                      display: "block",
                      color:
                        vehicle.ignition_status
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >
                    {vehicle.ignition_status
                      ? "ON"
                      : "OFF"}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Heading
                  </span>

                  <strong
                    style={{
                      display: "block",
                    }}
                  >
                    {Number(
                      vehicle.heading || 0
                    ).toFixed(0)}
                    °
                  </strong>
                </div>
              </div>

              {/* GPS */}

              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "12px",
                  borderTop:
                    "1px solid #e5e7eb",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                {hasGps
                  ? "📍 Click to locate vehicle"
                  : "⚠️ No GPS coordinates"}
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================
          MAP
      ================================================= */}

      <div
        style={{
          height: "600px",
          width: "100%",
          marginTop: "25px",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >

        <MapContainer
          center={[-12.9706, 28.6333]}
          zoom={7}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* VEHICLE MARKERS */}

          {mappedVehicles.map((vehicle) => {
            const latitude =
              Number(vehicle.latitude);

            const longitude =
              Number(vehicle.longitude);

            const vehicleStatus =
              getVehicleStatus(vehicle);

            return (
              <Marker
                key={vehicle.vehicle_id}
                position={[
                  latitude,
                  longitude,
                ]}
                icon={createVehicleIcon(
                  vehicleStatus.color
                )}
                ref={(marker) => {
                  if (marker) {
                    markerRefs.current[
                      vehicle.vehicle_id
                    ] = marker;
                  }
                }}
              >

                <Popup>

                  <div
                    style={{
                      minWidth: "240px",
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 8px",
                      }}
                    >
                      🚛{" "}
                      {vehicle.fleet_number}
                    </h3>

                    <strong>
                      {
                        vehicle.registration_number
                      }
                    </strong>

                    <hr />

                    <div>
                      <strong>
                        Vehicle:
                      </strong>{" "}
                      {vehicle.vehicle_type}
                    </div>

                    <div>
                      <strong>
                        Make:
                      </strong>{" "}
                      {vehicle.make}
                    </div>

                    <div>
                      <strong>
                        Model:
                      </strong>{" "}
                      {vehicle.model}
                    </div>

                    <div>
                      <strong>
                        Speed:
                      </strong>{" "}
                      {Number(
                        vehicle.speed || 0
                      ).toFixed(0)}{" "}
                      km/h
                    </div>

                    <div>
                      <strong>
                        Heading:
                      </strong>{" "}
                      {Number(
                        vehicle.heading || 0
                      ).toFixed(0)}
                      °
                    </div>

                    <div>
                      <strong>
                        Ignition:
                      </strong>{" "}

                      <span
                        style={{
                          color:
                            vehicle.ignition_status
                              ? "#16a34a"
                              : "#dc2626",
                          fontWeight:
                            "700",
                        }}
                      >
                        {vehicle.ignition_status
                          ? "ON"
                          : "OFF"}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: "10px",
                        padding: "7px",
                        borderRadius: "8px",
                        background:
                          `${vehicleStatus.color}20`,
                        color:
                          vehicleStatus.color,
                        fontWeight: "800",
                      }}
                    >
                      ●{" "}
                      {vehicleStatus.label}
                    </div>

                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      GPS Coordinates:
                      <br />

                      {latitude.toFixed(6)},{" "}
                      {longitude.toFixed(6)}

                      <br />
                      <br />

                      Last GPS update:
                      <br />

                      {vehicle.recorded_at ||
                        "No GPS update"}
                    </div>

                  </div>

                </Popup>

              </Marker>
            );
          })}

          <MapFitVehicles
            vehicles={mappedVehicles}
          />

          <MapVehicleController
            selectedVehicle={
              selectedVehicle
            }
            markerRefs={markerRefs}
          />

        </MapContainer>

      </div>

    </section>
  );
}