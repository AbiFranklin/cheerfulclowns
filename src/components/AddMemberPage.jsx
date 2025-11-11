import { useEffect, useState } from "react";
import { createMember, updateMember } from "../api";

const MEMBERSHIP_TYPES = ["Family", "Associate", "Full", "Whisper"];
const MEMBERSHIP_STATUSES = ["Active", "Inactive", "Honorary"];

export default function AddMemberPage({
  mode = "add",
  initialData = null,
  onDone,
}) {
  const isEdit = mode === "edit";
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    memberNumber: "",
    lastName: "",
    firstName: "",
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
    membershipType: "",
    membershipStatus: "Active",
    deceased: false,
    coaiNumber: "",
    tcaNumber: "",
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        memberNumber: initialData.memberNumber || "",
        lastName: initialData.lastName || "",
        firstName: initialData.firstName || "",
        clownName: initialData.clownName || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zip: initialData.zip || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        attendedClownSchool: !!initialData.attendedClownSchool,
        clownSchoolClass: initialData.clownSchoolClass || "",
        joinDate: initialData.joinDate || "",
        membershipType: initialData.membershipType || "",
        membershipStatus: initialData.membershipStatus || "Active",
        deceased: !!initialData.deceased,
        coaiNumber: initialData.coaiNumber || "",
        tcaNumber: initialData.tcaNumber || "",
      });
    }
  }, [isEdit, initialData]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        attendedClownSchool: form.attendedClownSchool ? 1 : 0,
        deceased: form.deceased ? 1 : 0,
      };

      if (isEdit && initialData?.id) {
        await updateMember(initialData.id, payload);
      } else {
        await createMember(payload);
      }

      if (onDone) onDone();
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Failed to update member." : "Failed to create member.");
    } finally {
      setSaving(false);
    }
  }

  // small shared style helper
  const sectionStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "0.9rem",
    padding: "0.9rem",
    background: "#fafafa",
    marginBottom: "0.9rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    color: "#6b7280",
    marginBottom: "0.15rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.4rem 0.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    fontSize: "0.9rem",
    boxSizing: "border-box",
  };

  return (
    <div className="page-section">
      {/* Header */}
      <header style={{ marginBottom: "0.9rem" }}>
        <h2 style={{ margin: 0 }}>
          {isEdit ? "Edit Member" : "Add New Member"}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "#6b7280",
          }}
        >
          {isEdit
            ? "Update this member’s information. Changes are saved locally in your Alley database."
            : "Enter details for a new Cheerful Clown Alley #166 member."}
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Identity */}
        <section style={sectionStyle}>
          <h3
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Identity
          </h3>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            <div>
              <span style={labelStyle}>Member #</span>
              <input
                style={inputStyle}
                value={form.memberNumber}
                onChange={(e) => update("memberNumber", e.target.value)}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.4rem",
              }}
            >
              <div>
                <span style={labelStyle}>First Name *</span>
                <input
                  style={inputStyle}
                  required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>
              <div>
                <span style={labelStyle}>Last Name *</span>
                <input
                  style={inputStyle}
                  required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
            </div>

            <div>
              <span style={labelStyle}>Clown Name</span>
              <input
                style={inputStyle}
                value={form.clownName}
                onChange={(e) => update("clownName", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section style={sectionStyle}>
          <h3
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Contact
          </h3>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            <div>
              <span style={labelStyle}>Street Address</span>
              <input
                style={inputStyle}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 0.6fr 0.8fr",
                gap: "0.4rem",
              }}
            >
              <div>
                <span style={labelStyle}>City</span>
                <input
                  style={inputStyle}
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div>
                <span style={labelStyle}>State</span>
                <input
                  style={inputStyle}
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                />
              </div>
              <div>
                <span style={labelStyle}>Zip</span>
                <input
                  style={inputStyle}
                  value={form.zip}
                  onChange={(e) => update("zip", e.target.value)}
                />
              </div>
            </div>

            <div>
              <span style={labelStyle}>Phone</span>
              <input
                style={inputStyle}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>

            <div>
              <span style={labelStyle}>Email</span>
              <input
                type="email"
                style={inputStyle}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Membership */}
        <section style={sectionStyle}>
          <h3
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Membership
          </h3>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            <div>
              <span style={labelStyle}>Join Date</span>
              <input
                type="date"
                style={inputStyle}
                value={form.joinDate}
                onChange={(e) => update("joinDate", e.target.value)}
              />
            </div>

            <div>
              <span style={labelStyle}>Membership Type</span>
              <select
                style={inputStyle}
                value={form.membershipType}
                onChange={(e) => update("membershipType", e.target.value)}
              >
                <option value="">Select type...</option>
                {MEMBERSHIP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span style={labelStyle}>Membership Status</span>
              <select
                style={inputStyle}
                value={form.membershipStatus}
                onChange={(e) => update("membershipStatus", e.target.value)}
              >
                {MEMBERSHIP_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                color: "#4b5563",
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

            <div>
              <span style={labelStyle}>Clown School Class</span>
              <input
                style={inputStyle}
                value={form.clownSchoolClass}
                onChange={(e) =>
                  update("clownSchoolClass", e.target.value)
                }
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                color: "#b91c1c",
              }}
            >
              <input
                type="checkbox"
                checked={form.deceased}
                onChange={(e) => update("deceased", e.target.checked)}
              />
              Mark as Deceased
            </label>
          </div>
        </section>

        {/* Organization IDs */}
        <section style={sectionStyle}>
          <h3
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Organization IDs
          </h3>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            <div>
              <span style={labelStyle}>COAI Number</span>
              <input
                style={inputStyle}
                value={form.coaiNumber}
                onChange={(e) => update("coaiNumber", e.target.value)}
              />
            </div>

            <div>
              <span style={labelStyle}>TCA Number</span>
              <input
                style={inputStyle}
                value={form.tcaNumber}
                onChange={(e) => update("tcaNumber", e.target.value)}
              />
            </div>
          </div>
        </section>
      </form>

      {/* Actions */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
        <button
          type="button"
          onClick={onDone}
          disabled={saving}
          style={{
            padding: "0.5rem 1.1rem",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={saving}
          style={{
            padding: "0.55rem 1.3rem",
            borderRadius: "999px",
            border: "none",
            background: "#1982c4",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            opacity: saving ? 0.85 : 1,
          }}
        >
          {saving
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
            ? "Save Changes"
            : "Create Member"}
        </button>
      </div>
    </div>
  );
}
