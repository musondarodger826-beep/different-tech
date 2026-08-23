```jsx
import { useEffect, useMemo, useState } from "react";

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
    vehicle.latitude !== undefined &&
    vehicle.longitude !== null &&
    vehicle.longitude !== undefined &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  // 🔴 OFFLINE / CRITICAL
  if (!hasGps) {
    return {
      status: "CRITICAL",
      label: "OFFLINE",
      color: "#dc2626",
      background: "#fee2e2",
      textColor: "#991b1b",
      priority: 4,
    };
  }

  // 🟢 MOVING
  if (speed > 0) {
    return {
      status: "MOVING",
      label: "MOVING",
      color: "#16a34a",
      background: "#dcfce7",
      textColor: "#166534",
      priority: 1,
    };
  }

  // 🟡 IDLE / WARNING
  // GPS is available, but ignition is ON while speed is 0.
  if (
    vehicle.ignition_status === true ||
    vehicle.ignition_status === 1 ||
    vehicle.ignition_status === "1" ||
    vehicle.ignition_status === "ON"
  ) {
    return {
      status: "IDLE",
      label: "IDLE / WARNING",
      color: "#eab308",
      background: "#fef9c3",
      textColor: "#854d0e",
      priority: 2,
    };
  }

  // 🔵 STOPPED
  return {
    status: "STOPPED",
    label: "STOPPED",
    color: "#2563eb",
    background: "#dbeafe",
    textColor: "#1e40af",
    priority: 3,
  };
}

// =====================================================
// VEHICLE ICON
// =====================================================

const createVehicleIcon = (color, selected = false) =>
  L.divIcon({
    className: "different-tech-vehicle-marker",

    html: `
      <div style="
        width: ${selected ? "50px" : "44px"};
        height: ${selected ? "50px" : "44px"};
        border-radius: 50%;
        background: ${color};
        border: ${selected ? "4px" : "3px"} solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: ${selected ? "25px" : "22px"};
        box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        ${selected ? "outline: 3px solid rgba(212,175,55,0.8);" : ""}
      ">
        🚛
      </div>
    `,

    iconSize: selected ? [50, 50] : [44, 44],
    iconAnchor: selected
      ? [25, 25]
      : [22, 22],
    popupAnchor: [0, selected ? -25 : -22],
  });

// =====================================================
// MAP FIT ALL VEHICLES
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
// MAP VEHICLE SELECTION
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

    const latitude = Number(
      selectedVehicle.latitude
    );

    const longitude = Number(
      selectedVehicle.longitude
    );

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
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
      markerRefs.current[
        selectedVehicle.vehicle_id
      ];

    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 400);
    }
  }, [
    selectedVehicle,
    map,
    markerRefs,
  ]);

  return null;
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

  // ===================================================
  // LEAFLET MARKER REFERENCES
  // ===================================================

  const markerRefs = useState(() => ({
    current: {},
  }))[0];

  // ===================================================
  // LOAD VEHICLE GPS DATA
  // ===================================================

  const loadLocations = async () => {
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

      setLocations(data.locations || []);
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
  };

  // ===================================================
  // REFRESH EVERY 10 SECONDS
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
      const latitude = Number(
        vehicle.latitude
      );

      const longitude = Number(
        vehicle.longitude
      );

      return (
        vehicle.latitude !== null &&
        vehicle.latitude !== undefined &&
        vehicle.longitude !== null &&
        vehicle.longitude !== undefined &&
        !Number.isNaN(latitude) &&
        !Number.isNaN(longitude)
      );
    });
  }, [locations]);

  // ===================================================
  // STATUS COUNTS
  // ===================================================

  const statusCounts = useMemo(() => {
    const counts = {
      moving: 0,
      stopped: 0,
      idle: 0,
      offline: 0,
    };

    locations.forEach((vehicle) => {
      const status =
        getVehicleStatus(vehicle);

      if (status.status === "MOVING") {
        counts.moving++;
      } else if (
        status.status === "STOPPED"
      ) {
        counts.stopped++;
      } else if (
        status.status === "IDLE"
      ) {
        counts.idle++;
      } else if (
        status.status === "CRITICAL"
      ) {
        counts.offline++;
      }
    });

    return counts;
  }, [locations]);

  // ===================================================
  // COUNTS
  // ===================================================

  const totalVehicles = locations.length;

  const gpsOnline = mappedVehicles.length;

  const withoutGps =
    totalVehicles - gpsOnline;

  // ===================================================
  // SELECT VEHICLE
  // ===================================================

  const selectVehicle = (vehicle) => {
    const latitude = Number(
      vehicle.latitude
    );

    const longitude = Number(
      vehicle.longitude
    );

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return;
    }

    setSelectedVehicle(vehicle);
  };

  // ===================================================
  // KEEP SELECTED VEHICLE UPDATED
  // ===================================================

  useEffect(() => {
    if (!selectedVehicle) {
      return;
    }

    const updatedVehicle =
      locations.find(
        (vehicle) =>
          vehicle.vehicle_id ===
          selectedVehicle.vehicle_id
      );

    if (updatedVehicle) {
      setSelectedVehicle(updatedVehicle);
    }
  }, [locations, selectedVehicle]);

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
          LOADING
      ================================================= */}

      {loading && (
        <div className="loading">
          Loading vehicle locations...
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY
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

        {/* TOTAL */}

        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            TOTAL VEHICLES
          </div>

          <strong
            style={{
              fontSize: "26px",
            }}
          >
            {totalVehicles}
          </strong>
        </div>

        {/* MOVING */}

        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#166534",
            }}
          >
            🟢 MOVING
          </div>

          <strong
            style={{
              fontSize: "26px",
              color: "#16a34a",
            }}
          >
            {statusCounts.moving}
          </strong>
        </div>

        {/* STOPPED */}

        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#1e40af",
            }}
          >
            🔵 STOPPED
          </div>

          <strong
            style={{
              fontSize: "26px",
              color: "#2563eb",
            }}
          >
            {statusCounts.stopped}
          </strong>
        </div>

        {/* IDLE */}

        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#fefce8",
            border: "1px solid #fde68a",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#854d0e",
            }}
          >
            🟡 IDLE / WARNING
          </div>

          <strong
            style={{
              fontSize: "26px",
              color: "#eab308",
            }}
          >
            {statusCounts.idle}
          </strong>
        </div>

        {/* OFFLINE */}

        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#991b1b",
            }}
          >
            🔴 OFFLINE
          </div>

          <strong
            style={{
              fontSize: "26px",
              color: "#dc2626",
            }}
          >
            {statusCounts.offline}
          </strong>
        </div>

      </div>

      {/* =================================================
          GPS SUMMARY
      ================================================= */}

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        <span>
          GPS Online:{" "}
          <strong
            style={{
              color: "#16a34a",
            }}
          >
            {gpsOnline}
          </strong>
        </span>

        <span>
          Without GPS:{" "}
          <strong
            style={{
              color:
                withoutGps > 0
                  ? "#dc2626"
                  : "#16a34a",
            }}
          >
            {withoutGps}
          </strong>
        </span>

        <span>
          Auto refresh:{" "}
          <strong>
            10 seconds
          </strong>
        </span>
      </div>

      {/* =================================================
          VEHICLE CARDS
      ================================================= */}

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "15px",
        }}
      >

        {locations.map((vehicle) => {

          const latitude =
            Number(vehicle.latitude);

          const longitude =
            Number(vehicle.longitude);

          const hasGps =
            !Number.isNaN(latitude) &&
            !Number.isNaN(longitude) &&
            vehicle.latitude !== null &&
            vehicle.longitude !== null;

          const speed =
            Number(vehicle.speed || 0);

          const isSelected =
            selectedVehicle?.vehicle_id ===
            vehicle.vehicle_id;

          const vehicleStatus =
            getVehicleStatus(vehicle);

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
                  : `1px solid ${vehicleStatus.color}40`,

                boxShadow:
                  isSelected
                    ? "0 6px 18px rgba(212,175,55,0.25)"
                    : "0 4px 12px rgba(0,0,0,0.06)",

                cursor: hasGps
                  ? "pointer"
                  : "not-allowed",

                transition:
                  "all 0.2s ease",
              }}
            >

              {/* VEHICLE HEADER */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
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
                      fontSize: "14px",
                    }}
                  >
                    {vehicle.registration_number}
                  </div>

                </div>

                {/* STATUS BADGE */}

                <span
                  style={{
                    padding: "5px 9px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                    background:
                      vehicleStatus.background,
                    color:
                      vehicleStatus.textColor,
                  }}
                >
                  {vehicleStatus.label}
                </span>

              </div>

              {/* VEHICLE DETAILS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "10px",
                  fontSize: "13px",
                }}
              >

                {/* TYPE */}

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Type
                  </span>

                  <br />

                  <strong>
                    {vehicle.vehicle_type ||
                      "N/A"}
                  </strong>
                </div>

                {/* SPEED */}

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Speed
                  </span>

                  <br />

                  <strong>
                    {speed.toFixed(0)} km/h
                  </strong>
                </div>

                {/* IGNITION */}

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Ignition
                  </span>

                  <br />

                  <strong
                    style={{
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

                {/* HEADING */}

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Heading
                  </span>

                  <br />

                  <strong>
                    {Number(
                      vehicle.heading || 0
                    ).toFixed(0)}
                    °
                  </strong>
                </div>

              </div>

              {/* STATUS INDICATOR */}

              <div
                style={{
                  marginTop: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 11px",
                  borderRadius: "20px",
                  background:
                    vehicleStatus.background,
                  color:
                    vehicleStatus.textColor,
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >

                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    background:
                      vehicleStatus.color,
                    display: "inline-block",
                  }}
                />

                {vehicleStatus.label}

              </div>

              {/* CLICK TO LOCATE */}

              {hasGps && (
                <div
                  style={{
                    marginTop: "14px",
                    paddingTop: "10px",
                    borderTop:
                      "1px solid #e5e7eb",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  📍 Click to locate vehicle
                </div>
              )}

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
          borderRadius: "14px",
          overflow: "hidden",
          marginTop: "25px",
        }}
      >

        <MapContainer
          center={[-12.9706, 28.6333]}
          zoom={7}
          style={{
            height: "100%",
            width: "100%",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* =================================================
              VEHICLE MARKERS
          ================================================= */}

          {mappedVehicles.map(
            (vehicle) => {

              const latitude =
                Number(vehicle.latitude);

              const longitude =
                Number(vehicle.longitude);

              const vehicleStatus =
                getVehicleStatus(vehicle);

              const isSelected =
                selectedVehicle?.vehicle_id ===
                vehicle.vehicle_id;

              return (
                <Marker
                  key={vehicle.vehicle_id}
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={createVehicleIcon(
                    vehicleStatus.color,
                    isSelected
                  )}
                  ref={(marker) => {
                    if (marker) {
                      markerRefs.current[
                        vehicle.vehicle_id
                      ] = marker;
                    }
                  }}
                >

                  {/* VEHICLE POPUP */}

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
                        {
                          vehicle.vehicle_type ||
                          "N/A"
                        }
                      </div>

                      <div>
                        <strong>
                          Make:
                        </strong>{" "}
                        {vehicle.make ||
                          "N/A"}
                      </div>

                      <div>
                        <strong>
                          Model:
                        </strong>{" "}
                        {vehicle.model ||
                          "N/A"}
                      </div>

                      <div>
                        <strong>
                          Speed:
                        </strong>{" "}
                        {
                          Number(
                            vehicle.speed ||
                              0
                          ).toFixed(0)
                        }{" "}
                        km/h
                      </div>

                      <div>
                        <strong>
                          Heading:
                        </strong>{" "}
                        {
                          Number(
                            vehicle.heading ||
                              0
                          ).toFixed(0)
                        }
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

                      {/* STATUS */}

                      <div
                        style={{
                          marginTop: "10px",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          background:
                            vehicleStatus.background,
                          color:
                            vehicleStatus.textColor,
                          fontWeight: "700",
                        }}
                      >
                        ●{" "}
                        {vehicleStatus.label}
                      </div>

                      {/* GPS */}

                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        <strong>
                          GPS Coordinates:
                        </strong>

                        <br />

                        {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}

                        <br />
                        <br />

                        <strong>
                          Last GPS update:
                        </strong>

                        <br />

                        {vehicle.recorded_at ||
                          "No GPS update"}
                      </div>

                    </div>

                  </Popup>

                </Marker>
              );
            }
          )}

          {/* FIT ALL VEHICLES */}

          <MapFitVehicles
            vehicles={mappedVehicles}
          />

          {/* SELECT VEHICLE */}

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
```
