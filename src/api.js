const API_BASE = 'http://localhost:4001/api';

export async function fetchMembers(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/members${q ? `?${q}` : ''}`);
  return res.json();
}

export async function createMember(data) {
  const res = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateMember(id, data) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteMember(id) {
  await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
}

export async function fetchDues(memberId) {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues`);
  return res.json();
}

export async function addDues(memberId, data) {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// GET /api/reports/dues-upcoming?days=30
// Includes:
// - Active, non-deceased, non-Whisper members
// - Those whose next due date is within next N days
// - PLUS anyone already delinquent (next due date in the past)
app.get("/api/reports/dues-upcoming", async (req, res) => {
  try {
    const days = parseInt(req.query.days || "30", 10);

    // Grab last paid date (if any) for each eligible member
    const rows = await all(
      `SELECT 
          m.id,
          m.memberNumber,
          m.firstName,
          m.lastName,
          m.clownName,
          m.email,
          m.membershipType,
          m.membershipStatus,
          m.deceased,
          m.joinDate,
          MAX(d.paidDate) AS lastPaidDate
       FROM members m
       LEFT JOIN dues d ON d.memberId = m.id
       WHERE m.membershipStatus = 'Active'
         AND m.deceased = 0
         AND (m.membershipType IS NULL OR m.membershipType != 'Whisper')
       GROUP BY m.id`
    );

    const today = new Date();
    const upper = new Date();
    upper.setDate(upper.getDate() + days);

    const results = [];

    for (const m of rows) {
      let last;

      if (m.lastPaidDate) {
        // Use latest recorded payment
        last = new Date(m.lastPaidDate);
        if (Number.isNaN(last.getTime())) {
          last = null;
        }
      } else if (m.joinDate) {
        // No dues record, fall back to join date as "baseline"
        const jd = new Date(m.joinDate);
        last = Number.isNaN(jd.getTime()) ? null : jd;
      } else {
        // No joinDate and no dues: treat as long overdue baseline = 1 year ago
        last = new Date(today);
        last.setFullYear(last.getFullYear() - 1);
      }

      if (!last) continue;

      const next = new Date(last);
      next.setFullYear(next.getFullYear() + 1);

      // Rule:
      // - Include if next due date is in the past (delinquent)
      // - OR within the next N days
      if (next <= upper) {
        const isDelinquent = next < today;

        results.push({
          id: m.id,
          memberNumber: m.memberNumber,
          firstName: m.firstName,
          lastName: m.lastName,
          clownName: m.clownName,
          email: m.email,
          membershipType: m.membershipType,
          lastPaidDate: m.lastPaidDate ? m.lastPaidDate.slice(0, 10) : null,
          nextDueDate: next.toISOString().slice(0, 10),
          status: isDelinquent ? "delinquent" : "upcoming"
        });
      }
    }

    // Sort: earliest nextDue first (so the worst offenders float up)
    results.sort(
      (a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate)
    );

    res.json(results);
  } catch (err) {
    console.error("Error building upcoming dues report:", err);
    res.status(500).json({ error: "Failed to build upcoming dues report" });
  }
});


export async function listAttendanceReports() {
  const res = await fetch(`${API_BASE}/attendance-reports`);
  return res.json();
}

export async function getAttendanceReport(id) {
  const res = await fetch(`${API_BASE}/attendance-reports/${id}`);
  return res.json();
}

export async function createAttendanceReport(data) {
  const res = await fetch(`${API_BASE}/attendance-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// 👇 THIS is the missing one
export async function fetchAttendanceReport(id) {
  const res = await fetch(`${API_BASE}/attendance-reports/${id}`);
  if (!res.ok) throw new Error("Failed to fetch attendance report");
  return res.json();
}

export async function updateAttendanceReport(id, data) {
  const res = await fetch(`${API_BASE}/attendance-reports/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteAttendanceReport(id) {
  await fetch(`${API_BASE}/attendance-reports/${id}`, { method: 'DELETE' });
}

// --- Dues API ---

export async function fetchAllDues() {
  const res = await fetch(`${API_BASE}/dues`);
  if (!res.ok) throw new Error("Failed to fetch dues");
  return res.json();
}

export async function fetchMemberDues(memberId) {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues`);
  if (!res.ok) throw new Error("Failed to fetch member dues");
  return res.json();
}

export async function addMemberDues(memberId, data) {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add dues");
  return res.json();
}

export async function updateDues(id, data) {
  const res = await fetch(`${API_BASE}/dues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update dues");
  return res.json();
}

export async function deleteDues(id) {
  const res = await fetch(`${API_BASE}/dues/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete dues");
  return res.json();
}

