import { X } from "lucide-react";

export default function VehicleForm({
  open,
  vehicle,
  editingVehicle,
  saving,
  message,
  onChange,
  onSubmit,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal vehicle-modal">
        <div className="modal-header">
          <div>
            <span className="section-label">
              FLEET MANAGEMENT
            </span>

            <h2>
              {editingVehicle
                ? "Update Vehicle"
                : "Register Vehicle"}
            </h2>

            <p>
              {editingVehicle
                ? "Update vehicle information."
                : "Add a new vehicle to your fleet."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {message && (
          <div className="vehicle-form-message">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Fleet Number *</label>

              <input
                type="text"
                name="fleet_number"
                placeholder="e.g. DT-002"
                value={vehicle.fleet_number}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Registration Number *</label>

              <input
                type="text"
                name="registration_number"
                placeholder="e.g. ALB-1234"
                value={vehicle.registration_number}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Vehicle Type</label>

              <select
                name="vehicle_type"
                value={vehicle.vehicle_type}
                onChange={onChange}
              >
                <option value="Truck">
                  Truck
                </option>

                <option value="Trailer">
                  Trailer
                </option>

                <option value="Car">
                  Car
                </option>

                <option value="Escort Vehicle">
                  Escort Vehicle
                </option>

                <option value="Bus">
                  Bus
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Make</label>

              <input
                type="text"
                name="make"
                placeholder="e.g. Mercedes-Benz"
                value={vehicle.make}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Model</label>

              <input
                type="text"
                name="model"
                placeholder="e.g. Actros"
                value={vehicle.model}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Year</label>

              <input
                type="number"
                name="year"
                placeholder="e.g. 2024"
                min="1900"
                max="2100"
                value={vehicle.year}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>VIN</label>

              <input
                type="text"
                name="vin"
                placeholder="Vehicle Identification Number"
                value={vehicle.vin}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>GPS IMEI</label>

              <input
                type="text"
                name="gps_imei"
                placeholder="e.g. 123456789012345"
                value={vehicle.gps_imei}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={vehicle.status}
                onChange={onChange}
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="maintenance">
                  Maintenance
                </option>
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingVehicle
                ? "Save Changes"
                : "Register Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}