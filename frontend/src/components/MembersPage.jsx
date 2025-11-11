import { useEffect, useState } from "react";
import { fetchMembers, deleteMember } from "../api";

export default function MembersPage({ goToAddMember }) {
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");

  const load = async () => {
    const data = await fetchMembers(
      statusFilter ? { status: statusFilter } : {}
    );
    setMembers(data);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const onDelete = async (id) => {
    if (window.confirm("Delete this member?")) {
      await deleteMember(id);
      load();
    }
  };

  return (
    <div className="page-section">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Members</h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            View and manage all current and past members.
          </p>
        </div>

        <div
          style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value || "")}
            style={{
              padding: "0.4rem 0.7rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
            }}
          >
            <option value="Active">Active</option>
            <option value="">All</option>
            <option value="Inactive">Inactive</option>
            <option value="Honorary">Honorary</option>
          </select>

          <button
            onClick={goToAddMember}
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "999px",
              border: "none",
              background: "#8ac926",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Member
          </button>
        </div>
      </div>

      <table className="table" style={{ marginTop: "0.5rem" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Clown Name</th>
            <th>Name</th>
            <th>Status</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.memberNumber}</td>
              <td>{m.clownName}</td>
              <td>
                {m.firstName} {m.lastName}
              </td>
              <td>{m.membershipStatus}</td>
              <td>{m.membershipType}</td>
              <td>{m.phone}</td>
              <td>{m.email}</td>
              <td>
                {/* You can later wire an Edit Member page/tab here */}
                <button
                  onClick={() =>
                    alert("Edit view coming soon – data is already wired.")
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#1982c4",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(m.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#ff595e",
                    cursor: "pointer",
                    marginLeft: "0.4rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {members.length === 0 && (
            <tr>
              <td
                colSpan="8"
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#9ca3af",
                }}
              >
                No members yet. Use “Add Member” to create your first record.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
