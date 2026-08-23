import {
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function VehicleTable({
  vehicles,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onEdit,
  onDelete,
  onAdd,
}) {
  const filteredVehicles = vehicles.filter((vehicle) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      vehicle.fleet_number
        ?.toLowerCase()
        .includes(value) ||
      vehicle.registration_number
        ?.toLowerCase()
        .includes(value) ||
      vehicle.make
        ?.toLowerCase()
        .includes(value) ||
      vehicle.model
        ?.toLowerCase()
        .includes(value) ||
      vehicle.gps_imei
        ?.toLowerCase()
        .includes(value)
    );
  });

  return (
    <div className="panel vehicles-panel">
      <div className="panel-header vehicles-header">
        <div>
          <span className="section-label">
            FLEET MANAGEMENT
          </span>

          <h2>Vehicles</h2>

          <p>
            Manage and monitor your registered fleet
            vehicles.
          </p>
        </div>

        <div className="vehicle-header-actions">
          <button
            className="secondary-button"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />

            Refresh
          </button>

          <button
            className="create-button"
            onClick={onAdd}
          >
            + Register Vehicle
          </button>
        </div>
      </div>

      <div className="vehicle-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search fleet number, registration, make, model or GPS IMEI..."
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />
        </div>

        <div className="vehicle-count">
          {filteredVehicles.length}{" "}
          {filteredVehicles.length === 1
            ? "vehicle"
            : "vehicles"}
        </div>
      </div>

      {loading ? (
        <div className="loading">
          Loading fleet vehicles...
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="empty-state vehicle-empty">
          <div className="empty-icon">
            🚛
          </div>

          <h3>No vehicles found</h3>

          <p>
            Register your first fleet vehicle to begin
            managing your fleet.
          </p>

          <button
            className="create-button"
            onClick={onAdd}
          >
            + Register Vehicle
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Fleet</th>
                <th>Registration</th>
                <th>Vehicle</th>
                <th>Make / Model</th>
                <th>Year</th>
                <th>GPS IMEI</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <strong>
                      {vehicle.fleet_number}
                    </strong>
                  </td>

                  <td>
                    {vehicle.registration_number}
                  </td>

                  <td>
                    {vehicle.vehicle_type || "Truck"}
                  </td>

                  <td>
                    {vehicle.make || "-"}{" "}
                    {vehicle.model || ""}
                  </td>

                  <td>
                    {vehicle.year || "-"}
                  </td>

                  <td>
                    {vehicle.gps_imei || "-"}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        vehicle.status === "active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {vehicle.status || "unknown"}
                    </span>
                  </td>

                  <td>
                    <div className="vehicle-actions">
                      <button
                        className="icon-button"
                        title="Edit vehicle"
                        onClick={() =>
                          onEdit(vehicle)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        title="Delete vehicle"
                        onClick={() =>
                          onDelete(vehicle)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}