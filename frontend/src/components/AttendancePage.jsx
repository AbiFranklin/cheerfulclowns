// src/components/AttendancePage.jsx

import { useEffect, useState } from "react";
import {
  fetchMembers,
  fetchAttendanceReports,
  fetchAttendanceReport,
  createAttendanceReport,
  updateAttendanceReport,
  deleteAttendanceReport,
} from "../api";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function AttendancePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [presentIds, setPresentIds] = useState(new Set());
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initial load: active members + existing reports
  useEffect(() => {
    (async () => {
      try {
        const [membersData, reportsData] = await Promise.all([
          fetchMembers({ status: "Active" }),
          fetchAttendanceReports(),
        ]);

        membersData.sort((a, b) => {
          const an = (a.clownName || `${a.firstName} ${a.lastName}`).toLowerCase();
          const bn = (b.clownName || `${b.firstName} ${b.lastName}`).toLowerCase();
          return an.localeCompare(bn);
        });

        setMembers(membersData);
        setReports(reportsData);
      } catch (err) {
        console.error(err);
        alert("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When month/year changes, load or create that report
  useEffect(() => {
    if (!loading) {
      loadOrInitReport(year, month);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, loading]);

  async function loadOrInitReport(y, m) {
    try {
      const existing = reports.find(
        (r) => r.year === Number(y) && r.month === Number(m)
      );

      if (existing) {
        const full = await fetchAttendanceReport(existing.id);
        setCurrentReport(full);
        setLabel(full.label || `${monthNames[m - 1]} ${y} Meeting`);
        const ids = new Set(
          (full.entries || [])
            .filter((e) => e.present)
            .map((e) => e.memberId)
        );
        setPresentIds(ids);
      } else {
        const created = await createAttendanceReport({
          year: Number(y),
          month: Number(m),
          label: `${monthNames[m - 1]} ${y} Meeting`,
          presentMemberIds: [],
        });
        const full = await fetchAttendanceReport(created.id);
        setReports((prev) => [created, ...prev]);
        setCurrentReport(full);
        setLabel(full.label || `${monthNames[m - 1]} ${y} Meeting`);
        setPresentIds(new Set());
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load or create attendance report.");
    }
  }

  function togglePresent(memberId) {
    setPresentIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  }

  async function handleSave() {
    if (!currentReport) return;
    setSaving(true);
    try {
      await updateAttendanceReport(currentReport.id, {
        year: Number(year),
        month: Number(month),
        label,
        presentMemberIds: Array.from(presentIds),
      });
      const full = await fetchAttendanceReport(currentReport.id);
      setCurrentReport(full);
      const all = await fetchAttendanceReports();
      setReports(all);
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!currentReport) return;
    if (!window.confirm("Delete this attendance report?")) return;
    try {
      await deleteAttendanceReport(currentReport.id);
      const all = await fetchAttendanceReports();
      setReports(all);
      setCurrentReport(null);
      setPresentIds(new Set());
      setLabel("");
    } catch (err) {
      console.error(err);
      alert("Failed to delete attendance report.");
    }
  }

  async function handleSelectReport(report) {
    try {
      setYear(report.year);
      setMonth(report.month);
      const full = await fetchAttendanceReport(report.id);
      setCurrentReport(full);
      setLabel(
        full.label || `${monthNames[report.month - 1]} ${report.year} Meeting`
      );
      const ids = new Set(
        (full.entries || [])
          .filter((e) => e.present)
          .map((e) => e.memberId)
      );
      setPresentIds(ids);
    } catch (err) {
      console.error(err);
      alert("Failed to load selected report.");
    }
  }

  if (loading) {
    return <div className="page-section">Loading attendance...</div>;
  }

  return (
    <div className="page-section">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Attendance</h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            Pick a month, see all active clowns, and check who was present.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: "0.9rem" }}>
          Month{" "}
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{
              padding: "0.35rem 0.6rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          >
            {monthNames.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: "0.9rem" }}>
          Year{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{
              width: "5rem",
              padding: "0.35rem 0.6rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </label>

        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Meeting label (optional)"
          style={{
            flex: 1,
            minWidth: "180px",
            padding: "0.4rem 0.6rem",
            borderRadius: "0.6rem",
            border: "1px solid #d1d5db",
            fontSize: "0.9rem",
          }}
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={!currentReport || saving}
          style={{
            padding: "0.5rem 1.2rem",
            borderRadius: "999px",
            border: "none",
            background: "#1982c4",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            opacity: saving ? 0.7 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!currentReport}
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid #fecaca",
            background: "#fff5f5",
            color: "#b91c1c",
            fontSize: "0.85rem",
            cursor: currentReport ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
        >
          Delete Report
        </button>
      </div>

      {/* Checklist */}
      <div
        style={{
          padding: "0.75rem 0.8rem",
          borderRadius: "0.9rem",
          border: "1px solid rgba(209,213,219,0.9)",
          background: "#fafafc",
          maxHeight: "420px",
          overflowY: "auto",
        }}
      >
        {members.length === 0 ? (
          <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            No active members found. Add members first to track attendance.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.35rem 1rem",
            }}
          >
            {members.map((m) => {
              const labelText = m.clownName
                ? `${m.clownName} (${m.firstName} ${m.lastName})`
                : `${m.firstName} ${m.lastName}`;
              const checked = presentIds.has(m.id);
              return (
                <label
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePresent(m.id)}
                  />
                  <span>{labelText}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Previous reports */}
      <div style={{ marginTop: "0.9rem" }}>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "0.25rem",
            color: "#6b7280",
          }}
        >
          Previous Attendance Reports
        </div>
        {reports.length === 0 ? (
          <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            No reports yet. Saving your first month will create one.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              fontSize: "0.8rem",
            }}
          >
            {reports.map((r) => {
              const isActive =
                currentReport && currentReport.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectReport(r)}
                  style={{
                    padding: "0.25rem 0.6rem",
                    borderRadius: "999px",
                    border: isActive
                      ? "none"
                      : "1px solid rgba(209,213,219,0.9)",
                    background: isActive ? "#ffca3a" : "#ffffff",
                    cursor: "pointer",
                    boxShadow: isActive
                      ? "0 2px 6px rgba(15,23,42,0.15)"
                      : "none",
                  }}
                >
                  {monthNames[r.month - 1]} {r.year}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
