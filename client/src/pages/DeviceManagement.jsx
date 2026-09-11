import React, { useEffect, useMemo, useState } from "react";
import {
  Smartphone,
  Plus,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Ban,
  KeyRound,
  Clock,
  UserRound,
  Search,
  X,
} from "lucide-react";
import { API_URL } from "../config/apiConfig";
import { QRCodeSVG } from "qrcode.react";

const getToken = () =>
  localStorage.getItem("differentTechToken") ||
  localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
};

const statusClass = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (["active", "approved"].includes(normalized)) {
    return "bg-green-500/10 text-green-400 border-green-500/30";
  }

  if (["pending"].includes(normalized)) {
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  }

  if (["blocked", "revoked", "expired"].includes(normalized)) {
    return "bg-red-500/10 text-red-400 border-red-500/30";
  }

  if (["used"].includes(normalized)) {
    return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }

  return "bg-slate-500/10 text-slate-300 border-slate-500/30";
};

export default function DeviceManagement() {
  const [escorts, setEscorts] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [devices, setDevices] = useState([]);

  const [selectedEscort, setSelectedEscort] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [generatedEnrollment, setGeneratedEnrollment] = useState(null);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = authHeaders();

      const [escortsResponse, enrollmentsResponse, devicesResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/escorts`, {
            headers,
          }),
          fetch(`${API_URL}/api/devices/enrollments`, {
            headers,
          }),
          fetch(`${API_URL}/api/devices`, {
            headers,
          }),
        ]);

      const escortsData = await escortsResponse.json();
      const enrollmentsData = await enrollmentsResponse.json();
      const devicesData = await devicesResponse.json();

      if (!escortsResponse.ok) {
        throw new Error(
          escortsData.message || "Failed to load escorts."
        );
      }

      if (!enrollmentsResponse.ok) {
        throw new Error(
          enrollmentsData.message || "Failed to load enrollments."
        );
      }

      if (!devicesResponse.ok) {
        throw new Error(
          devicesData.message || "Failed to load devices."
        );
      }

      setEscorts(Array.isArray(escortsData.escorts) ? escortsData.escorts : []);
      setEnrollments(
        Array.isArray(enrollmentsData.enrollments)
          ? enrollmentsData.enrollments
          : []
      );
      setDevices(
        Array.isArray(devicesData.devices) ? devicesData.devices : []
      );
    } catch (err) {
      setError(err.message || "Failed to load device management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeEscorts = useMemo(
    () =>
      escorts.filter(
        (escort) =>
          String(escort.status || "").toLowerCase() === "active"
      ),
    [escorts]
  );

  const filteredDevices = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return devices;

    return devices.filter((device) =>
      [
        device.public_device_id,
        device.device_id,
        device.escort_code,
        device.escort_name,
        device.manufacturer,
        device.model,
        device.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [devices, search]);

  const createEnrollment = async () => {
    if (!selectedEscort) {
      setError("Please select an active escort.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");
    setGeneratedEnrollment(null);
    setCopied(false);

    try {
      const response = await fetch(
        `${API_URL}/api/devices/enrollments`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            escort_id: Number(selectedEscort),
            tenant_id: selectedTenant
              ? Number(selectedTenant)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate enrollment token."
        );
      }

      setGeneratedEnrollment(data.enrollment || data);
      setSuccess("Fresh enrollment token generated successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to generate enrollment token.");
    } finally {
      setCreating(false);
    }
  };

  const copyToken = async () => {
    const token = generatedEnrollment?.enrollment_token;

    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the enrollment token.");
    }
  };

  const deviceAction = async (deviceId, action) => {
    setActionLoading(`${action}-${deviceId}`);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/devices/${deviceId}/${action}`,
        {
          method: "POST",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${action} device.`
        );
      }

      setSuccess(
        data.message ||
          `Device ${action} action completed successfully.`
      );

      await loadData();
    } catch (err) {
      setError(err.message || `Failed to ${action} device.`);
    } finally {
      setActionLoading(null);
    }
  };

  const requestDeviceStatus = async (deviceId) => {
    setActionLoading(`request-status-${deviceId}`);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/device-commands`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            device_id: Number(deviceId),
            command_type: "REQUEST_STATUS",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to request device status."
        );
      }

      setSuccess(
        data.message ||
          "Device status request queued successfully."
      );
    } catch (err) {
      setError(
        err.message || "Failed to request device status."
      );
    } finally {
      setActionLoading(null);
    }
  };
  const revokeEnrollment = async (enrollmentId) => {
    const confirmed = window.confirm(
      "Revoke this pending enrollment token? The token will no longer be usable."
    );

    if (!confirmed) return;

    setActionLoading(`revoke-enrollment-${enrollmentId}`);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/devices/enrollments/${enrollmentId}/revoke`,
        {
          method: "POST",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to revoke enrollment."
        );
      }

      setSuccess(
        data.message || "Enrollment revoked successfully."
      );

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to revoke enrollment.");
    } finally {
      setActionLoading(null);
    }
  };
  const pendingCount = enrollments.filter(
    (item) => String(item.status || "").toLowerCase() === "pending"
  ).length;

  const activeCount = devices.filter((item) =>
    ["active", "approved"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;

  const blockedCount = devices.filter((item) =>
    ["blocked", "revoked"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;

  return (
    <div className="min-h-full bg-[#07111F] text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
              <Smartphone className="text-[#D4AF37]" size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                DEVICE MANAGEMENT
              </h1>
              <p className="text-sm text-slate-400">
                Enroll, approve and manage DIFFERENT.TECH mobile devices.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
          <ShieldAlert size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1 text-sm">{error}</div>
          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-300">
          <Check size={20} />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0B1727] p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Total Devices
          </p>
          <p className="text-3xl font-bold mt-2">{devices.length}</p>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-[#0B1727] p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Active Devices
          </p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-500/20 bg-[#0B1727] p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Pending Enrollments
          </p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-[#0B1727] p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Blocked / Revoked
          </p>
          <p className="text-3xl font-bold text-red-400 mt-2">
            {blockedCount}
          </p>
        </div>
      </div>

      {/* GENERATE TOKEN */}
      <section className="rounded-2xl border border-[#D4AF37]/25 bg-[#0B1727] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <KeyRound className="text-[#D4AF37]" size={21} />
            <div>
              <h2 className="font-semibold text-lg">
                Generate Enrollment Token
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Create a one-time token for an active escort's Android
                device.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Active Escort
              </label>

              <select
                value={selectedEscort}
                onChange={(event) =>
                  setSelectedEscort(event.target.value)
                }
                className="w-full bg-[#07111F] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="">Select an active escort...</option>

                {activeEscorts.map((escort) => (
                  <option key={escort.id} value={escort.id}>
                    {escort.escort_code ||
                      escort.code ||
                      `ESC-${escort.id}`}{" "}
                    —{" "}
                    {escort.full_name ||
                      escort.name ||
                      escort.escort_name ||
                      `Escort #${escort.id}`}
                  </option>
                ))}
              </select>

              {activeEscorts.length === 0 && !loading && (
                <p className="text-xs text-yellow-400 mt-2">
                  No active escorts are currently available for enrollment.
                </p>
              )}
            </div>

            <div className="flex items-end">
              <button
                onClick={createEnrollment}
                disabled={creating || !selectedEscort}
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#D4AF37] text-black font-bold hover:bg-[#e2c24c] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                {creating ? "GENERATING..." : "GENERATE TOKEN"}
              </button>
            </div>
          </div>

          {/* ENROLLMENT QR RESULT */}
          {generatedEnrollment?.enrollment_token && (
            <div className="mt-6 rounded-xl border border-[#D4AF37]/40 bg-[#07111F] p-5">
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-center">

                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <QRCodeSVG
                      value={`deltaescort://enroll?token=${encodeURIComponent(
                        generatedEnrollment.enrollment_token
                      )}`}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-wider">
                    <Smartphone size={15} />
                    SCAN WITH DIFFERENT.TECH
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37]">
                    Secure Device Enrollment
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    Enrollment QR Ready
                  </h3>

                  <p className="mt-2 text-sm text-slate-400 leading-6">
                    Open the DIFFERENT.TECH mobile application on the intended
                    device and scan this QR code. The enrollment token will be
                    transferred automatically.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-5 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound size={14} />
                      {generatedEnrollment.escort_name ||
                        generatedEnrollment.escort_code ||
                        `Escort #${generatedEnrollment.escort_id}`}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} />
                      Expires:{" "}
                      {formatDate(
                        generatedEnrollment.expires_at
                      )}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={copyToken}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition text-sm"
                    >
                      {copied ? (
                        <>
                          <Check size={17} />
                          COPIED
                        </>
                      ) : (
                        <>
                          <Copy size={17} />
                          COPY TOKEN
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-5 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-300">
                    This QR contains one-time enrollment authorization. Use it
                    only on the intended DIFFERENT.TECH device.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ENROLLMENTS */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B1727] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <h2 className="font-semibold text-lg">
            Enrollment History
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tokens generated by DIFFERENT.TECH administrators.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#07111F] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-6 py-4">Escort</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Created</th>
                <th className="text-left px-6 py-4">Expires</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No enrollment records found.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-t border-slate-800 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {enrollment.escort_name ||
                          enrollment.escort_code ||
                          `Escort #${enrollment.escort_id}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        Enrollment ID: {enrollment.id ?? "—"}
                      </div>
                      <div className="text-xs text-slate-600">
                        Escort ID: {enrollment.escort_id ?? "—"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full border text-xs uppercase ${statusClass(
                          enrollment.status
                        )}`}
                      >
                        {enrollment.status || "unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(
                        enrollment.created_at
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(
                        enrollment.expires_at
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {String(enrollment.status || "").toLowerCase() ===
                      "pending" ? (
                        <button
                          onClick={() => revokeEnrollment(enrollment.id)}
                          disabled={
                            actionLoading ===
                            `revoke-enrollment-${enrollment.id}`
                          }
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Ban size={15} />
                          {actionLoading ===
                          `revoke-enrollment-${enrollment.id}`
                            ? "REVOKING..."
                            : "REVOKE"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* DEVICES */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B1727] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">
                Registered Devices
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Approve and control enrolled DIFFERENT.TECH devices.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search devices..."
                className="w-full bg-[#07111F] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#07111F] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-6 py-4">Device</th>
                <th className="text-left px-6 py-4">Escort</th>
                <th className="text-left px-6 py-4">Platform</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No devices found.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const status = String(
                    device.status || ""
                  ).toLowerCase();

                  return (
                    <tr
                      key={device.id}
                      className="border-t border-slate-800 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium font-mono">
                          {device.public_device_id ||
                            device.device_id ||
                            `Device #${device.id}`}
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                          {device.manufacturer || ""}{" "}
                          {device.model || ""}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {device.escort_name ||
                          device.escort_code ||
                          (device.escort_id
                            ? `Escort #${device.escort_id}`
                            : "—")}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {device.platform || "Android"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-xs uppercase ${statusClass(
                            device.status
                          )}`}
                        >
                          {device.status || "unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {["active", "approved"].includes(status) && (
                            <button
                              onClick={() =>
                                requestDeviceStatus(device.id)
                              }
                              disabled={
                                actionLoading ===
                                `request-status-${device.id}`
                              }
                              title="Request device status"
                              className="p-2 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-40"
                            >
                              <RefreshCw
                                size={17}
                                className={
                                  actionLoading ===
                                  `request-status-${device.id}`
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                            </button>
                          )}

                          {["pending"].includes(status) && (
                            <button
                              onClick={() =>
                                deviceAction(
                                  device.id,
                                  "approve"
                                )
                              }
                              disabled={
                                actionLoading ===
                                `approve-${device.id}`
                              }
                              title="Approve device"
                              className="p-2 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 disabled:opacity-40"
                            >
                              <ShieldCheck size={17} />
                            </button>
                          )}

                          {!["blocked", "revoked"].includes(status) && (
                            <button
                              onClick={() =>
                                deviceAction(
                                  device.id,
                                  "block"
                                )
                              }
                              disabled={
                                actionLoading ===
                                `block-${device.id}`
                              }
                              title="Block device"
                              className="p-2 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 disabled:opacity-40"
                            >
                              <Ban size={17} />
                            </button>
                          )}

                          {!["revoked"].includes(status) && (
                            <button
                              onClick={() =>
                                deviceAction(
                                  device.id,
                                  "revoke"
                                )
                              }
                              disabled={
                                actionLoading ===
                                `revoke-${device.id}`
                              }
                              title="Revoke device"
                              className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                            >
                              <ShieldAlert size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
