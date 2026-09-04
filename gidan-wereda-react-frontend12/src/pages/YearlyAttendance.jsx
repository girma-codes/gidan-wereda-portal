import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function YearlyAttendance() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [isSaved, setIsSaved] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const menuRef = useRef(null);

  // Chat Box States
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState('');

  // ቻት ከሰርቨር ለማምጣት (Fetch Chat Messages)
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/focal/chat');
      if (response.data && Array.isArray(response.data)) {
        setChatMessages(response.data);
      }
    } catch (err) {
      console.error('የቻት መረጃዎችን ማምጣት አልተቻለም:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowReportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    { am: 'መስከረም', en: 'Meskerem', sub: 'Sept' },
    { am: 'ጥቅምት', en: 'Tikimt', sub: 'Oct' },
    { am: 'ህዳር', en: 'Hidar', sub: 'Nov' },
    { am: 'ታህሳስ', en: 'Tahsas', sub: 'Dec' },
    { am: 'ጥር', en: 'Tir', sub: 'Jan' },
    { am: 'የካቲት', en: 'Yekatit', sub: 'Feb' },
    { am: 'መጋቢት', en: 'Megabit', sub: 'Mar' },
    { am: 'ሚያዚያ', en: 'Miazia', sub: 'Apr' },
    { am: 'ግንቦት', en: 'May', sub: 'May' },
    { am: 'ሰኔ', en: 'Jun', sub: 'Jun' },
    { am: 'ሐምሌ', en: 'Hamle', sub: 'Jul' },
    { am: 'ነሐሴ', en: 'Nehase', sub: 'Aug' },
  ];

  const generateInitialStatus = () => {
    let arr = [];
    for (let i = 0; i < 62; i++) {
      arr.push(''); 
    }
    return arr;
  };

  const defaultMonthlyData = {
    Meskerem: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Tikimt: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Hidar: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Tahsas: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Tir: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Yekatit: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Megabit: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Miazia: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    May: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Jun: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Jul: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ],
    Nehase: [
      { id: 'STF-001', name: 'Abebe K.', status: generateInitialStatus() },
      { id: 'STF-002', name: 'Chaltu T.', status: generateInitialStatus() },
      { id: 'STF-003', name: 'Meron H.', status: generateInitialStatus() },
      { id: 'STF-004', name: 'Dawit B.', status: generateInitialStatus() },
      { id: 'STF-005', name: 'Alemayehu T.', status: generateInitialStatus() },
    ]
  };

  const [monthlyData, setMonthlyData] = useState(() => {
    const savedData = localStorage.getItem('gidan_wereda_attendance');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Error parsing saved attendance data", e);
      }
    }
    return defaultMonthlyData;
  });

  const currentAttendanceData = monthlyData[selectedMonth] || [];

  const handleStatusChange = (staffId, index) => {
    setIsSaved(false); 
    setMonthlyData(prevMonthly => {
      const updatedMonthStaffs = prevMonthly[selectedMonth].map(staff => {
        if (staff.id === staffId) {
          const newStatus = [...staff.status];
          const current = newStatus[index];
          
          if (current === '' || current === undefined) {
            newStatus[index] = 'P'; 
          } else if (current === 'P') {
            newStatus[index] = 'A'; 
          } else if (current === 'A') {
            newStatus[index] = 'L'; 
          } else {
            newStatus[index] = '';  
          }
          
          const updatedStats = calculateStats(newStatus);
          if (updatedStats.aDays >= 5) {
            console.warn(`Warning for ${staff.name} in ${selectedMonth}: 5 ቀናት እና ከዚያ በላይ ቀረ`);
          }

          return { ...staff, status: newStatus };
        }
        return staff;
      });

      return {
        ...prevMonthly,
        [selectedMonth]: updatedMonthStaffs
      };
    });
  };

  const calculateStats = (statusArr) => {
    let pCount = 0;
    let aCount = 0;
    let lCount = 0;
    statusArr.forEach(val => {
      if (val === 'P') pCount++;
      if (val === 'A') aCount++;
      if (val === 'L') lCount++;
    });
    let aDays = (aCount / 2).toFixed(1);
    return { pCount, aCount, lCount, aDays };
  };

  const handleSave = () => {
    localStorage.setItem('gidan_wereda_attendance', JSON.stringify(monthlyData));
    setIsSaved(true);
    alert(`የ ${selectedMonth} ወር የሰራተኞች attendance በሎካል ሜሞሪ ተቀምጧል! 💾`);
  };

  const handleSendWeeklyReport = async () => {
    setShowReportMenu(false);
    let requiredFilledCount = 14; 
    let sampleStaff = currentAttendanceData[0];
    let filledCount = sampleStaff ? sampleStaff.status.slice(0, 14).filter(val => val !== '' && val !== undefined).length : 0;

    if (filledCount < requiredFilledCount) {
      alert(`❌ ሳምንታዊ ሪፖርት መላክ አይቻልም! የመጀመሪያዎቹ 7 ቀናት (14ቱ ክፍሎች) ሙሉ በሙሉ አልሞሉም።`);
      return; 
    }

    const confirmSend = window.confirm(`እርግጠኛ ኖት? የ ${selectedMonth} ወር ሳምንታዊ ሪፖርት ለሱፐርቫይዘር ልኮ ማስገባት ይፈልጋሉ?`);
    if (!confirmSend) return;

    try {
      const response = await axios.post('http://localhost:5000/api/focal/send-official-report', {
        focal_name: 'comm_focal',
        report_title: 'Weekly Report',
        report_month: selectedMonth,
        report_content: `የተጠቃለለ የ ${selectedMonth} ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።`
      });

      if (response.status === 200 || response.status === 201) {
        alert(`የ ${selectedMonth} ወር ሳምንታዊ ሪፖርት ለሱፐርቫይዘር ዳሽቦርድ በተሳካ ሁኔታ ተልኳል! ✅`);
      }
    } catch (err) {
      console.error(err);
      alert('የሰርቨር ግንኙነት ስህተት አጋጥሟል። (Backend server offline)');
    }
  };

  const handleSendMonthlyReport = async () => {
    setShowReportMenu(false);
    let requiredFilledCount = 62; 
    let sampleStaff = currentAttendanceData[0];
    let filledCount = sampleStaff ? sampleStaff.status.filter(val => val !== '' && val !== undefined).length : 0;

    if (filledCount < requiredFilledCount) {
      alert(`❌ ወርሃዊ ሪፖርት መላክ አይቻልም! የ ${selectedMonth} ወር attendance ሙሉ በሙሉ (31 ቀን/62ቱ ክፍሎች) አልሞላም።`);
      return; 
    }

    const confirmSend = window.confirm(`እርግጠኛ ኖት? የ ${selectedMonth} ወር ሙሉ ሪፖርት ለሱፐርቫይዘር ልኮ ማስገባት ይፈልጋሉ?`);
    if (!confirmSend) return;

    try {
      const response = await axios.post('http://localhost:5000/api/focal/send-official-report', {
        focal_name: 'comm_focal',
        report_title: 'Monthly Report',
        report_month: selectedMonth,
        report_content: `የተጠቃለለ የ ${selectedMonth} ወር ሙሉ ሪፖርት (Monthly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።`
      });

      if (response.status === 200 || response.status === 201) {
        alert(`የ ${selectedMonth} ወር ሙሉ ሪፖርት ለሱፐርቫይዘር ዳሽቦርድ በተሳካ ሁኔታ ተልኳል! ✅`);
      }
    } catch (err) {
      console.error(err);
      alert('የሰርቨር ግንኙነት ስህተት አጋጥሟል። (Backend server offline)');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/focal/chat', {
        sender: 'You (Focal)',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (response.status === 200 || response.status === 201) {
        setNewMessage('');
        setMessageStatus('መልእክቱ ተልኳል! ✅');
        fetchMessages();
        setTimeout(() => setMessageStatus(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessageStatus('መልዕክቱን መላክ አልተቻለም። ❌');
    }
  };

  const getStatusColor = (val) => {
    if (val === 'P') return '#10B981'; 
    if (val === 'A') return '#EF4444'; 
    if (val === 'L') return '#F59E0B'; 
    return '#F8FAFC'; 
  };

  const absenteeStaffs = currentAttendanceData.filter(staff => calculateStats(staff.status).aDays >= 5);

  return (
    <div style={{ background: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ maxWidth: '1500px', margin: '0 auto', background: '#F8FAFC', borderRadius: '16px', border: '2px solid #CBD5E1', padding: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
        
        {/* Header & Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px', marginBottom: '20px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: '#475569', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            ← ተመለስ (Back)
          </button>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '20px', fontWeight: '800' }}>
              GIDAN WEREDA ADMINISTRATION OFFICE - ATTENDANCE DASHBOARD
            </h2>
            <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>Comm_Focal Daily Management System</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={handleSave}
              style={{ 
                background: isSaved ? '#059669' : '#2563EB', 
                color: '#fff', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {isSaved ? '✓ Saved' : '💾 Save Attendance'}
            </button>

            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setShowReportMenu(!showReportMenu)}
                style={{ 
                  background: '#7C3AED', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '10px 15px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                📤 Send Report to Supervisor ▼
              </button>

              {showReportMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '42px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                  zIndex: 100,
                  width: '220px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={handleSendWeeklyReport}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #F1F5F9',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#1E293B',
                      cursor: 'pointer'
                    }}
                  >
                    📅 Send Weekly Report (ሳምንታዊ)
                  </button>

                  <button
                    onClick={handleSendMonthlyReport}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #F1F5F9',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#1E293B',
                      cursor: 'pointer'
                    }}
                  >
                    📊 Send Monthly Report (ወርሃዊ)
                  </button>

                  <button
                    onClick={() => { setShowReportMenu(false); setShowChatModal(true); }}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      background: '#F8FAFC',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#7C3AED',
                      cursor: 'pointer'
                    }}
                  >
                    💬 Send Message (መልእክት ላክ)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comm_Focal Alert Banner */}
        {absenteeStaffs.length > 0 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🚨</span>
              <div>
                <h4 style={{ margin: '0 0 2px', color: '#991B1B', fontSize: '13px' }}>Comm_Focal Alert ({selectedMonth}): 5 ቀናት እና ከዚያ በላይ የቀሩ ሰራተኞች ተለይተዋል!</h4>
                <p style={{ margin: 0, color: '#B91C1C', fontSize: '11px' }}>
                  {absenteeStaffs.map(s => `${s.name} (${calculateStats(s.status).aDays} ቀናት ቀረ)`).join(', ')} - እባክዎ እርምጃ ይውሰዱ።
                </p>
              </div>
            </div>
            <span style={{ background: '#EF4444', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>Action Required</span>
          </div>
        )}

        {/* Month Selector & Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', marginBottom: '25px' }}>
          
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '15px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '10px' }}>Month Selector (ወር ይምረጡ)</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {months.map((m) => {
                const isSelected = selectedMonth === m.en;
                return (
                  <button
                    key={m.en}
                    onClick={() => { setSelectedMonth(m.en); setIsSaved(false); }}
                    style={{
                      padding: '8px 5px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: isSelected ? '#10B981' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#1E293B',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{m.am}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{m.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Status Legend & Rule</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563EB' }}>{selectedMonth} 2026</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '5px 0' }}>
              <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#10B981', fontWeight: 'bold' }}>P</span> = Present (ገብቷል)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#EF4444', fontWeight: 'bold' }}>A</span> = Absent (ቀረ)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#F59E0B', fontWeight: 'bold' }}>L</span> = Late (ዘገየ)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Matrix Grid */}
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
              Monthly Attendance Matrix Grid — <span style={{ color: '#2563EB' }}>{selectedMonth} 2026</span> 
            </span>
            <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 'bold' }}>
              ⚠️ ማሳሰቢያ፡ ሳምንታዊ ወይም ወርሃዊ ሪፖርት ለመላክ የሚመለከተው የቀናት መጠን መሞላት አለበት።
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#CBD5E1', color: '#1E293B' }}>
                  <th rowSpan="2" style={{ padding: '8px', border: '1px solid #94A3B8', width: '80px', textAlign: 'left' }}>Staff ID</th>
                  <th rowSpan="2" style={{ padding: '8px', border: '1px solid #94A3B8', width: '120px', textAlign: 'left' }}>Name (ስም)</th>
                  {Array.from({ length: 31 }, (_, i) => (
                    <th key={i + 1} colSpan="2" style={{ padding: '4px', border: '1px solid #94A3B8', fontWeight: 'bold' }}>
                      {i + 1}
                    </th>
                  ))}
                  <th rowSpan="2" style={{ padding: '6px', border: '1px solid #94A3B8', width: '120px', background: '#E2E8F0', fontSize: '10px' }}>Total Days (P / A / L)</th>
                </tr>
                <tr style={{ background: '#E2E8F0', color: '#334155' }}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <React.Fragment key={i}>
                      <th style={{ padding: '3px 1px', border: '1px solid #CBD5E1', width: '18px', fontSize: '9px' }} title="ጧት">ጥ</th>
                      <th style={{ padding: '3px 1px', border: '1px solid #CBD5E1', width: '18px', fontSize: '9px' }} title="ከሰዓት">ከ</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentAttendanceData.map((row) => {
                  const stats = calculateStats(row.status);
                  const isExceeded = stats.aDays >= 5;
                  return (
                    <tr key={row.id} style={{ background: isExceeded ? '#FEF2F2' : 'transparent' }}>
                      <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1', fontWeight: 'bold', color: '#1E293B', textAlign: 'left' }}>{row.id}</td>
                      <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1', fontWeight: '600', color: isExceeded ? '#DC2626' : '#1E293B', textAlign: 'left' }}>
                        {row.name} {isExceeded && '⚠️'}
                      </td>
                      {row.status.map((val, idx) => (
                        <td 
                          key={idx} 
                          onClick={() => handleStatusChange(row.id, idx)}
                          style={{ 
                            padding: '4px 1px', 
                            border: '1px solid #CBD5E1', 
                            background: getStatusColor(val),
                            color: val ? '#FFFFFF' : '#94A3B8',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            height: '24px'
                          }}
                        >
                          {val}
                        </td>
                      ))}
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1', fontWeight: 'bold', background: isExceeded ? '#FEE2E2' : '#F8FAFC', fontSize: '10px' }}>
                        <span style={{ color: '#10B981' }}>{stats.pCount}P</span> / 
                        <span style={{ color: '#EF4444' }}>{stats.aCount}A</span> / 
                        <span style={{ color: '#F59E0B' }}>{stats.lCount}L</span>
                        {isExceeded && <div style={{ fontSize: '9px', color: '#B91C1C', fontWeight: 'bold' }}>({stats.aDays} ቀናት)</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Chat Box Modal */}
      {showChatModal && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '360px', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '1px solid #CBD5E1', zIndex: 1000, overflow: 'hidden' }}>
          <div style={{ background: '#7C3AED', color: '#FFFFFF', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px' }}>💬 Chat with Supervisor</h4>
              <span style={{ fontSize: '10px', opacity: 0.9 }}>Gidan Wereda Admin</span>
            </div>
            <button onClick={() => setShowChatModal(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>

          <div style={{ height: '260px', padding: '15px', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.sender && msg.sender.includes('You') ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ fontSize: '10px', color: '#64748B', marginBottom: '2px', textAlign: msg.sender && msg.sender.includes('You') ? 'right' : 'left' }}>{msg.sender} • {msg.time}</div>
                <div style={{ background: msg.sender && msg.sender.includes('You') ? '#7C3AED' : '#E2E8F0', color: msg.sender && msg.sender.includes('You') ? '#FFF' : '#1E293B', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '10px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {messageStatus && <span style={{ fontSize: '11px', color: 'green', fontWeight: 'bold' }}>{messageStatus}</span>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="መልእክትዎን እዚህ ይጻፉ..."
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                required
              />
              <button type="submit" style={{ background: '#7C3AED', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                ላክ
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}