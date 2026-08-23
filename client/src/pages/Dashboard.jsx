import { useEffect, useMemo, useState } from "react";

import {
  Truck,
  Activity,
  CircleStop,
  WifiOff,
  Radio,
  Siren,
  TriangleAlert,
  Wrench,
  Route,
  PauseCircle,
  Bluetooth,
  Building2,
  MapPinned,
  Map,
  BellRing,
  Navigation,
  ChevronRight,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

export default function Dashboard({ onNavigate }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    fleet: "All Fleets",
    vehicle: "All Vehicles",
    convoy: "All Convoys",
    route: "All Routes",
  });

  /* =====================================================
     LOAD GPS DATA
  ===================================================== */

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

  /* =====================================================
     AUTO REFRESH GPS DATA
  ===================================================== */

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     REAL GPS VEHICLE STATISTICS
  ===================================================== */

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

  const devices = useMemo(() => {
    return locations.filter(
      (vehicle) =>
        vehicle.gps_imei ||
        vehicle.device_id ||
        vehicle.device_number ||
        vehicle.imei
    ).length;
  }, [locations]);

  return (
    <section className="dt-dashboard">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <div className="dt-dashboard-header">

        <div>
          <span className="dt-section-label">
            DASHBOARD
          </span>

          <h1>
            Different.Tech Fleet Dashboard
          </h1>

          <p>
            Fleet operations, vehicle status and
            tracking overview.
          </p>
        </div>

        <div className="dt-online-status">
          <span className="dt-online-dot"></span>

          SYSTEM ONLINE
        </div>

      </div>


      {/* =====================================================
          FLEET STATUS
      ===================================================== */}

      <div className="dt-dashboard-section">

        <div className="dt-section-title">

          <div>
            <span>
              FLEET STATUS
            </span>

            <small>
              LIVE GPS DATA
            </small>
          </div>

          <Activity size={18} />

        </div>


        <div className="dt-stat-grid">

          <DashboardStat
            icon={<Truck />}
            label="TOTAL VEHICLES"
            value={
              loading
                ? "..."
                : totalVehicles
            }
            className="dt-stat-total"
            iconColor="icon-blue"
          />

          <DashboardStat
            icon={<Activity />}
            label="MOVING"
            value={
              loading
                ? "..."
                : moving
            }
            className="dt-stat-moving"
            iconColor="icon-green"
          />

          <DashboardStat
            icon={<CircleStop />}
            label="STOPPED"
            value={
              loading
                ? "..."
                : stopped
            }
            className="dt-stat-stopped"
            iconColor="icon-blue"
          />

          <DashboardStat
            icon={<WifiOff />}
            label="OFFLINE"
            value={
              loading
                ? "..."
                : offline
            }
            className="dt-stat-offline"
            iconColor="icon-red"
          />

          <DashboardStat
            icon={<Radio />}
            label="GPS DEVICES"
            value={
              loading
                ? "..."
                : devices
            }
            className="dt-stat-device"
            iconColor="icon-purple"
          />

        </div>

      </div>


      {/* =====================================================
          DEVICE & EVENT MONITORING
      ===================================================== */}

      <div className="dt-dashboard-section">

        <div className="dt-section-title">

          <div>
            <span>
              DEVICE & EVENT MONITORING
            </span>

            <small>
              LIVE EVENTS
            </small>
          </div>

          <Siren size={18} />

        </div>


        <div className="dt-event-grid">

          <EventCard
            icon={<Siren />}
            label="PANIC"
            value="0"
            color="red"
          />

          <EventCard
            icon={<TriangleAlert />}
            label="REMOVED"
            value="0"
            color="orange"
          />

          <EventCard
            icon={<Wrench />}
            label="TAMPER"
            value="0"
            color="purple"
          />

          <EventCard
            icon={<Route />}
            label="OFF ROUTE"
            value="0"
            color="red"
          />

          <EventCard
            icon={<PauseCircle />}
            label="STATIONARY"
            value="0"
            color="blue"
          />

          <EventCard
            icon={<Bluetooth />}
            label="BLUETOOTH PANIC"
            value="0"
            color="purple"
          />

        </div>

      </div>


      {/* =====================================================
          CONFIGURE
      ===================================================== */}

      <div className="dt-dashboard-section">

        <div className="dt-section-title">

          <div>
            <span>
              CONFIGURE
            </span>

            <small>
              FILTER MONITORING DATA
            </small>
          </div>

          <Map size={18} />

        </div>


        <div className="dt-filter-grid">

          <FilterCard
            icon={<Building2 />}
            title="Fleet Filter"
            value={filters.fleet}
            options={[
              "All Fleets",
            ]}
            onChange={(value) =>
              setFilters({
                ...filters,
                fleet: value,
              })
            }
          />


          <FilterCard
            icon={<Truck />}
            title="Vehicle Filter"
            value={filters.vehicle}
            options={[
              "All Vehicles",
            ]}
            onChange={(value) =>
              setFilters({
                ...filters,
                vehicle: value,
              })
            }
          />


          <FilterCard
            icon={<Truck />}
            title="Convoy Filter"
            value={filters.convoy}
            options={[
              "All Convoys",
            ]}
            onChange={(value) =>
              setFilters({
                ...filters,
                convoy: value,
              })
            }
          />


          <FilterCard
            icon={<Map />}
            title="Route Filter"
            value={filters.route}
            options={[
              "All Routes",
            ]}
            onChange={(value) =>
              setFilters({
                ...filters,
                route: value,
              })
            }
          />

        </div>

      </div>


      {/* =====================================================
          QUICK OPERATIONS
      ===================================================== */}

      <div className="dt-dashboard-section">

        <div className="dt-section-title">

          <div>
            <span>
              QUICK OPERATIONS
            </span>

            <small>
              FLEET CONTROL
            </small>
          </div>

          <Truck size={18} />

        </div>


        <div className="dt-operation-grid">

          <OperationCard
            icon={<Truck />}
            title="Vehicles"
            description="Manage fleet vehicles and vehicle information."
            color="blue"
            onClick={() =>
              onNavigate("vehicles")
            }
          />


          <OperationCard
            icon={<MapPinned />}
            title="Live Tracking"
            description="Monitor vehicle GPS positions in real time."
            color="green"
            onClick={() =>
              onNavigate("tracking")
            }
          />


          <OperationCard
            icon={<BellRing />}
            title="Fleet Alerts"
            description="Monitor vehicle conditions and operational warnings."
            color="red"
            onClick={() =>
              onNavigate("alerts")
            }
          />


          <OperationCard
            icon={<Navigation />}
            title="Trips"
            description="View and manage fleet trips and movements."
            color="purple"
            onClick={() =>
              onNavigate("trips")
            }
          />

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  icon,
  label,
  value,
  className = "",
  iconColor = "icon-blue",
}) {
  return (
    <div
      className={`dt-stat-card ${className}`}
    >

      <div
        className={`dt-stat-icon ${iconColor}`}
      >
        {icon}
      </div>


      <div className="dt-stat-content">

        <div className="dt-stat-label">
          {label}
        </div>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   EVENT CARD
========================================================= */

function EventCard({
  icon,
  label,
  value,
  color,
}) {
  return (
    <div
      className={`dt-event-card dt-event-${color}`}
    >

      <div className="dt-event-icon">
        {icon}
      </div>


      <div className="dt-event-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   FILTER CARD
========================================================= */

function FilterCard({
  icon,
  title,
  value,
  options,
  onChange,
}) {
  return (
    <div className="dt-filter-card">

      <div className="dt-filter-icon">
        {icon}
      </div>


      <div className="dt-filter-content">

        <strong>
          {title}
        </strong>


        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
        >

          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}

        </select>

      </div>

    </div>
  );
}


/* =========================================================
   QUICK OPERATION CARD
========================================================= */

function OperationCard({
  icon,
  title,
  description,
  color = "blue",
  onClick,
}) {
  return (
    <button
      type="button"
      className="dt-operation-card"
      onClick={onClick}
    >

      <div
        className={`dt-operation-icon icon-${color}`}
      >
        {icon}
      </div>


      <div className="dt-operation-content">

        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>

      </div>


      <ChevronRight
        className="dt-operation-arrow"
      />

    </button>
  );
}