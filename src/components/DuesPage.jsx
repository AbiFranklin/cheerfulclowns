import { useEffect, useState } from "react";
import {
  fetchAllDues,
  addMemberDues,
  deleteDues,
} from "../api";
import { fetchMembers } from "../api";

export default function DuesPage() {
  const [dues, setDues] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    memberId: "",
    year: new Date().getFullYear(),
    amount: "",
    paidDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [duesData, membersData] = await Promise.all([
      fetchAllDues(),
      fetchMembers({ status: "Active" }),
    ]);
    setDues(duesData);
    setMembers(membersData);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.memberId || !form.amount || !form.paidDate || !form.year) {
      alert("Please select a member, year, amount, and date.");
      return;
    }

    setSaving(true);
    try {
      await addMemberDues(form.memberId, {
        year: Number(form.year),
        amount: Number(form.amount),
        paidDate: form.paidDate,
        notes: form.notes,
      });
      setForm((prev) => ({
        ...prev,
        amount: "",
        notes: "",
      }));
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to add dues entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dues record?")) return;
    try {
      await deleteDues(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete dues entry.");
    }
  };

  return (
    <div className="page-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.75rem",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Dues</h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            Record membership dues and keep everyone in good standing.
          </p>
        </div>
      </div>

      {/* Add Dues Form */}
      <form
        onSubmit={handleAdd}
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(180px, 2fr) repeat(3, minmax(120px, 1fr)) minmax(200px, 2fr) auto",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "1rem",
          padding: "0.6rem 0.7rem",
          borderRadius: "0.9rem",
          background: "#fafafc",
          border: "1px solid rgba(209,213,219,0.9)",
        }}
      >
        {/* Member */}
        <div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.15rem",
            }}
          >
            Member
          </div>
          <select
            value={form.memberId}
            onChange={(e) => update("memberId", e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.55rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          >
            <option value="">Select member...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.clownName
                  ? `${m.clownName} (${m.firstName} ${m.lastName})`
                  : `${m.firstName} ${m.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.15rem",
            }}
          >
            Year
          </div>
          <input
            type="number"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.55rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Amount */}
        <div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.15rem",
            }}
          >
            Amount
          </div>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.55rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Paid Date */}
        <div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.15rem",
            }}
          >
            Paid Date
          </div>
          <input
            type="date"
            value={form.paidDate}
            onChange={(e) => update("paidDate", e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.55rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Notes */}
        <div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.15rem",
            }}
          >
            Notes
          </div>
          <input
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Cash at meeting, PayPal, etc."
            style={{
              width: "100%",
              padding: "0.45rem 0.55rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Button */}
        <div style={{ alignSelf: "flex-end" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "0.5rem 1.1rem",
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
            {saving ? "Saving..." : "Add Dues"}
          </button>
        </div>
      </form>

      {/* Dues Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Year</th>
            <th>Amount</th>
            <th>Paid Date</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dues.map((d) => (
            <tr key={d.id}>
              <td>
                {d.clownName
                  ? `${d.clownName} (${d.firstName} ${d.lastName})`
                  : `${d.firstName} ${d.lastName}`}{" "}
                {d.memberNumber ? `#${d.memberNumber}` : ""}
              </td>
              <td>{d.year}</td>
              <td>${Number(d.amount).toFixed(2)}</td>
              <td>{d.paidDate?.slice(0, 10)}</td>
              <td>{d.notes}</td>
              <td>
                <button
                  onClick={() => handleDelete(d.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#ff595e",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {dues.length === 0 && (
            <tr>
              <td
                colSpan="6"
                style={{ padding: "1rem", textAlign: "center", color: "#9ca3af" }}
              >
                No dues recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
