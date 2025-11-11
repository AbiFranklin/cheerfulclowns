// src/api.js

const API_BASE = "http://localhost:4001/api";

async function handle(res, message = "Request failed") {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(message, res.status, text);
    throw new Error(message);
  }
  return res.json();
}

/* ===================== MEMBERS ===================== */

export async function fetchMembers(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/members${q ? `?${q}` : ""}`);
  return handle(res, "Failed to fetch members");
}

export async function createMember(data) {
  const res = await fetch(`${API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res, "Failed to create member");
}

export async function updateMember(id, data) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res, "Failed to update member");
}

export async function deleteMember(id) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: "DELETE",
  });
  return handle(res, "Failed to delete member");
}

/* ======================= DUES ====================== */

export async function fetchAllDues() {
  const res = await fetch(`${API_BASE}/dues`);
  return handle(res, "Failed to fetch dues");
}

export async function fetchMemberDues(memberId) {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues`);
  return handle(res, "Failed to fetch member dues");
}

export async function addMemberDues(memberId, data) {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res, "Failed to add dues");
}

export async function updateDues(id, data) {
  const res = await fetch(`${API_BASE}/dues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res, "Failed to update dues");
}

export async function deleteDues(id) {
  const res = await fetch(`${API_BASE}/dues/${id}`, {
    method: "DELETE",
  });
  return handle(res, "Failed to delete dues");
}

export async function upcomingDues(days = 30) {
  const res = await fetch(
    `${API_BASE}/reports/dues-upcoming?days=${encodeURIComponent(days)}`
  );
  return handle(res, "Failed to fetch upcoming dues report");
}

/* ==================== ATTENDANCE ==================== */

export async function fetchAttendanceReports() {
  const res = await fetch(`${API_BASE}/attendance-reports`);
  return handle(res, "Failed to fetch attendance reports");
}

export async function fetchAttendanceReport(id) {
  const res = await fetch(`${API_BASE}/attendance-reports/${id}`);
  return handle(res, "Failed to fetch attendance report");
}

export async function createAttendanceReport(data) {
  const res = await fetch(`${API_BASE}/attendance-reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res, "Failed to create attendance report");
}

export async function updateAttendanceReport(id, data) {
  const res = await fetch(`${API_BASE}/attendance-reports/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res, "Failed to update attendance report");
}

export async function deleteAttendanceReport(id) {
  const res = await fetch(`${API_BASE}/attendance-reports/${id}`, {
    method: "DELETE",
  });
  return handle(res, "Failed to delete attendance report");
}
