// backend/server.js
import express from "express";
import cors from "cors";
import { db, initDb } from "./db.js";

initDb();

const app = express();
app.use(cors());
app.use(express.json());

// =========================================================
// DB HELPERS
// =========================================================

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // has lastID, changes
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// =========================================================
// MEMBERS
// =========================================================

// List members (optional: status filter, simple sort)
app.get("/api/members", async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    let sql = "SELECT * FROM members";
    const params = [];

    if (status) {
      sql += " WHERE membershipStatus = ?";
      params.push(status);
    }

    if (sortBy === "status") {
      sql += " ORDER BY membershipStatus ASC, lastName ASC";
    } else if (sortBy === "birthdate") {
      // Placeholder: no birthdate column; using joinDate as proxy
      sql += " ORDER BY joinDate ASC, lastName ASC";
    } else {
      sql += " ORDER BY lastName ASC, firstName ASC";
    }

    const rows = await all(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Create member
app.post("/api/members", async (req, res) => {
  try {
    const m = req.body;
    const sql = `
      INSERT INTO members (
        memberNumber,
        lastName,
        firstName,
        clownName,
        address,
        city,
        state,
        zip,
        phone,
        email,
        attendedClownSchool,
        clownSchoolClass,
        joinDate,
        membershipType,
        membershipStatus,
        deceased,
        coaiNumber,
        tcaNumber,
        updatedAt
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    `;

    const params = [
      m.memberNumber,
      m.lastName,
      m.firstName,
      m.clownName,
      m.address,
      m.city,
      m.state,
      m.zip,
      m.phone,
      m.email,
      m.attendedClownSchool ? 1 : 0,
      m.clownSchoolClass,
      m.joinDate,
      m.membershipType,
      m.membershipStatus,
      m.deceased ? 1 : 0,
      m.coaiNumber,
      m.tcaNumber
    ];

    const result = await run(sql, params);
    const created = await get("SELECT * FROM members WHERE id = ?", [
      result.lastID
    ]);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating member:", err);
    res.status(500).json({ error: "Failed to create member" });
  }
});

// Update member
app.put("/api/members/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const m = req.body;

    const sql = `
      UPDATE members SET
        memberNumber = ?,
        lastName = ?,
        firstName = ?,
        clownName = ?,
        address = ?,
        city = ?,
        state = ?,
        zip = ?,
        phone = ?,
        email = ?,
        attendedClownSchool = ?,
        clownSchoolClass = ?,
        joinDate = ?,
        membershipType = ?,
        membershipStatus = ?,
        deceased = ?,
        coaiNumber = ?,
        tcaNumber = ?,
        updatedAt = datetime('now')
      WHERE id = ?
    `;

    const params = [
      m.memberNumber,
      m.lastName,
      m.firstName,
      m.clownName,
      m.address,
      m.city,
      m.state,
      m.zip,
      m.phone,
      m.email,
      m.attendedClownSchool ? 1 : 0,
      m.clownSchoolClass,
      m.joinDate,
      m.membershipType,
      m.membershipStatus,
      m.deceased ? 1 : 0,
      m.coaiNumber,
      m.tcaNumber,
      id
    ];

    await run(sql, params);
    const updated = await get("SELECT * FROM members WHERE id = ?", [id]);
    if (!updated) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: "Failed to update member" });
  }
});

