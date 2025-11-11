import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function DirectoryPdfButton({ members }) {
  const generatePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Cheerful Clown Alley #166', 14, 16);
    doc.setFontSize(11);
    doc.text('Membership Directory', 14, 24);

    const rows = members.map(m => [
      m.memberNumber || '',
      m.clownName || '',
      `${m.firstName || ''} ${m.lastName || ''}`,
      m.phone || '',
      m.email || '',
      `${m.address || ''} ${m.city || ''} ${m.state || ''} ${m.zip || ''}`.trim()
    ]);

    doc.autoTable({
      startY: 30,
      head: [['#', 'Clown', 'Name', 'Phone', 'Email', 'Address']],
      body: rows,
      styles: { fontSize: 8 }
    });

    doc.save('clown-alley-membership-directory.pdf');
  };

  return (
    <button
      onClick={generatePdf}
      style={{
        padding: '0.35rem 0.9rem',
        borderRadius: '999px',
        border: 'none',
        background: '#6a4c93',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      Export Directory PDF
    </button>
  );
}
