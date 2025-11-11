const tabs = [
  { id: "members", label: "Members" },
  { id: "add-member", label: "Add Member" },
  { id: "dues", label: "Dues" },
  { id: "attendance", label: "Attendance" },
  { id: "reports", label: "Reports" },
];


export default function Layout({ tab, setTab, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top left, rgba(255,202,58,0.16), transparent), " +
          "radial-gradient(circle at top right, rgba(106,76,147,0.16), transparent), " +
          "var(--bg-gradient)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1rem 2.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(8px)",
          background:
            "linear-gradient(90deg, rgba(255,89,94,0.98), rgba(255,202,58,0.98))",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(15,23,42,0.18)",
          zIndex: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            Cheerful Clown Alley #166
          </div>
          <div
            style={{
              fontSize: "1rem",
              opacity: 0.95,
            }}
          >
            Membership • Dues • Attendance
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "1.6rem",
          }}
        >
          <button
            type="button"
            onClick={() => setTab("members")}
            style={{
              padding: "0.25rem 1rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.18)",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span>Local Admin Portal</span>
          </button>
          <span>🤡</span>
        </div>
      </header>

      {/* Tabs */}
      <nav
        style={{
          padding: "0.7rem 2.4rem 0.9rem",
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid rgba(148,163,253,0.18)",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.96), rgba(255,255,255,0.9))",
          backdropFilter: "blur(6px)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "0.22rem",
            borderRadius: "999px",
            background: "rgba(148,163,253,0.12)",
            boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
            gap: "0.18rem",
          }}
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: active
                    ? "linear-gradient(90deg, #ffca3a, #ff9f1c)"
                    : "transparent",
                  color: active ? "#111827" : "#6b7280",
                  boxShadow: active
                    ? "0 4px 10px rgba(15,23,42,0.18)"
                    : "none",
                  transition: "all 0.18s ease",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "1.6rem 2.4rem 2.2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.3rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
