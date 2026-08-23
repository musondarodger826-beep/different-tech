import { useEffect, useState } from "react";

import VehicleTable from "../components/VehicleTable";
import VehicleForm from "../components/VehicleForm";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/api";

const emptyVehicle = {
  fleet_number: "",
  registration_number: "",
  vehicle_type: "Truck",
  make: "",
  model: "",
  year: "",
  vin: "",
  gps_imei: "",
  status: "active",
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [vehicleForm, setVehicleForm] =
    useState(emptyVehicle);

  const [editingVehicle, setEditingVehicle] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setLoading(true);
      setMessage("");

      const data = await getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error("Vehicles error:", error);

      setMessage(
        error.message || "Unable to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  }

  function openAddVehicle() {
    setEditingVehicle(null);
    setVehicleForm({ ...emptyVehicle });
    setMessage("");
    setShowForm(true);
  }

  function openEditVehicle(vehicle) {
    setEditingVehicle(vehicle);

    setVehicleForm({
      fleet_number: vehicle.fleet_number || "",
      registration_number:
        vehicle.registration_number || "",
      vehicle_type:
        vehicle.vehicle_type || "Truck",
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      vin: vehicle.vin || "",
      gps_imei: vehicle.gps_imei || "",
      status: vehicle.status || "active",
    });

    setMessage("");
    setShowForm(true);
  }

  function handleVehicleChange(event) {
    const { name, value } = event.target;

    setVehicleForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      if (!vehicleForm.fleet_number.trim()) {
        throw new Error(
          "Fleet number is required"
        );
      }

      if (
        !vehicleForm.registration_number.trim()
      ) {
        throw new Error(
          "Registration number is required"
        );
      }

      const payload = {
        fleet_number:
          vehicleForm.fleet_number.trim(),

        registration_number:
          vehicleForm.registration_number.trim(),

        vehicle_type:
          vehicleForm.vehicle_type,

        make:
          vehicleForm.make.trim() || null,

        model:
          vehicleForm.model.trim() || null,

        year: vehicleForm.year
          ? Number(vehicleForm.year)
          : null,

        vin:
          vehicleForm.vin.trim() || null,

        gps_imei:
          vehicleForm.gps_imei.trim() || null,

        status:
          vehicleForm.status,
      };

      if (editingVehicle) {
        await updateVehicle(
          editingVehicle.id,
          payload
        );

        setMessage(
          "Vehicle updated successfully."
        );
      } else {
        await createVehicle(payload);

        setMessage(
          "Vehicle created successfully."
        );
      }

      await loadVehicles();

      setTimeout(() => {
        setShowForm(false);
        setMessage("");
      }, 900);
    } catch (error) {
      console.error(
        "Vehicle save error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to save vehicle"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(vehicle) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${vehicle.fleet_number}?`
    );

    if (!confirmed) return;

    try {
      await deleteVehicle(vehicle.id);

      await loadVehicles();
    } catch (error) {
      console.error(
        "Vehicle delete error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete vehicle"
      );
    }
  }

  return (
    <>
      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={loadVehicles}
        onEdit={openEditVehicle}
        onDelete={handleDelete}
        onAdd={openAddVehicle}
      />

      <VehicleForm
        open={showForm}
        vehicle={vehicleForm}
        editingVehicle={editingVehicle}
        saving={saving}
        message={message}
        onChange={handleVehicleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          if (!saving) {
            setShowForm(false);
            setMessage("");
          }
        }}
      />
    </>
  );
}