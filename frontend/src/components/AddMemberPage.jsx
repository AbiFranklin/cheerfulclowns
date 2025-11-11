import { useState } from "react";
import { createMember } from "../api";

export default function AddMemberPage({ onDone }) {
  const [form, setForm] = useState({
    memberNumber: "",
    firstName: "",
    lastName: "",
    clownName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    attendedClownSchool: false,
    clownSchoolClass: "",
    joinDate: "",
    membershipType: "Full",
    membershipStatus: "Active",
    deceased: false,
    coaiNumber: "",
    tcaNumber: "",
  });

  const [saving, setSaving] = useState(false);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createMember(form);
      onDone(); // go back to Members list
    } catch (err) {
      console.error(err);
      alert("There was a problem saving this member.");
    } finally {
      setSaving(false);
    }
  };

  const label = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "0.95rem",
    color: "#374151",
  };

  const input = {
    padding: "0.5rem 0.65rem",
    borderRadius: "0.6rem",
    border: "1px solid #d1d5db",
    fontSize: "0.98rem",
  };

  const sectionTitle = {
    fontSize: "1.05rem",
    fontWeight: 600,
    marginBottom: "0.35rem",
    color: "#111827",
  };

  const section = {
    padding: "0.85rem 1rem",
    borderRadius: "1rem",
    background: "#fafafc",
    border: "1px solid rgba(209,213,219,0.7)",
    display: "grid",
    gap: "0.6rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  };

  return (
    <div className="page-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.85rem",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Add New Member</h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            Enter full details once. This will power your roster, dues, and
            attendance.
          </p>
        </div>
        <button
          type="button"
          onClick={onDone}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            background: "#fff",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          ← Back to Members
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
      >
        {/* Basic Identity */}
        <div style={section}>
          <div style={sectionTitle}>Basic Info</div>
          <label style={label}>
            Member Number *
            <input
              style={input}
              value={form.memberNumber}
              onChange={(e) => update("memberNumber", e.target.value)}
              required
            />
          </label>
          <label style={label}>
            First Name *
            <input
              style={input}
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </label>
          <label style={label}>
            Last Name *
            <input
              style={input}
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </label>
          <label style={label}>
            Clown Name
            <input
              style={input}
              value={form.clownName}
              onChange={(e) => update("clownName", e.target.value)}
              placeholder="KnitWit, Bubbles, etc."
            />
          </label>
        </div>

        {/* Contact Details */}
        <div style={section}>
          <div style={sectionTitle}>Contact Details</div>

          {/* Address Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 0.5fr 0.8fr",
              gap: "0.6rem",
              alignItems: "start",
              gridColumn: "1 / -1",
            }}
          >
            <label style={label}>
              Address
              <input
                style={input}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </label>

            <label style={label}>
              City
              <input
                style={input}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </label>

            <label style={label}>
              State
              <input
                style={input}
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
            </label>

            <label style={label}>
              Zip
              <input
                style={input}
                value={form.zip}
                onChange={(e) => update("zip", e.target.value)}
              />
            </label>
          </div>

          {/* Contact Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.6rem",
              alignItems: "start",
              gridColumn: "1 / -1",
            }}
          >
            <label style={label}>
              Phone Number
              <input
                style={input}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </label>

            <label style={label}>
              Email Address
              <input
                style={input}
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Membership */}
        <div style={section}>
          <div style={sectionTitle}>Membership Details</div>
          <label style={label}>
            Join Date
            <input
              type="date"
              style={input}
              value={form.joinDate}
              onChange={(e) => update("joinDate", e.target.value)}
            />
          </label>
          <label style={label}>
            Membership Type
            <select
              style={input}
              value={form.membershipType}
              onChange={(e) => update("membershipType", e.target.value)}
            >
              <option value="Family">Family</option>
              <option value="Associate">Associate</option>
              <option value="Full">Full</option>
              <option value="Whisper">Whisper</option>
            </select>
          </label>
          <label style={label}>
            Membership Status
            <select
              style={input}
              value={form.membershipStatus}
              onChange={(e) => update("membershipStatus", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Honorary">Honorary</option>
            </select>
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.95rem",
              color: "#374151",
            }}
          >
            <input
              type="checkbox"
              checked={form.deceased}
              onChange={(e) => update("deceased", e.target.checked)}
            />
            Deceased
          </label>
        </div>

        {/* Clown School + IDs */}
        <div style={section}>
          <div style={sectionTitle}>Clown School & Associations</div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.95rem",
              color: "#374151",
            }}
          >
            <input
              type="checkbox"
              checked={form.attendedClownSchool}
              onChange={(e) =>
                update("attendedClownSchool", e.target.checked)
              }
            />
            Attended Clown School
          </label>
          <label style={label}>
            Clown School Class
            <input
              style={input}
              value={form.clownSchoolClass}
              onChange={(e) => update("clownSchoolClass", e.target.value)}
            />
          </label>
          <label style={label}>
            COAI Number
            <input
              style={input}
              value={form.coaiNumber}
              onChange={(e) => update("coaiNumber", e.target.value)}
            />
          </label>
          <label style={label}>
            TCA Number
            <input
              style={input}
              value={form.tcaNumber}
              onChange={(e) => update("tcaNumber", e.target.value)}
            />
          </label>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "0.4rem",
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "0.6rem 1.6rem",
              borderRadius: "999px",
              border: "none",
              background: "#1982c4",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Member"}
          </button>
          <button
            type="button"
            onClick={onDone}
            style={{
              padding: "0.6rem 1.3rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#fff",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
