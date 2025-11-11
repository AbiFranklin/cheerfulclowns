import { useEffect, useState } from "react";
import { fetchMembers, deleteMember } from "../api";

export default function MembersPage({ goToAddMember, onEditMember }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load members.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Delete this member? This will also remove their dues and attendance."
      )
    ) {
      return;
    }
    try {
      await deleteMember(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
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
          <h2 style={{ margin: 0 }}>Members</h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            Browse all members and open full profiles to edit.
          </p>
        </div>
        <button
          type="button"
          onClick={goToAddMember}
          style={{
            padding: "0.5rem 1.2rem",
            borderRadius: "999px",
            border: "none",
            background: "#1982c4",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          + Add Member
        </button>
      </div>

      {loading ? (
        <div>Loading members...</div>
      ) : members.length === 0 ? (
        <div style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          No members yet. Add your first member to get started.
        </div>
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
                <th>#</th>
                <th>Clown / Name</th>
                <th>Contact</th>
                <th>Membership</th>
                <th>COAI / TCA</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.memberNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {m.clownName || (
                        <span style={{ color: "#9ca3af" }}>No clown name</span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                      }}
                    >
                      {m.firstName} {m.lastName}
                    </div>
                  </td>
                  <td>
                    <div>{m.phone || <span style={{ color: "#9ca3af" }}>No phone</span>}</div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#6b7280",
                        wordBreak: "break-all",
                      }}
                    >
                      {m.email || <span style={{ color: "#9ca3af" }}>No email</span>}
                    </div>
                  </td>
                  <td>
                    <div>{m.membershipType || "-"}</div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color:
                          m.membershipStatus === "Active"
                            ? "#16a34a"
                            : "#6b7280",
                      }}
                    >
                      {m.membershipStatus || "-"}
                    </div>
                    {m.deceased ? (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#b91c1c",
                        }}
                      >
                        Deceased
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <div>COAI: {m.coaiNumber || "-"}</div>
                    <div>TCA: {m.tcaNumber || "-"}</div>
                  </td>
                  <td>
                    <button
                      onClick={() => onEditMember(m)}
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
                      onClick={() => handleDelete(m.id)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
