import { useState } from 'react';

export default function MemberForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: initial.id,
    memberNumber: initial.memberNumber || '',
    firstName: initial.firstName || '',
    lastName: initial.lastName || '',
    clownName: initial.clownName || '',
    address: initial.address || '',
    city: initial.city || '',
    state: initial.state || '',
    zip: initial.zip || '',
    phone: initial.phone || '',
    email: initial.email || '',
    attendedClownSchool: !!initial.attendedClownSchool,
    clownSchoolClass: initial.clownSchoolClass || '',
    joinDate: initial.joinDate || '',
    membershipType: initial.membershipType || '',
    membershipStatus: initial.membershipStatus || 'Active',
    deceased: !!initial.deceased,
    coaiNumber: initial.coaiNumber || '',
    tcaNumber: initial.tcaNumber || ''
  });

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}
      style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
    >
      <label>
        Member #
        <input
          value={form.memberNumber}
          onChange={e => update('memberNumber', e.target.value)}
          required
        />
      </label>
      <label>
        First Name
        <input
          value={form.firstName}
          onChange={e => update('firstName', e.target.value)}
          required
        />
      </label>
      <label>
        Last Name
        <input
          value={form.lastName}
          onChange={e => update('lastName', e.target.value)}
          required
        />
      </label>
      <label>
        Clown Name
        <input
          value={form.clownName}
          onChange={e => update('clownName', e.target.value)}
        />
      </label>

      <label>
        Address
        <input
          value={form.address}
          onChange={e => update('address', e.target.value)}
        />
      </label>
      <label>
        City
        <input
          value={form.city}
          onChange={e => update('city', e.target.value)}
        />
      </label>
      <label>
        State
        <input
          value={form.state}
          onChange={e => update('state', e.target.value)}
        />
      </label>
      <label>
        Zip
        <input
          value={form.zip}
          onChange={e => update('zip', e.target.value)}
        />
      </label>

      <label>
        Phone
        <input
          value={form.phone}
          onChange={e => update('phone', e.target.value)}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={e => update('email', e.target.value)}
        />
      </label>
      <label>
        Join Date
        <input
          type="date"
          value={form.joinDate}
          onChange={e => update('joinDate', e.target.value)}
        />
      </label>
      <label>
        Membership Type
        <input
          value={form.membershipType}
          onChange={e => update('membershipType', e.target.value)}
        />
      </label>

      <label>
        Status
        <select
          value={form.membershipStatus}
          onChange={e => update('membershipStatus', e.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Honorary</option>
        </select>
      </label>
      <label>
        Deceased
        <input
          type="checkbox"
          checked={form.deceased}
          onChange={e => update('deceased', e.target.checked)}
        />
      </label>
      <label>
        COAI #
        <input
          value={form.coaiNumber}
          onChange={e => update('coaiNumber', e.target.value)}
        />
      </label>
      <label>
        TCA #
        <input
          value={form.tcaNumber}
          onChange={e => update('tcaNumber', e.target.value)}
        />
      </label>

      <label>
        Attended Clown School
        <input
          type="checkbox"
          checked={form.attendedClownSchool}
          onChange={e => update('attendedClownSchool', e.target.checked)}
        />
      </label>
      <label>
        Clown School Class
        <input
          value={form.clownSchoolClass}
          onChange={e => update('clownSchoolClass', e.target.value)}
        />
      </label>

      <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
        <button
          type="submit"
          style={{
            padding: '0.4rem 1.2rem',
            borderRadius: '999px',
            border: 'none',
            background: '#1982c4',
            color: '#fff',
            fontWeight: 600,
            marginRight: '0.5rem'
          }}
        >
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
