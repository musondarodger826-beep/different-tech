import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  async function loadLogs() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/activity-logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load activity"
        );
      }

      setLogs(data.logs || []);
    } catch (err) {
      console.error("Activity log error:", err);
      setError(err.message || "Unable to load activity");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const statistics = useMemo(() => {
    const total = logs.length;

    const login = logs.filter(
      (log) =>
        String(log.action || "").toUpperCase() === "LOGIN"
    ).length;

    const logout = logs.filter(
      (log) =>
        String(log.action || "").toUpperCase() === "LOGOUT"
    ).length;

    const system = logs.filter((log) => {
      const action = String(
        log.action || ""
      ).toUpperCase();

      return (
        action.startsWith("SYSTEM") ||
        log.entity_type === "system"
      );
    }).length;

    return {
      total,
      login,
      logout,
      system,
    };
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const action = String(
        log.action || ""
      ).toUpperCase();

      const user = String(
        log.full_name || ""
      ).toLowerCase();

      const description = String(
        log.description || ""
      ).toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        action.toLowerCase().includes(searchText) ||
        user.includes(searchText) ||
        description.includes(searchText);

      let matchesFilter = true;

      if (filter === "LOGIN") {
        matchesFilter = action === "LOGIN";
      }

      if (filter === "LOGOUT") {
        matchesFilter = action === "LOGOUT";
      }

      if (filter === "SYSTEM") {
        matchesFilter =
          action.startsWith("SYSTEM") ||
          log.entity_type === "system";
      }

      return matchesSearch && matchesFilter;
    });
  }, [logs, search, filter]);

  function getActionStyle(action) {
    const value = String(action || "").toUpperCase();

    if (value === "LOGIN") {
      return {
        background: "#dcfce7",
        color: "#166534",
        icon: "↪",
      };
    }

    if (value === "LOGOUT") {
      return {
        background: "#ffedd5",
        color: "#9a3412",
        icon: "↩",
      };
    }

    if (value.startsWith("SYSTEM")) {
      return {
        background: "#ede9fe",
        color: "#6d28d9",
        icon: "⚙",
      };
    }

    if (
      value.includes("DELETE") ||
      value.includes("ERROR") ||
      value.includes("FAILED")
    ) {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
        icon: "!",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      icon: "•",
    };
  }

  function formatDate(date) {
    if (!date) return "—";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleString();
  }

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "28px",
        background: "#f8fafc",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              color: "#2563eb",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "1.8px",
              marginBottom: "7px",
            }}
          >
            DIFFERENT.TECH / ADMINISTRATION
          </div>

          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "30px",
              fontWeight: "800",
            }}
          >
            Activity Log
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Monitor user and system activity across the
            Different.Tech platform.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          style={{
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: "10px",
            padding: "11px 16px",
            fontWeight: "700",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow:
              "0 1px 2px rgba(15,23,42,0.05)",
          }}
        >
          <span style={{ fontSize: "16px" }}>
            ↻
          </span>

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "13px 16px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: error ? "#ef4444" : "#22c55e",
            boxShadow: error
              ? "0 0 0 4px #fee2e2"
              : "0 0 0 4px #dcfce7",
          }}
        />

        <strong
          style={{
            color: "#334155",
            fontSize: "13px",
          }}
        >
          {error
            ? "Activity service requires attention"
            : "Activity logging service online"}
        </strong>

        <span
          style={{
            marginLeft: "auto",
            color: "#94a3b8",
            fontSize: "12px",
          }}
        >
          LIVE MONITORING
        </span>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#ffedd5",
              color: "#c2410c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
            }}
          >
            !
          </div>

          <div style={{ flex: 1 }}>
            <strong
              style={{
                display: "block",
                color: "#9a3412",
                marginBottom: "3px",
              }}
            >
              Unable to load activity
            </strong>

            <span
              style={{
                color: "#c2410c",
                fontSize: "13px",
              }}
            >
              {error}
            </span>
          </div>

          <button
            onClick={loadLogs}
            style={{
              border: "none",
              background: "#ea580c",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "9px 13px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          title="TOTAL ACTIVITIES"
          value={statistics.total}
          subtitle="All recorded activities"
          icon="▦"
          background="#eff6ff"
          color="#2563eb"
        />

        <StatCard
          title="LOGIN ACTIVITIES"
          value={statistics.login}
          subtitle="Successful user logins"
          icon="↪"
          background="#ecfdf5"
          color="#16a34a"
        />

        <StatCard
          title="LOGOUT ACTIVITIES"
          value={statistics.logout}
          subtitle="User logout events"
          icon="↩"
          background="#fff7ed"
          color="#ea580c"
        />

        <StatCard
          title="SYSTEM EVENTS"
          value={statistics.system}
          subtitle="Platform system events"
          icon="⚙"
          background="#f5f3ff"
          color="#7c3aed"
        />
      </div>

      {/* =====================================================
          ACTIVITY TABLE CARD
      ===================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                System Activity
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                Latest activities are displayed first.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#16a34a",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1px",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  background: "#22c55e",
                  borderRadius: "50%",
                }}
              />
              LIVE
            </div>
          </div>

          {/* SEARCH + FILTER */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: "240px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "10px",
                  color: "#94a3b8",
                }}
              >
                🔍
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search activity, user or description..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9px",
                  padding: "10px 12px 10px 36px",
                  outline: "none",
                  color: "#0f172a",
                  background: "#ffffff",
                }}
              />
            </div>

            {[
              ["ALL", "All Activities"],
              ["LOGIN", "Logins"],
              ["LOGOUT", "Logouts"],
              ["SYSTEM", "System"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  border:
                    filter === value
                      ? "1px solid #2563eb"
                      : "1px solid #cbd5e1",
                  background:
                    filter === value
                      ? "#eff6ff"
                      : "#ffffff",
                  color:
                    filter === value
                      ? "#1d4ed8"
                      : "#475569",
                  borderRadius: "9px",
                  padding: "9px 13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}

        {loading ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Loading activity records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div
            style={{
              padding: "65px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                margin: "0 auto 14px",
                borderRadius: "16px",
                background: "#f1f5f9",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              ▤
            </div>

            <h3
              style={{
                margin: "0 0 6px",
                color: "#334155",
                fontSize: "16px",
              }}
            >
              No activity records found
            </h3>

            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              User and system activities will appear
              here when they are recorded.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <th style={thStyle}>ACTIVITY</th>
                  <th style={thStyle}>USER</th>
                  <th style={thStyle}>DESCRIPTION</th>
                  <th style={thStyle}>ENTITY</th>
                  <th style={thStyle}>DATE & TIME</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => {
                  const actionStyle =
                    getActionStyle(log.action);

                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom:
                          "1px solid #f1f5f9",
                      }}
                    >
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            background:
                              actionStyle.background,
                            color: actionStyle.color,
                            padding:
                              "6px 9px",
                            borderRadius: "7px",
                            fontSize: "11px",
                            fontWeight: "800",
                          }}
                        >
                          <span>
                            {actionStyle.icon}
                          </span>

                          {log.action || "EVENT"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "9px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "#e0e7ff",
                              color: "#4338ca",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              fontWeight: "800",
                              fontSize: "12px",
                            }}
                          >
                            {(
                              log.full_name ||
                              "SYS"
                            )
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={{
                                color: "#0f172a",
                                fontWeight: "700",
                                fontSize: "13px",
                              }}
                            >
                              {log.full_name ||
                                "System"}
                            </div>

                            <div
                              style={{
                                color: "#94a3b8",
                                fontSize: "11px",
                              }}
                            >
                              {log.email ||
                                "System event"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            color: "#475569",
                            fontSize: "12px",
                          }}
                        >
                          {log.description ||
                            "No description"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            color: "#475569",
                            fontSize: "12px",
                          }}
                        >
                          {log.entity_type || "—"}
                          {log.entity_id
                            ? ` #${log.entity_id}`
                            : ""}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            log.created_at
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  background,
  color,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "13px",
        padding: "18px",
        boxShadow:
          "0 2px 7px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color: "#64748b",
              fontSize: "10px",
              fontWeight: "800",
              letterSpacing: "1.1px",
              marginBottom: "8px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              color: "#0f172a",
              fontSize: "28px",
              fontWeight: "800",
              lineHeight: 1,
            }}
          >
            {value}
          </div>

          <div
            style={{
              marginTop: "9px",
              color: "#94a3b8",
              fontSize: "11px",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "11px",
            background,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "800",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  color: "#64748b",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "0.8px",
};

const tdStyle = {
  padding: "14px 16px",
  verticalAlign: "middle",
};