import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🟢 1. ራውተሩን ለማንቀሳቀስ የተጨመረ
import axios from 'axios';

const PoolFocalDashboard = () => {
  const navigate = useNavigate(); // 🟢 2. ናቪጌተሩን ማዋቀር
  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // ዱሮፕዳውኑን በማጥፋት የገባውን ዩዘር ፑል ስም በቀጥታ ከ sessionStorage እንቀበላለን
  const loggedInUser = JSON.parse(sessionStorage.getItem('user')) || {};
  const focalPool = loggedInUser.pool_name || localStorage.getItem('user_pool_name') || 'Communication Pool';

  // የተመረጠው መስሪያ ቤት (Sub-department/Office) ስቴት
  const [selectedOffice, setSelectedOffice] = useState(null);

  const focalName = loggedInUser.username || localStorage.getItem('user_name') || 'የፑል ተቆጣጣሪ';
  const todayDate = new Date().toISOString().split('T')[0];

  // ለተመረጠው ፑል ሊኖሩ የሚችሉ መስሪያ ቤቶች (Offices / Sub-departments)
  const poolOffices = {
    'Communication Pool': [
      { id: 'communication', name: 'Communication & Media', icon: '📢' },
      { id: 'sport', name: 'Sport & Youth Affairs', icon: '⚽' },
      { id: 'nigd', name: 'Trade & Market Development', icon: '🛒' },
      { id: 'gebiwoch', name: 'Revenue & Collection', icon: '💰' }
    ],
    'Administration Pool': [
      { id: 'finance', name: 'Finance & Economic Dev', icon: '📊' },
      { id: 'sra_sltena', name: 'Work & Skills Training', icon: '🛠️' },
      { id: 'tikakn', name: 'Peace & Security', icon: '🛡️' }
    ],
    'Civil Service Pool': [
      { id: 'setoch_htsanat', name: 'Women & Children Affairs', icon: '👩‍👧‍👦' },
      { id: 'civil_service', name: 'Human Resource & Civil Service', icon: '🏛️' }
    ]
  };

  useEffect(() => {
    fetchStaffAndAttendance();
  }, [focalPool]);

  const fetchStaffAndAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/staff');
      // የዚህን ፑል ሰራተኞች ብቻ እናጣራለን
      const filteredStaff = res.data.filter(staff => staff.department === focalPool);
      setStaffList(filteredStaff);
      setLoading(false);
    } catch (err) {
      console.error("ሰራተኞችን ማምጣት አልተቻለም:", err);
      setLoading(false);
    }
  };

  const handleStatusChange = (staffId, status) => {
    setAttendance(prev => ({
      ...prev,
      [staffId]: status
    }));
  };

  const handleAttendanceSubmit = async (staffId) => {
    const status = attendance[staffId] || 'Present';
    
    const payload = {
      staff_id: staffId,
      pool_name: focalPool,
      attendance_date: todayDate,
      status: status,
      recorded_by: focalName,
      role: 'pool_focal'
    };

    try {
      const res = await axios.post('http://localhost:5000/api/pool/attendance', payload);
      setMessage({ text: res.data.message, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.error || 'መመዝገብ አልተቻለም', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '18px', color: '#555' }}>
        የጫነ ነው, እባክዎ ይቆዩ...
      </div>
    );
  }

  // አሁን ያሉትን መስሪያ ቤቶች ዝርዝር ማምጣት
  const currentOffices = poolOffices[focalPool] || [];

  const filteredStaffByOffice = selectedOffice 
    ? staffList.filter(staff => staff.sub_department === selectedOffice || true) 
    : staffList;

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', background: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* Header Card */}
      <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', borderLeft: '6px solid #2563eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            የተቆጣጣሪ ፖርታል (Focal Portal)
          </span>
          <h2 style={{ margin: '12px 0 8px 0', color: '#1e293b', fontSize: '26px' }}>የፑል መገኘት ማስተዳደሪያ</h2>
          <p style={{ margin: '0', color: '#64748b', fontSize: '15px' }}>
            <b>ተቆጣጣሪ:</b> {focalName} &nbsp;|&nbsp; <b>ቀን:</b> {todayDate}
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '15px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: '220px', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>
            የሚያስተዳድሩት ዋና ፑል:
          </span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>
            {focalPool}
          </span>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div style={{ padding: '15px 20px', marginBottom: '25px', borderRadius: '8px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, fontWeight: '500' }}>
          {message.text}
        </div>
      )}

      {/* 🟢 የካርድ እይታ (Cards Grid) - መስሪያ ቤቶች ሲጫኑ ወደ YearlyAttendance ሪዳይሬክት ያደርጋል */}
      {!selectedOffice ? (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#334155', fontSize: '20px' }}>
            የ <span style={{ color: '#2563eb' }}>{focalPool}</span> መስሪያ ቤቶች (Departments)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {currentOffices.map((office) => (
              <div 
                key={office.id}
                onClick={() => navigate('/attendance-dashboard')} // 🟢 3. ካርዱ ሲነካ ወደ ዓመታዊው ክትትል ገጽ ይወስዳል
                style={{
                  background: '#ffffff',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(37,99,235,0.1)';
                  e.currentTarget.style.borderColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{office.icon}</div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '18px' }}>{office.name}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>ሰራተኞችን ለመመልከት እና አቴንዳንስ ለመመዝገብ ይጫኑ</p>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>ይግቡ ➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default PoolFocalDashboard;