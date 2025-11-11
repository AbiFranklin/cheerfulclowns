// backend/server.js
import express from "express";
import cors from "cors";
import { db, initDb } from "./db.js";

initDb();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- DB HELPER WRAPPERS ----------

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // this.lastID, this.changes
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

// GET /api/members
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
      sql += " ORDER BY membershipStatus ASC, lastName ASC, firstName ASC";
    } else if (sortBy === "birthdate") {
      // Placeholder: you can change this if you add a birthdate column
      sql += " ORDER BY joinDate ASC, lastName ASC, firstName ASC";
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

// POST /api/members
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

// PUT /api/members/:id
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
    if (!updated) return res.status(404).json({ error: "Member not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: "Failed to update member" });
  }
});

// DELETE /api/members/:id
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

// GET /api/dues  (all dues, with member info)
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

// GET /api/members/:memberId/dues
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

// POST /api/members/:memberId/dues
// Body: { year, amount, paidDate, notes }
// Allows amount = 0
app.post("/api/members/:memberId/dues", async (req, res) => {
  try {
    const { memberId } = req.params;
    const { year, amount, paidDate, notes } = req.body;

    // Check presence (allow 0 for amount)
    if (
      year === undefined ||
      year === null ||
      paidDate === undefined ||
      paidDate === null ||
      paidDate === "" ||
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res
        .status(400)
        .json({ error: "year, amount, and paidDate are required" });
    }

    const numYear = Number(year);
    const numAmount = Number(amount);

    if (Number.isNaN(numYear) || Number.isNaN(numAmount)) {
      return res
        .status(400)
        .json({ error: "year and amount must be valid numbers" });
    }

    const result = await run(
      `INSERT INTO dues (memberId, year, amount, paidDate, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [memberId, numYear, numAmount, paidDate, notes || ""]
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

// PUT /api/dues/:id
// Body: { year, amount, paidDate, notes }
app.put("/api/dues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, amount, paidDate, notes } = req.body;

    const existing = await get("SELECT * FROM dues WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Dues record not found" });
    }

    const nextYear =
      year !== undefined && year !== null
        ? Number(year)
        : existing.year;
    const nextAmount =
      amount !== undefined && amount !== null && amount !== ""
        ? Number(amount)
        : existing.amount;
    const nextPaidDate =
      paidDate !== undefined && paidDate !== null && paidDate !== ""
        ? paidDate
        : existing.paidDate;
    const nextNotes =
      notes !== undefined && notes !== null
        ? notes
        : existing.notes;

    if (Number.isNaN(nextYear) || Number.isNaN(nextAmount)) {
      return res
        .status(400)
        .json({ error: "year and amount must be valid numbers" });
    }

    await run(
      `UPDATE dues
       SET year = ?, amount = ?, paidDate = ?, notes = ?
       WHERE id = ?`,
      [nextYear, nextAmount, nextPaidDate, nextNotes, id]
    );

    const updated = await get("SELECT * FROM dues WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    console.error("Error updating dues:", err);
    res.status(500).json({ error: "Failed to update dues" });
  }
});

// DELETE /api/dues/:id
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
// UPCOMING / DELINQUENT DUES REPORT
// =========================================================
//
// GET /api/reports/dues-upcoming?days=30
// Includes:
//  - Active, non-deceased members
//  - Excludes membershipType = 'Whisper'
//  - Uses last paidDate if any; otherwise joinDate; otherwise treats as overdue
//  - Returns members whose next due is:
//      - in the past (status: 'delinquent')
//      - or within next N days (status: 'upcoming')
//
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
      let last;

      if (m.lastPaidDate) {
        const parsed = new Date(m.lastPaidDate);
        last = Number.isNaN(parsed.getTime()) ? null : parsed;
      } else if (m.joinDate) {
        const jd = new Date(m.joinDate);
        last = Number.isNaN(jd.getTime()) ? null : jd;
      } else {
        // No info: assume due at least 1 year ago (so they'll show as delinquent)
        last = new Date(today);
        last.setFullYear(last.getFullYear() - 1);
      }

      if (!last) continue;

      const next = new Date(last);
      next.setFullYear(next.getFullYear() + 1);

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
          lastPaidDate: m.lastPaidDate
            ? m.lastPaidDate.slice(0, 10)
            : null,
          nextDueDate: next.toISOString().slice(0, 10),
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

// POST /api/attendance-reports
// Body: { year, month, label, presentMemberIds: [] }
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

// GET /api/attendance-reports
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

// GET /api/attendance-reports/:id  (with entries)
app.get("/api/attendance-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const report = await get(
      "SELECT * FROM attendance_reports WHERE id = ?",
      [id]
    );
    if (!report)
      return res.status(404).json({ error: "Attendance report not found" });

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

// PUT /api/attendance-reports/:id
// Body: { year, month, label, presentMemberIds }
app.put("/api/attendance-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, label, presentMemberIds } = req.body;

    const existing = await get(
      "SELECT * FROM attendance_reports WHERE id = ?",
      [id]
    );
    if (!existing)
      return res.status(404).json({ error: "Attendance report not found" });

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

// DELETE /api/attendance-reports/:id
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
  console.log(`🎪 Cheerful Clown Alley API running on http://localhost:${PORT}`);
});
