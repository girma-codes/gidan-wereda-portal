import React, { useEffect, useState } from 'react';

export default function StaffRegistrarDashboard() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // የሰራተኛ ፎርም ስቴቶች
  const [staffName, setStaffName] = useState('');
  const [staffPosition, setStaffPosition] = useState('');
  const [staffDepartment, setStaffDepartment] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffStatus, setStaffStatus] = useState('available');
  const [staffEditId, setStaffEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchStaff = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/staff')
      .then((res) => {
        if (!res.ok) throw new Error('ሰራተኞችን ማምጣት አልተቻለም');
        return res.json();
      })
      .then((data) => {
        setStaffList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    
    // 🟢 እዚህ ጋር ዩአርኤሉ ከባክኤንድ ራውት ጋር በትክክል እንዲመሳሰል ተደርጓል
    const url = staffEditId 
      ? `http://localhost:5000/api/admin/staff/${staffEditId}` 
      : 'http://localhost:5000/api/admin/staff';
    
    const method = staffEditId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: staffName,
        position: staffPosition,
        department: staffDepartment,
        phone: staffPhone,
        status: staffStatus,
        ict_key: 'gidan_ict_key_2026'
      })
    })
    .then(async res => {
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("ሰርቨሩ ትክክለኛ ያልሆነ ምላሽ (HTML) መልሷል። እባክዎ የባክኤንድ ዩአርኤል (URL) ትክክል መሆኑን ይፈትሹ!");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'አሰራሩ አልተሳካም');
      return data;
    })
    .then(data => {
      setMessage(data.message || 'ሰራተኛው በተሳካ ሁኔታ ተመዝግቧል!');
      setStaffName('');
      setStaffPosition('');
      setStaffDepartment('');
      setStaffPhone('');
      setStaffStatus('available');
      setStaffEditId(null);
      fetchStaff();
    })
    .catch(err => setMessage(err.message));
  };

  const handleDeleteStaff = (id) => {
    if (!window.confirm('ይህን ሰራተኛ ከስራ ሰንጠረዥ መሰረዝ ትፈልጋለህ?')) return;

    fetch(`http://localhost:5000/api/admin/staff/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ict_key: 'gidan_ict_key_2026' })
    })
    .then(async res => {
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("ሰርቨሩ ትክክለኛ ያልሆነ ምላሽ (HTML) መልሷል።");
      }
      return res.json();
    })
    .then(data => {
      setMessage(data.message || 'ሰራተኛው ተሰርዟል!');
      fetchStaff();
    })
    .catch((err) => alert(err.message || 'መሰረዝ አልተቻለም'));
  };

  return (
    <div style={{ background: 'var(--soft)', minHeight: '100vh', padding: '50px 0' }}>
      <div className="container">
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '1.8px', fontWeight: '800', color: 'var(--blue)' }}>HR / REGISTRAR</span>
          <h1 style={{ fontSize: '28px', margin: '8px 0 5px', color: 'var(--navy)' }}>የሰራተኞች አስተዳደር ማዕከል</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>አዳዲስ ሰራተኞችን መመዝገብ፣ መረጃ ማስተካከል እና የስራ ሁኔታ መቆጣጠር</p>
        </div>

        {error && <div style={{ color: 'var(--red)', padding: '20px', background: '#FDECEC', borderRadius: '12px' }}>{error}</div>}

        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '25px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 15px', color: 'var(--navy)' }}>
            {staffEditId ? '✏️ የሰራተኛ መረጃ ማስተካከያ' : '👥 አዲስ ሰራተኛ መመዝገቢያ'}
          </h2>

          {message && <div style={{ background: 'var(--sky)', color: 'var(--blue)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>{message}</div>}

          <form onSubmit={handleStaffSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <input type="text" placeholder="ሙሉ ስም" value={staffName} onChange={(e) => setStaffName(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            <input type="text" placeholder="የስራ መደብ (Position)" value={staffPosition} onChange={(e) => setStaffPosition(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            <input type="text" placeholder="መምሪያ (Department)" value={staffDepartment} onChange={(e) => setStaffDepartment(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            <input type="text" placeholder="ስልክ ቁጥር" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            <select value={staffStatus} onChange={(e) => setStaffStatus(e.target.value)} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <option value="available">🟢 በስራ ላይ ይገኛል</option>
              <option value="busy">🟠 ስራ ላይ ነው</option>
              <option value="offline">🔴 በስራ ላይ የለም</option>
            </select>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ background: 'var(--blue)', color: '#fff', border: 0, padding: '12px 25px', borderRadius: '8px', cursor: 'pointer' }}>
                {staffEditId ? 'ለውጦችን አስቀምጥ' : 'መዝግብ'}
              </button>
              {staffEditId && (
                <button type="button" onClick={() => { setStaffEditId(null); setStaffName(''); setStaffPosition(''); setStaffDepartment(''); setStaffPhone(''); }} style={{ background: 'var(--muted)', color: '#fff', border: 0, padding: '12px 25px', borderRadius: '8px', cursor: 'pointer' }}>
                  ሰርዝ
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '25px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--soft)', borderBottom: '1px solid var(--line)', fontSize: '12px', color: 'var(--muted)' }}>
                <th style={{ padding: '15px' }}>ስም</th>
                <th style={{ padding: '15px' }}>የስራ መደብ</th>
                <th style={{ padding: '15px' }}>መምሪያ</th>
                <th style={{ padding: '15px' }}>ስልክ</th>
                <th style={{ padding: '15px' }}>ሁኔታ</th>
                <th style={{ padding: '15px' }}>እርምጃዎች</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{st.name}</td>
                  <td style={{ padding: '15px' }}>{st.position}</td>
                  <td style={{ padding: '15px' }}>{st.department}</td>
                  <td style={{ padding: '15px' }}>{st.phone}</td>
                  <td style={{ padding: '15px' }}>{st.status}</td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setStaffEditId(st.id); setStaffName(st.name); setStaffPosition(st.position); setStaffDepartment(st.department); setStaffPhone(st.phone); setStaffStatus(st.status); }} style={{ background: '#F59E0B', color: '#fff', border: 0, padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>አስተካክል</button>
                    <button onClick={() => handleDeleteStaff(st.id)} style={{ background: 'var(--red)', color: '#fff', border: 0, padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>ሰርዝ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}