import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupervisorReportsDashboard() {
  const navigate = useNavigate();
  const [selectedFocal, setSelectedFocal] = useState('comm_focal');
  const [reportType, setReportType] = useState('weekly');
  
  const [reportsData, setReportsData] = useState({
    comm_focal: { name: 'Communication Pool Focal (Comm Focal)', weekly: '', monthly: '', yearly: '', attendance_data: null, isSent: false },
    civil_focal: { name: 'Civil Service Pool Focal (Civil Focal)', weekly: '', monthly: '', yearly: '', attendance_data: null, isSent: false },
    admin_focal: { name: 'Administration Pool Focal (Admin Focal)', weekly: '', monthly: '', yearly: '', attendance_data: null, isSent: false }
  });

  const [attendanceGrid, setAttendanceGrid] = useState({ staffList: [], daysCount: 31, records: {} });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // 💡 የቻት መልእክቶችን ለእያንዳንዱ ፎካል በተናጠል ለመያዝ (Object  መጠቀም)
  const [chatMessagesMap, setChatMessagesMap] = useState({
    comm_focal: [],
    civil_focal: [],
    admin_focal: []
  });

  const getFocalDbName = (focalKey) => {
    if (focalKey === 'comm_focal') return 'Communication Pool Focal (Comm Focal)';
    if (focalKey === 'civil_focal') return 'Civil Service Pool Focal (Civil Focal)';
    if (focalKey === 'admin_focal') return 'Administration Pool Focal (Admin Focal)';
    return 'Communication Pool Focal (Comm Focal)';
  };

  const getPoolNameKey = (focalKey) => {
    if (focalKey === 'comm_focal') return 'Communication Pool';
    if (focalKey === 'civil_focal') return 'Civil Service Pool';
    if (focalKey === 'admin_focal') return 'Administration Pool';
    return 'Communication Pool';
  };

  // 1. የተመረጠውን ፎካል ሪፖርቶች እና አቴንዳንስ ብቻ ከሰርቨር ማምጣት
  useEffect(() => {
    const poolName = getPoolNameKey(selectedFocal);
    const focalDbName = getFocalDbName(selectedFocal);

    setLoading(true);

    fetch(`http://localhost:5000/api/admin/supervisor-reports?pool=${encodeURIComponent(poolName)}`)
      .then((res) => res.json())
      .then((data) => {
        setReportsData(prev => {
          const updated = { ...prev };
          const currentFocalData = {
            name: focalDbName,
            weekly: '',
            monthly: '',
            yearly: '',
            attendance_data: null,
            isSent: false
          };

          const reportsList = Array.isArray(data) ? data : [data];
          
          reportsList.forEach(rep => {
            if (rep) {
              const type = (rep.report_type || 'weekly').toLowerCase();
              if (type.includes('week') || type === 'weekly') {
                currentFocalData.weekly = rep.report_content || rep.report_text || '';
              } else if (type.includes('month') || type === 'monthly') {
                currentFocalData.monthly = rep.report_content || rep.report_text || '';
              } else if (type.includes('year') || type === 'yearly') {
                currentFocalData.yearly = rep.report_content || rep.report_text || '';
              }
              
              if (rep.attendance_data) {
                currentFocalData.attendance_data = rep.attendance_data;
              }
              currentFocalData.isSent = true;
            }
          });

          updated[selectedFocal] = currentFocalData;
          return updated;
        });
      })
      .catch((err) => console.error("Error fetching reports:", err));

    fetch(`http://localhost:5000/api/pool/attendance/${encodeURIComponent(poolName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const staffMap = {};
          const staffListObj = [];

          data.forEach(item => {
            if (!staffMap[item.staff_id]) {
              staffMap[item.staff_id] = {
                staff_id: item.staff_id,
                staff_name: item.staff_name
              };
              staffListObj.push(staffMap[item.staff_id]);
            }
          });

          const records = {};
          data.forEach(item => {
            if (!records[item.staff_id]) records[item.staff_id] = {};
            const dayNum = new Date(item.attendance_date).getDate();
            records[item.staff_id][dayNum] = {
              m: item.status === 'Present' ? 'P' : item.status === 'Absent' ? 'A' : 'L',
              a: item.status === 'Present' ? 'P' : item.status === 'Absent' ? 'A' : 'L'
            };
          });

          setAttendanceGrid({
            staffList: staffListObj,
            daysCount: 31,
            records: records
          });
        } else {
          setAttendanceGrid({ staffList: [], daysCount: 31, records: {} });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance matrix:", err);
        setLoading(false);
      });

  }, [selectedFocal]);

  // 2. የቻት መልእክቶችን በየ 3 ሰከንዱ ለተመረጠው ፎካል ብቻ መከታተል
  useEffect(() => {
    const focalDbName = getFocalDbName(selectedFocal);

    const fetchChatMessages = () => {
      fetch(`http://localhost:5000/api/chat/${encodeURIComponent(focalDbName)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const formattedChats = data.map(msg => ({
              sender: msg.sender_type, 
              text: msg.message,
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            // 💡 የተወሰደውን መልእክት ለዛው ለተመረጠው ፎካል ብቻ በቁልፉ (Key) ማስቀመጥ
            setChatMessagesMap(prev => ({
              ...prev,
              [selectedFocal]: formattedChats
            }));
          }
        })
        .catch((err) => console.error("Error fetching chats:", err));
    };

    fetchChatMessages();
    const interval = setInterval(fetchChatMessages, 3000);

    return () => clearInterval(interval);
  }, [selectedFocal]);

  const handleDownloadGridPDF = () => {
    window.print();
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    const focalDbName = getFocalDbName(selectedFocal);

    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focal_name: focalDbName,
          sender_type: 'supervisor',
          message: feedback
        })
      });

      if (response.ok) {
        setMessage('አስተያየትዎ/ምላሽዎ ለፎካሉ በተሳካ ሁኔታ ተልኳል! ✅');
        
        // ወዲያውኑ ቻቱን ለማሳየት በአካባቢያዊ ስቴት (Local State) መጨመር
        const newMsg = {
          sender: 'supervisor',
          text: feedback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatMessagesMap(prev => ({
          ...prev,
          [selectedFocal]: [...(prev[selectedFocal] || []), newMsg]
        }));

        setFeedback('');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage('መላክ አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።');
      }
    } catch (err) {
      setMessage('የሰርቨር ስህተት አጋጥሟል።');
    }
  };

  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  let focalMatrixData = null;
  try {
    const rawData = reportsData[selectedFocal]?.attendance_data;
    if (rawData) {
      focalMatrixData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    }
  } catch (e) {
    console.error("Error parsing focal attendance JSON:", e);
  }

  // የአሁን የተመረጠው ፎካል ቻት መልእክቶች
  const currentChatMessages = chatMessagesMap[selectedFocal] || [];

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }
            .printable-attendance-grid, .printable-attendance-grid * {
              visibility: visible !important;
            }
            .printable-attendance-grid {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              background: #FFFFFF !important;
            }
            .no-print-btn {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={{ maxWidth: '1300px', margin: '0 auto', background: '#FFFFFF', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        {/* Header */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px', marginBottom: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: '#475569', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← ተመለስ
          </button>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '20px' }}>Supervisor Report Control Panel</h2>
            <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '13px' }}>Gidan Wereda Administration Office</p>
          </div>
        </div>

        {/* Focal Tabs */}
        <div className="no-print" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          {[
            { key: 'comm_focal', label: 'Comm Focal 📡' },
            { key: 'civil_focal', label: 'Civil Focal 👨‍💼' },
            { key: 'admin_focal', label: 'Admin Focal 🏛️' }
          ].map((focal) => (
            <button
              key={focal.key}
              onClick={() => setSelectedFocal(focal.key)}
              style={{
                flex: 1, padding: '12px', borderRadius: '8px',
                border: selectedFocal === focal.key ? '2px solid #2563EB' : '1px solid #CBD5E1',
                background: selectedFocal === focal.key ? '#EFF6FF' : '#F8FAFC',
                color: selectedFocal === focal.key ? '#1D4ED8' : '#334155',
                fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
              }}
            >
              {focal.label}
            </button>
          ))}
        </div>

        {/* Report Type Selector */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '14px' }}>
            አሁን የሚታየው፦ <span style={{ color: '#2563EB' }}>{reportsData[selectedFocal]?.name}</span>
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { key: 'weekly', label: 'ሳምንታዊ ሪፖርት' },
              { key: 'monthly', label: 'ወርሃዊ ሪፖርት' },
              { key: 'yearly', label: 'ዓመታዊ ሪፖርት' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setReportType(type.key)}
                style={{
                  padding: '8px 14px', borderRadius: '6px', border: 'none',
                  background: reportType === type.key ? '#2563EB' : '#E2E8F0',
                  color: reportType === type.key ? '#FFFFFF' : '#475569',
                  fontWeight: 'bold', cursor: 'pointer', fontSize: '12px'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Summary */}
        <div className="no-print" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0F172A', textTransform: 'capitalize' }}>
            {selectedFocal.replace('_', ' ')} - {reportType} Report Summary:
          </h4>
          <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', background: '#F8FAFC', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #2563EB' }}>
            {reportsData[selectedFocal]?.[reportType] || "እዚህ ፎካል የተላከ የጽሑፍ ሪፖርት የለም።"}
          </p>
        </div>

        {/* Monthly Attendance Matrix Grid Table */}
        <div className="printable-attendance-grid" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#0F172A' }}>
              📊 Monthly Attendance Matrix Grid — ({reportsData[selectedFocal]?.name}):
            </h4>
            <button 
              onClick={handleDownloadGridPDF}
              className="no-print-btn"
              style={{ 
                background: '#0D9488', color: '#fff', border: 'none', 
                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', 
                fontWeight: 'bold', fontSize: '11px' 
              }}
            >
              📥 Download Grid PDF
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#64748B' }}>መረጃዎች በመጫን ላይ...</p>
          ) : focalMatrixData && Array.isArray(focalMatrixData) && focalMatrixData.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#CBD5E1', color: '#1E293B' }}>
                    <th rowSpan="2" style={{ padding: '8px', border: '1px solid #94A3B8', width: '80px', textAlign: 'left' }}>Staff ID</th>
                    <th rowSpan="2" style={{ padding: '8px', border: '1px solid #94A3B8', width: '120px', textAlign: 'left' }}>Name (ስም)</th>
                    {daysArray.map((day) => (
                      <th key={day} style={{ padding: '4px', border: '1px solid #94A3B8', fontWeight: 'bold' }}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {focalMatrixData.map((row) => (
                    <tr key={row.id || row.staff_id}>
                      <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1', fontWeight: 'bold', color: '#1E293B', textAlign: 'left' }}>{row.id || row.staff_id}</td>
                      <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1', fontWeight: '600', color: '#1E293B', textAlign: 'left' }}>{row.name || row.staff_name}</td>
                      {daysArray.map((day) => {
                        let val = 'P';
                        if (Array.isArray(row.status)) {
                          val = row.status[day - 1] || 'P';
                        } else if (row.status && typeof row.status === 'object') {
                          val = row.status[day]?.m || row.status[day] || 'P';
                        }

                        let bg = '#F8FAFC';
                        let color = '#94A3B8';
                        if (val === 'P') { bg = '#10B981'; color = '#FFFFFF'; }
                        else if (val === 'A') { bg = '#EF4444'; color = '#FFFFFF'; }
                        else if (val === 'L') { bg = '#F59E0B'; color = '#FFFFFF'; }

                        return (
                          <td 
                            key={day} 
                            style={{ 
                              padding: '4px 1px', 
                              border: '1px solid #CBD5E1', 
                              background: bg,
                              color: color,
                              fontWeight: 'bold',
                              fontSize: '10px',
                              height: '24px'
                            }}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : attendanceGrid.staffList.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '13px' }}>ለዚህ ፑል የተመዘገበ የአቴንዳንስ መረጃ የለም።</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: '#E2E8F0', color: '#1E293B' }}>
                    <th style={{ padding: '10px', border: '1px solid #CBD5E1', textAlign: 'left' }}>Staff ID</th>
                    <th style={{ padding: '10px', border: '1px solid #CBD5E1', textAlign: 'left' }}>Name (ስም)</th>
                    {daysArray.map((day) => (
                      <th key={day} style={{ padding: '6px', border: '1px solid #CBD5E1', minWidth: '35px' }}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceGrid.staffList.map((staff, idx) => {
                    const staffRecs = attendanceGrid.records?.[staff.staff_id] || {};
                    return (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF' }}>
                        <td style={{ padding: '8px', border: '1px solid #CBD5E1', textAlign: 'left', fontWeight: 'bold' }}>{staff.staff_id}</td>
                        <td style={{ padding: '8px', border: '1px solid #CBD5E1', textAlign: 'left', fontWeight: 'bold' }}>{staff.staff_name}</td>
                        {daysArray.map((day) => {
                          const dayStat = staffRecs[day] || { m: 'P' };
                          const val = dayStat.m || 'P';
                          let bg = '#64748B';
                          if (val === 'P') bg = '#16A34A';
                          else if (val === 'A') bg = '#DC2626';
                          else if (val === 'L') bg = '#D97706';

                          return (
                            <td key={day} style={{ padding: '4px 2px', border: '1px solid #CBD5E1' }}>
                              <span style={{
                                display: 'inline-block', width: '22px', height: '22px', lineHeight: '22px',
                                borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', color: '#FFF',
                                background: bg
                              }}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Chat / Feedback UI Box */}
        <div className="no-print" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '15px' }}>
            <span style={{ fontSize: '18px' }}>💬</span>
            <h4 style={{ margin: 0, color: '#0F172A', fontSize: '15px' }}>Chat with Focal ({reportsData[selectedFocal]?.name})</h4>
          </div>

          {message && <p style={{ color: '#16A34A', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>{message}</p>}

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '15px', height: '200px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentChatMessages.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '13px', textAlign: 'center', margin: 'auto' }}>ምንም የቻት መልእክት የለም። ውይይት ይጀምሩ!</p>
            ) : (
              currentChatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  style={{ 
                    alignSelf: msg.sender === 'supervisor' ? 'flex-end' : 'flex-start', 
                    background: msg.sender === 'supervisor' ? '#2563EB' : '#E2E8F0', 
                    color: msg.sender === 'supervisor' ? '#FFFFFF' : '#1E293B', 
                    padding: '10px 14px', 
                    borderRadius: '12px', 
                    maxWidth: '75%', 
                    fontSize: '13px' 
                  }}
                >
                  <div style={{ fontSize: '10px', color: msg.sender === 'supervisor' ? '#DBEAFE' : '#64748B', marginBottom: '3px' }}>
                    {msg.sender === 'supervisor' ? 'You (Supervisor)' : 'Focal'} • {msg.time}
                  </div>
                  {msg.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendFeedback} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="መልእክትዎን ወይም አስተያየትዎን እዚህ ይጻፉ..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
              required
            />
            <button 
              type="submit" 
              style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              ላክ 📤
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}