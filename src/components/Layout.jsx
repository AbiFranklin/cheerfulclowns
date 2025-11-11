// src/components/Layout.jsx

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
        background:
          "linear-gradient(135deg, #fffae5 0%, #ffe4f3 35%, #e0f4ff 100%)",
        padding: "1.5rem 2rem",
        boxSizing: "border-box",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.94)",
          borderRadius: "1.5rem",
          padding: "1.25rem 1.5rem 1.5rem",
          boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.65rem",
                fontWeight: 800,
                letterSpacing: "0.03em",
                color: "#111827",
              }}
            >
              Cheerful Clown Alley #166
            </h1>
            <div
              style={{
                fontSize: "0.95rem",
                color: "#6b7280",
              }}
            >
              Membership • Dues • Attendance • Reports
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            padding: "0.25rem",
            borderRadius: "999px",
            background: "rgba(243,244,246,0.98)",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {tabs.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "0.95rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
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
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            background: "#ffffff",
            borderRadius: "1.2rem",
            padding: "1rem 1.1rem",
            border: "1px solid rgba(229,231,235,0.9)",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
