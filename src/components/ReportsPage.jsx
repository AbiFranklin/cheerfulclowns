export default function ReportsPage() {
  return (
    <div className="page-section">
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.75rem'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Reports</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
            Dues coming up, directory exports, and other alley insights.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          marginBottom: '0.75rem',
          fontSize: '0.85rem'
        }}
      >
        <span>Upcoming dues within</span>
        <input
          type="number"
          defaultValue={30}
          style={{ width: '3.5rem' }}
        />
        <span>days</span>
        <button
          style={{
            padding: '0.25rem 0.8rem',
            borderRadius: '999px',
            border: 'none',
            background: '#1982c4',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Run
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Clown Name</th>
            <th>Name</th>
            <th>Email</th>
            <th>Next Due Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Placeholder row until wired up */}
          <tr>
            <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
              Upcoming dues results will appear here once connected to the backend.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
