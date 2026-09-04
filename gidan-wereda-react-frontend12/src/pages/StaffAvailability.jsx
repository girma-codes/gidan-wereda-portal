import React, { useState, useEffect } from 'react';
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { Phone } from "lucide-react";

export default function StaffAvailability() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // ከዳታቤዝ የሰራተኞችን መረጃ ማምጣት (API Call)
  useEffect(() => {
    fetch('http://localhost:5000/api/staff')
      .then(res => res.json())
      .then(data => {
        setStaff(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching staff:', err);
        setLoading(false);
      });
  }, []);

  // 14ቱን የወረዳ መምሪያዎች ከነ አዶዎቻቸው
  const departments = [
    { id: 1, name: 'finance', label: 'ፋይናንስ (Finance)', icon: '💰' },
    { id: 2, name: 'sport', label: 'ስፖርት (Sport)', icon: '⚽' },
    { id: 3, name: 'wetat ena sport', label: 'ወጣት እና ስፖርት (Wetat ena Sport)', icon: '🏃‍♂️' },
    { id: 4, name: 'ngid', label: 'ንግድ (Ngid)', icon: '🛒' },
    { id: 5, name: 'gebiwoch', label: 'ገቢዎች (Gebiwoch)', icon: '📑' },
    { id: 6, name: 'tikakn', label: 'ዕቅድ (Tikakn)', icon: '📊' },
    { id: 7, name: 'sra ena sltena', label: 'ሥራ እና ስልጠና (Sra ena Sltena)', icon: '🛠️' },
    { id: 8, name: 'setoch ena htsanat', label: 'ሴቶች እና ህፃናት (Setoch ena Htsanat)', icon: '👩‍👧‍👦' },
    { id: 9, name: 'communication', label: 'ኮሙኒኬሽን (Communication)', icon: '📡' },
    { id: 10, name: 'tsetta', label: 'ሰላም እና ፀጥታ (Tsetta)', icon: '🛡️' },
    { id: 11, name: 'mikrbet', label: 'ምክር ቤት (Mikrbet)', icon: '🏛️' },
    { id: 12, name: 'afe gubae', label: 'አፈ ጉባኤ (Afe Gubae)', icon: '📜' },
    { id: 13, name: 'tena', label: 'ጤና (Tena)', icon: '🏥' },
    { id: 14, name: 'timhrt', label: 'ትምህርት (Timhrt)', icon: '📚' }
  ];

  // በ Search Bar የተጻፈውን ቃል ከሰራተኞች ዝርዝር ወይም ከመምሪያዎች ጋር ማጣራት
  const filteredDepartments = departments.filter(dept =>
    dept.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.some(s => s.department && s.department.toLowerCase().includes(dept.name.toLowerCase()) && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // የተመረጠው መምሪያ ሰራተኞች
  const departmentStaff = selectedDept 
    ? staff.filter(s => s.department && s.department.toLowerCase().includes(selectedDept.toLowerCase()))
    : [];

  return (
    <>
      <PageHero 
        eyebrow="STAFF AVAILABILITY" 
        title="የወረዳው መምሪያዎች እና ሰራተኞች ሁኔታ" 
        text="ተጠቃሚዎች ብዙ პროሰስ ሳይጨናነቁ የሚፈልጉትን መስሪያ ቤት በካርድ በመምረጥ በስራ ላይ ያሉ ሰራተኞችን በቀላሉ ማግኘት ይችላሉ።"
      />
      
      <section className="section">
        <div className="container">
          
          <div className="availability-note" style={{ marginBottom: '30px' }}>
            <b>Availability board</b>
            <span>Updated from administrative attendance records.</span>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="🔍 መምሪያዎችን ወይም ሰራተኞችን በስም ይፈልጉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--navy)',
                fontSize: '15px',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(16,42,67,0.04)'
              }}
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>መረጃዎች በመጫን ላይ ናቸው...</div>
          ) : (
            <>
              {/* ካልተመረጠ 14ቱን መምሪያዎች በካርድ ማሳየት */}
              {!selectedDept ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {filteredDepartments.map((dept) => (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDept(dept.name)}
                      style={{
                        background: 'var(--paper)',
                        border: '1px solid var(--line)',
                        borderRadius: '16px',
                        padding: '25px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 30px rgba(16,42,67,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'var(--blue)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--line)';
                      }}
                    >
                      <div style={{ fontSize: '30px', background: 'var(--soft)', width: 'fit-content', padding: '10px', borderRadius: '10px' }}>
                        {dept.icon}
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700' }}>መምሪያ #{dept.id}</span>
                        <h3 style={{ fontSize: '17px', color: 'var(--navy)', margin: '4px 0 0' }}>{dept.label}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ካርዱን ሲነኩ የዚያ መምሪያ ሰራተኞች ዝርዝር የሚወጣበት */
                <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(16,42,67,0.04)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid var(--line)', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '22px', color: 'var(--navy)', margin: 0 }}>
                      📂 የተመረጠው መምሪያ ሰራተኞች
                    </h2>
                    <button
                      onClick={() => setSelectedDept(null)}
                      style={{
                        background: 'var(--soft)',
                        border: '1px solid var(--line)',
                        color: 'var(--navy)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      ⬅️ ወደ መምሪያዎች ዝርዝር ተመለስ
                    </button>
                  </div>

                  <div className="staff-table" style={{ display: 'grid', gap: '15px' }}>
                    {departmentStaff.length > 0 ? (
                      departmentStaff.map((s) => (
                        <div className="staff-row" key={s.id || s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--soft)', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--line)', flexWrap: 'wrap', gap: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="staff-avatar" style={{ background: 'var(--blue)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {s.name ? s.name.split(" ").map(x => x[0]).join("") : "ስ"}
                            </div>
                            <div>
                              <b style={{ color: 'var(--navy)', fontSize: '16px' }}>{s.name}</b>
                              <small style={{ display: 'block', color: 'var(--muted)' }}>{s.position} • {s.department}</small>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <StatusBadge status={s.status} />
                            <a href={`tel:${s.phone}`} className="phone-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'var(--blue)', fontWeight: '650' }}>
                              <Phone size={16}/>{s.phone}
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                        በዚህ መምሪያ ስር እስካሁን የተመዘገበ ሰራተኛ የለም።
                      </div>
                    )}
                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
}