const API_URL = "http://localhost:5000";

export async function getVehicles() {
  const response = await fetch(`${API_URL}/api/vehicles`);

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load vehicles");
  }

  return data.vehicles || [];
}

export async function createVehicle(vehicle) {
  const response = await fetch(`${API_URL}/api/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicle),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to create vehicle");
  }

  return data;
}

export async function updateVehicle(id, vehicle) {
  const response = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicle),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update vehicle");
  }

  return data;
}

export async function deleteVehicle(id) {
  const response = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to delete vehicle");
  }

  return data;
}