// Delete member
app.delete("/api/members/:id", async (req, res) => {
  try {
    await run("DELETE FROM members WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// =========================================================
// DUES
// (table: dues (id, memberId, year, amount, paidDate, notes))
// =========================================================

// Get all dues (with member info)
app.get("/api/dues", async (req, res) => {
  try {
    const rows = await all(
      `SELECT d.*,
              m.firstName,
              m.lastName,
              m.clownName,
              m.memberNumber
       FROM dues d
       JOIN members m ON m.id = d.memberId
       ORDER BY d.paidDate DESC, d.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching dues:", err);
    res.status(500).json({ error: "Failed to fetch dues" });
  }
});

// Get dues for a specific member
app.get("/api/members/:memberId/dues", async (req, res) => {
  try {
    const { memberId } = req.params;
    const rows = await all(
      `SELECT * FROM dues
       WHERE memberId = ?
       ORDER BY paidDate DESC, id DESC`,
      [memberId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching member dues:", err);
    res.status(500).json({ error: "Failed to fetch member dues" });
  }
});

// Add dues for a specific member
// Body: { year, amount, paidDate, notes }
app.post("/api/members/:memberId/dues", async (req, res) => {
  try {
    const { memberId } = req.params;
    const { year, amount, paidDate, notes } = req.body;

    if (!year || !amount || !paidDate) {
      return res
        .status(400)
        .json({ error: "year, amount, and paidDate are required" });
    }

    const result = await run(
      `INSERT INTO dues (memberId, year, amount, paidDate, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [memberId, year, amount, paidDate, notes || ""]
    );

    const created = await get("SELECT * FROM dues WHERE id = ?", [
      result.lastID
    ]);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error adding dues:", err);
    res.status(500).json({ error: "Failed to add dues" });
  }
});

// Update dues
// Body: { year, amount, paidDate, notes }
app.put("/api/dues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, amount, paidDate, notes } = req.body;

    const existing = await get("SELECT * FROM dues WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Dues record not found" });
    }

    await run(
      `UPDATE dues
       SET year = ?, amount = ?, paidDate = ?, notes = ?
       WHERE id = ?`,
      [
        year ?? existing.year,
        amount ?? existing.amount,
        paidDate ?? existing.paidDate,
        notes ?? existing.notes,
        id
      ]
    );

    const updated = await get("SELECT * FROM dues WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    console.error("Error updating dues:", err);
    res.status(500).json({ error: "Failed to update dues" });
  }
});

// Delete dues
app.delete("/api/dues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await run("DELETE FROM dues WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting dues:", err);
    res.status(500).json({ error: "Failed to delete dues" });
  }
});

// =========================================================
// UPCOMING + DELINQUENT DUES REPORT
// =========================================================
//
// GET /api/reports/dues-upcoming?days=30
// Includes:
// - Active, non-deceased members
// - Excludes membershipType = 'Whisper'
// - Members whose next due date is within next N days
// - PLUS members whose next due date is already past (delinquent)

app.get("/api/reports/dues-upcoming", async (req, res) => {
  try {
    const days = parseInt(req.query.days || "30", 10);

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
      let lastBase = null;

      if (m.lastPaidDate) {
        const parsed = new Date(m.lastPaidDate);
        if (!Number.isNaN(parsed.getTime())) {
          lastBase = parsed;
        }
      }

      // If no dues paid, fall back to joinDate
      if (!lastBase && m.joinDate) {
        const jd = new Date(m.joinDate);
        if (!Number.isNaN(jd.getTime())) {
          lastBase = jd;
        }
      }

      // If still nothing, treat as overdue baseline (1 year ago)
      if (!lastBase) {
        lastBase = new Date(today);
        lastBase.setFullYear(lastBase.getFullYear() - 1);
      }

      const nextDue = new Date(lastBase);
      nextDue.setFullYear(nextDue.getFullYear() + 1);

      const isDelinquent = nextDue < today;
      const isUpcoming = nextDue >= today && nextDue <= upper;

      if (isDelinquent || isUpcoming) {
        results.push({
          id: m.id,
          memberNumber: m.memberNumber,
          firstName: m.firstName,
          lastName: m.lastName,
          clownName: m.clownName,
          email: m.email,
          membershipType: m.membershipType,
          lastPaidDate: m.lastPaidDate ? m.lastPaidDate.slice(0, 10) : null,
          nextDueDate: nextDue.toISOString().slice(0, 10),
          status: isDelinquent ? "delinquent" : "upcoming"
        });
      }
    }

    results.sort(
      (a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate)
    );

    res.json(results);
  } catch (err) {
    console.error("Error building upcoming dues report:", err);
    res.status(500).json({ error: "Failed to build upcoming dues report" });
  }
});

