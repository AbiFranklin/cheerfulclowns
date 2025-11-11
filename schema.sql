PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memberNumber TEXT UNIQUE,
  lastName TEXT NOT NULL,
  firstName TEXT NOT NULL,
  clownName TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  attendedClownSchool INTEGER DEFAULT 0,
  clownSchoolClass TEXT,
  joinDate TEXT,
  membershipType TEXT,
  membershipStatus TEXT, -- e.g. 'Active', 'Inactive', 'Honorary'
  deceased INTEGER DEFAULT 0,
  coaiNumber TEXT,
  tcaNumber TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- =========================
-- Dues Table
-- =========================
CREATE TABLE IF NOT EXISTS Dues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memberId INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount REAL NOT NULL,
  paidDate TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (memberId) REFERENCES Members(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS attendance_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL, -- 1-12
  label TEXT,             -- e.g. "January 2026 Meeting"
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS attendance_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reportId INTEGER NOT NULL,
  memberId INTEGER NOT NULL,
  present INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (reportId) REFERENCES attendance_reports(id) ON DELETE CASCADE,
  FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
);
