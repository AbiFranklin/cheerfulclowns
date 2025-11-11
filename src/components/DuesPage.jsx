import { useEffect, useState } from "react";
import {
  fetchAllDues,
  fetchMembers,
  addMemberDues,
  updateDues,
  deleteDues,
} from "../api";

export default function DuesPage() {
  const [dues, setDues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    memberId: "",
    year: new Date().getFullYear().toString(),
    amount: "",
    paidDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [savingNew, setSavingNew] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const [duesData, membersData] = await Promise.all([
        fetchAllDues(),
        fetchMembers(),
      ]);

      membersData.sort((a, b) => {
        const an = (a.clownName || `${a.firstName} ${a.lastName}`).toLowerCase();
        const bn = (b.clownName || `${b.firstName} ${b.lastName}`).toLowerCase();
        return an.localeCompare(bn);
      });

      setDues(duesData);
      setMembers(membersData);
    } catch (err) {
      console.error(err);
      alert("Failed to load dues data.");
    } finally {
      setLoading(false);
    }
  }

  function updateNew(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();

    const memberId = form.memberId;
    const year = Number(form.year);
    const amountRaw = form.amount;
    const amount = Number(amountRaw);
    const paidDate = (form.paidDate || "").trim();
    const notes = form.notes?.trim() || "";

    if (!memberId) {
      alert("Please select a member.");
      return;
    }
    if (!year || Number.isNaN(year)) {
      alert("Please enter a valid year.");
      return;
    }
    // allow 0, but not empty / NaN
    if (amountRaw === "" || Number.isNaN(amount)) {
      alert("Please enter a valid amount (0 or more).");
      return;
    }
    if (!paidDate) {
      alert("Please select a paid date.");
      return;
    }

    setSavingNew(true);
    try {
      await addMemberDues(memberId, {
        year,
        amount,
        paidDate,
        notes,
      });

      setForm((prev) => ({
        ...prev,
        amount: "",
        notes: "",
      }));

      await load();
    } catch (err) {
      console.error("Failed to add dues:", err);
      alert("Failed to add dues entry.");
    } finally {
      setSavingNew(false);
    }
  }

  // -------- Edit existing dues --------

  function startEdit(row) {
    setEditingId(row.id);
    setEditForm({
      id: row.id,
      year: row.year,
      amount: row.amount,
      paidDate: row.paidDate ? row.paidDate.slice(0, 10) : "",
      notes: row.notes || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
    setSavingEdit(false);
  }

  function updateEdit(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveEdit() {
    if (!editForm) return;

    const year = Number(editForm.year);
    const amountRaw = editForm.amount;
    const amount = Number(amountRaw);
    const paidDate = (editForm.paidDate || "").trim();
    const notes = editForm.notes?.trim() || "";

    if (!year || Number.isNaN(year)) {
      alert("Please enter a valid year.");
      return;
    }
    // allow 0, but not empty / NaN
    if (amountRaw === "" || Number.isNaN(amount)) {
      alert("Please enter a valid amount (0 or more).");
      return;
    }
    if (!paidDate) {
      alert("Please select a paid date.");
      return;
    }

    setSavingEdit(true);
    try {
      await updateDues(editForm.id, {
        year,
        amount,
        paidDate,
        notes,
      });
      await load();
      cancelEdit();
    } catch (err) {
      console.error("Failed to update dues:", err);
      alert("Failed to update dues entry.");
      setSavingEdit(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this dues record?")) return;
    try {
      await deleteDues(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete dues entry.");
    }
  }

  function formatMemberLabel(d) {
    const name = d.clownName
      ? `${d.clownName} (${d.firstName} ${d.lastName})`
      : `${d.firstName} ${d.lastName}`;
    return d.memberNumber ? `${name}  #${d.memberNumber}` : name;
  }

  return (
    <div className="page-section">
      {/* Header */}
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
            Record payments (including complimentary), fix mistakes, and keep
            everyone in good standing.
          </p>
        </div>
      </div>

      {/* New dues form */}
      <form
        onSubmit={handleAdd}
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(190px, 2.4fr) 90px 110px 140px minmax(180px, 2.2fr)",
          gap: "0.5rem",
          alignItems: "flex-end",
          marginBottom: "0.75rem",
          padding: "0.7rem 0.8rem 0.55rem",
          borderRadius: "0.9rem",
          background: "#fafafc",
          border: "1px solid rgba(209,213,219,0.9)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.15rem" }}>
            Member
          </div>
          <select
            value={form.memberId}
            onChange={(e) => updateNew("memberId", e.target.value)}
            style={{
              width: "100%",
              padding: "0.4rem 0.5rem",
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
                {m.memberNumber ? `  #${m.memberNumber}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.15rem" }}>
            Year
          </div>
          <input
            type="number"
            value={form.year}
            onChange={(e) => updateNew("year", e.target.value)}
            style={{
              width: "100%",
              padding: "0.4rem 0.5rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.15rem" }}>
            Amount
          </div>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => updateNew("amount", e.target.value)}
            style={{
              width: "100%",
              padding: "0.4rem 0.5rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.15rem" }}>
            Paid Date
          </div>
          <input
            type="date"
            value={form.paidDate}
            onChange={(e) => updateNew("paidDate", e.target.value)}
            style={{
              width: "100%",
              padding: "0.4rem 0.5rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.15rem" }}>
            Notes
          </div>
          <input
            value={form.notes}
            onChange={(e) => updateNew("notes", e.target.value)}
            placeholder="Cash, check, waived, etc."
            style={{
              width: "100%",
              padding: "0.4rem 0.5rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "0.15rem",
          }}
        >
          <button
            type="submit"
            disabled={savingNew}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: "999px",
              border: "none",
              background: "#1982c4",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              opacity: savingNew ? 0.8 : 1,
            }}
          >
            {savingNew ? "Adding..." : "Add Dues"}
          </button>
        </div>
      </form>

      {/* Dues table */}
      {loading ? (
        <div>Loading dues...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            className="table"
            style={{
              width: "100%",
              fontSize: "0.88rem",
              borderCollapse: "collapse",
            }}
          >
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
              {dues.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "0.9rem",
                      textAlign: "center",
                      color: "#9ca3af",
                    }}
                  >
                    No dues recorded yet.
                  </td>
                </tr>
              )}

              {dues.map((d) =>
                editingId === d.id && editForm ? (
                  <tr key={d.id} style={{ background: "#fff7ed" }}>
                    <td>{formatMemberLabel(d)}</td>
                    <td>
                      <input
                        type="number"
                        value={editForm.year}
                        onChange={(e) =>
                          updateEdit("year", e.target.value)
                        }
                        style={{
                          width: "4.5rem",
                          padding: "0.25rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.amount}
                        onChange={(e) =>
                          updateEdit("amount", e.target.value)
                        }
                        style={{
                          width: "5.5rem",
                          padding: "0.25rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editForm.paidDate}
                        onChange={(e) =>
                          updateEdit("paidDate", e.target.value)
                        }
                        style={{
                          padding: "0.25rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.notes}
                        onChange={(e) =>
                          updateEdit("notes", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.25rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={savingEdit}
                        style={{
                          marginRight: "0.25rem",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "999px",
                          border: "none",
                          background: "#16a34a",
                          color: "#fff",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        style={{
                          padding: "0.25rem 0.6rem",
                          borderRadius: "999px",
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={d.id}>
                    <td>{formatMemberLabel(d)}</td>
                    <td>{d.year}</td>
                    <td>${Number(d.amount).toFixed(2)}</td>
                    <td>{d.paidDate ? d.paidDate.slice(0, 10) : "-"}</td>
                    <td>{d.notes || ""}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => startEdit(d)}
                        style={{
                          marginRight: "0.25rem",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          border: "none",
                          background: "#ef4444",
                          color: "#fff",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