// =========================================================
// ATTENDANCE
// Tables:
//  attendance_reports(id, year, month, label, createdAt)
//  attendance_entries(id, reportId, memberId, present)
// =========================================================

// Create attendance report
// Body: { year, month, label, presentMemberIds: number[] }
app.post("/api/attendance-reports", async (req, res) => {
  try {
    const { year, month, label, presentMemberIds } = req.body;

    if (!year || !month) {
      return res.status(400).json({ error: "year and month are required" });
    }

    const result = await run(
      `INSERT INTO attendance_reports (year, month, label)
       VALUES (?, ?, ?)`,
      [year, month, label || null]
    );

    const reportId = result.lastID;

    if (Array.isArray(presentMemberIds)) {
      for (const memberId of presentMemberIds) {
        await run(
          `INSERT INTO attendance_entries (reportId, memberId, present)
           VALUES (?, ?, 1)`,
          [reportId, memberId]
        );
      }
    }

    const created = await get(
      "SELECT * FROM attendance_reports WHERE id = ?",
      [reportId]
    );
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating attendance report:", err);
    res.status(500).json({ error: "Failed to create attendance report" });
  }
});

// List attendance reports
app.get("/api/attendance-reports", async (req, res) => {
  try {
    const reports = await all(
      `SELECT * FROM attendance_reports
       ORDER BY year DESC, month DESC, id DESC`
    );
    res.json(reports);
  } catch (err) {
    console.error("Error fetching attendance reports:", err);
    res.status(500).json({ error: "Failed to fetch attendance reports" });
  }
});

// Get single attendance report + entries
app.get("/api/attendance-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const report = await get(
      "SELECT * FROM attendance_reports WHERE id = ?",
      [id]
    );
    if (!report) {
      return res.status(404).json({ error: "Attendance report not found" });
    }

    const entries = await all(
      `SELECT ae.*,
              m.clownName,
              m.firstName,
              m.lastName
       FROM attendance_entries ae
       JOIN members m ON m.id = ae.memberId
       WHERE ae.reportId = ?
       ORDER BY m.clownName ASC, m.lastName ASC`,
      [id]
    );

    res.json({ ...report, entries });
  } catch (err) {
    console.error("Error fetching attendance report:", err);
    res.status(500).json({ error: "Failed to fetch attendance report" });
  }
});

// Update attendance report
// Body may include: { year, month, label, presentMemberIds: number[] }
app.put("/api/attendance-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, label, presentMemberIds } = req.body;

    const existing = await get(
      "SELECT * FROM attendance_reports WHERE id = ?",
      [id]
    );
    if (!existing) {
      return res.status(404).json({ error: "Attendance report not found" });
    }

    await run(
      `UPDATE attendance_reports
       SET year = ?, month = ?, label = ?
       WHERE id = ?`,
      [
        year ?? existing.year,
        month ?? existing.month,
        label ?? existing.label,
        id
      ]
    );

    if (Array.isArray(presentMemberIds)) {
      await run("DELETE FROM attendance_entries WHERE reportId = ?", [id]);
      for (const memberId of presentMemberIds) {
        await run(
          `INSERT INTO attendance_entries (reportId, memberId, present)
           VALUES (?, ?, 1)`,
          [id, memberId]
        );
      }
    }

    const updated = await get(
      "SELECT * FROM attendance_reports WHERE id = ?",
      [id]
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating attendance report:", err);
    res.status(500).json({ error: "Failed to update attendance report" });
  }
});

// Delete attendance report (entries removed via FK cascade)
app.delete("/api/attendance-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await run("DELETE FROM attendance_reports WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting attendance report:", err);
    res.status(500).json({ error: "Failed to delete attendance report" });
  }
});

// =========================================================
// START SERVER
// =========================================================

const PORT = 4001;
app.listen(PORT, () => {
  console.log(
    `🎪 Cheerful Clown Alley API running on http://localhost:${PORT}`
  );
});
