import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:5000";

// =====================================================
// VEHICLE ICON
// =====================================================

const vehicleIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

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
  // LOAD LATEST VEHICLE LOCATIONS
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

      setLocations(data.locations || []);

      // Automatically select first vehicle
      if (
        data.locations &&
        data.locations.length > 0 &&
        !selectedVehicle
      ) {
        setSelectedVehicle(data.locations[0]);
      }
    } catch (err) {
      console.error(
        "Live tracking error:",
        err
      );

      setError(
        err.message ||
          "Unable to load live tracking data"
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // INITIAL LOAD + AUTO REFRESH
  // ===================================================

  useEffect(() => {
    loadLocations();

    const interval = setInterval(() => {
      loadLocations();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section className="panel">
        <div className="loading">
          Loading live vehicle locations...
        </div>
      </section>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <section className="panel">
        <div className="error-message">
          {error}
        </div>
      </section>
    );
  }

  // ===================================================
  // MAP CENTER
  // ===================================================

  const defaultCenter = [-12.9706, 28.6333];

  const mapCenter =
    selectedVehicle &&
    selectedVehicle.latitude &&
    selectedVehicle.longitude
      ? [
          Number(selectedVehicle.latitude),
          Number(selectedVehicle.longitude),
        ]
      : defaultCenter;

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <section className="panel live-tracking-panel">

      <div className="panel-header">

        <div>
          <span className="section-label">
            TRACKING
          </span>

          <h2>
            Live Fleet Tracking
          </h2>

          <p>
            Monitor vehicle locations in real time.
          </p>
        </div>

        <span className="status-badge">
          <span />
          LIVE
        </span>

      </div>

      {/* VEHICLE LIST */}

      <div className="tracking-layout">

        <div className="tracking-sidebar">

          <h3>
            Vehicles
          </h3>

          {locations.length === 0 ? (
            <p>
              No vehicle locations available.
            </p>
          ) : (
            locations.map((vehicle) => (
              <button
                key={vehicle.vehicle_id}
                className={
                  selectedVehicle?.vehicle_id ===
                  vehicle.vehicle_id
                    ? "tracking-vehicle active"
                    : "tracking-vehicle"
                }
                onClick={() =>
                  setSelectedVehicle(vehicle)
                }
              >
                <strong>
                  {vehicle.fleet_number}
                </strong>

                <span>
                  {vehicle.registration_number}
                </span>

                <small>
                  {vehicle.speed || 0} km/h
                </small>
              </button>
            ))
          )}

        </div>

        {/* MAP */}

        <div className="tracking-map">

          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "500px",
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((vehicle) => {

              if (
                vehicle.latitude === null ||
                vehicle.longitude === null
              ) {
                return null;
              }

              const position = [
                Number(vehicle.latitude),
                Number(vehicle.longitude),
              ];

              return (
                <Marker
                  key={vehicle.vehicle_id}
                  position={position}
                  icon={vehicleIcon}
                >
                  <Popup>

                    <strong>
                      {vehicle.fleet_number}
                    </strong>

                    <br />

                    {vehicle.registration_number}

                    <br />

                    Speed:{" "}
                    {vehicle.speed || 0} km/h

                    <br />

                    Ignition:{" "}
                    {vehicle.ignition_status
                      ? "ON"
                      : "OFF"}

                  </Popup>
                </Marker>
              );
            })}

          </MapContainer>

        </div>

      </div>

    </section>
  );
}