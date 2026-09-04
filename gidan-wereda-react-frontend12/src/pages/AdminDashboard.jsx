import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // የዜና ፎርም ስቴቶች (ለአድሚን)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [newsMessage, setNewsMessage] = useState('');

  // ለእያንዳንዱ ማመልከቻ እና ኮንታክት የቻት ኢንፑት መቆጣጠሪያ
  const [chatInputs, setChatInputs] = useState({});
  const [contactChatInputs, setContactChatInputs] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  // መረጃዎችን ከሰርቨር ማምጣት (Applications, Contacts, News)
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/admin/applications').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      }),
      fetch('http://localhost:5000/api/admin/contacts').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contacts');
        return res.json();
      }),
      fetch('http://localhost:5000/api/news').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
    ])
      .then(([appsData, contactsData, newsData]) => {
        setApplications(Array.isArray(appsData) ? appsData : []);
        setContacts(Array.isArray(contactsData) ? contactsData : []);
        setNewsList(Array.isArray(newsData) ? newsData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('መረጃዎችን ማምጣት አልተቻለም። እባክዎ ሰርቨሩ (Backend) መብራቱን ያረጋግጡ።');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ዜና መለጠፍ ወይም ማስተካከል
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const url = editId 
      ? `http://localhost:5000/api/ict/news/${editId}` 
      : 'http://localhost:5000/api/ict/news';
    
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        content, 
        author: 'ዋና አስተዳዳሪ (Admin)', 
        ict_key: 'gidan_ict_key_2026'
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('ስህተት ተፈጥሯል!');
      return res.json();
    })
    .then(data => {
      setNewsMessage(data.message || 'በተሳካ ሁኔታ ተፈጽሟል!');
      setTitle('');
      setContent('');
      setEditId(null);
      fetchData();
    })
    .catch(err => setNewsMessage(err.message));
  };

  // ዜና መሰረዝ
  const handleDeleteNews = (id) => {
    if (!window.confirm('ይህንን ዜና መሰረዝ ትፈልጋለህ?')) return;

    fetch(`http://localhost:5000/api/ict/news/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ict_key: 'gidan_ict_key_2026' })
    })
    .then(res => res.json())
    .then(data => {
      setNewsMessage(data.message || 'ዜናው ተሰርዟል!');
      fetchData();
    })
    .catch(err => alert('መሰረዝ አልተቻለም'));
  };

  // ማመልከቻን Status (Accept / Reject) ማስተካከያ
  const handleUpdateApplication = async (id, status) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('ማመልከቻው በተሳካ ሁኔታ ተዘምኗል!');
        fetchData(); 
      } else {
        alert(data.error || 'ማሻሻል አልተቻለም።');
      }
    } catch (err) {
      console.error(err);
      alert('ሰርቨር ጋር መገናኘት አልተቻለም።');
    } finally {
      setActionLoading(null);
    }
  };

  // ለአመልካች (Application) ቻት ላይ መልእክት መላኪያ
  const handleSendAdminChat = async (id) => {
    const text = chatInputs[id];
    if (!text || text.trim() === '') {
      alert('እባክዎ የመልእክት ጽሁፍ ይጻፉ!');
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'admin', text }),
      });

      if (response.ok) {
        setChatInputs({ ...chatInputs, [id]: '' });
        fetchData(); 
      } else {
        alert('መልእክት መላክ አልተቻለም');
      }
    } catch (err) {
      console.error(err);
      alert('ሰርቨር ስህተት አጋጥሟል');
    } finally {
      setActionLoading(null);
    }
  };

  // ለኮንታክት መልእክት (Contact Message) ምላሽ ለመላክ
  const handleSendContactReply = async (id) => {
    const text = contactChatInputs[id];
    if (!text || text.trim() === '') {
      alert('እባክዎ የመልእክት ጽሁፍ ይጻፉ!');
      return;
    }

    setActionLoading(`contact-${id}`);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/contacts/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setContactChatInputs({ ...contactChatInputs, [id]: '' });
        alert('መልእክቱ በተሳካ ሁኔታ ተልኳል!');
        fetchData(); 
      } else {
        alert('መልእክት መላክ አልተቻለም');
      }
    } catch (err) {
      console.error(err);
      alert('ሰርቨር ስህተት አጋጥሟል');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ background: 'var(--soft)', minHeight: '100vh', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Section */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '30px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '1.8px', fontWeight: '800', color: 'var(--blue)' }}>SYSTEM ADMINISTRATION</span>
            <h1 style={{ fontSize: '28px', margin: '8px 0 5px', color: 'var(--navy)' }}>የጊዳን ወረዳ አድሚን ዳሽቦርድ (ቻት ሲስተም)</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>ማመልከቻዎችን ማጽደቅ እና ከተጠቃሚዎች ጋር በቀጥታ መወያየት</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--sky)', padding: '12px 20px', borderRadius: '10px', fontWeight: '750', color: 'var(--blue)', fontSize: '13px' }}>
              ማመልከቻዎች: <span style={{ fontSize: '16px', fontWeight: '900' }}>{applications.length}</span>
            </div>
            <div style={{ background: '#E3FCEF', padding: '12px 20px', borderRadius: '10px', fontWeight: '750', color: '#10B981', fontSize: '13px' }}>
              መልእክቶች: <span style={{ fontSize: '16px', fontWeight: '900' }}>{contacts.length}</span>
            </div>
            <div style={{ background: '#FEF3C7', padding: '12px 20px', borderRadius: '10px', fontWeight: '750', color: '#D97706', fontSize: '13px' }}>
              ዜናዎች: <span style={{ fontSize: '16px', fontWeight: '900' }}>{newsList.length}</span>
            </div>
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontSize: '16px' }}>
            መረጃዎች በመጫን ላይ ናቸው፣ እባክዎ ይጠብቁ...
          </div>
        )}

        {error && (
          <div style={{ background: '#FDECEC', border: '1px solid #EF4444', color: '#EF4444', padding: '20px', borderRadius: '12px', marginBottom: '30px', fontWeight: '650' }}>
            {error}
          </div>
        )}

        {/* Content Sections */}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: '40px' }}>
            
            {/* 1. News Management Section */}
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(16,42,67,0.04)' }}>
              <h2 style={{ fontSize: '20px', margin: '0 0 15px', color: 'var(--navy)' }}>
                {editId ? '✏️ ዜና ማስተካከያ (Edit News)' : '➕ አዲስ ዜና መለጠፊያ (Post News)'}
              </h2>
              
              {newsMessage && (
                <div style={{ background: 'var(--sky)', color: 'var(--blue)', padding: '12px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', fontWeight: '700' }}>
                  {newsMessage}
                </div>
              )}

              <form onSubmit={handleNewsSubmit} style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                <input 
                  type="text" 
                  placeholder="የዜና ርዕስ (Title)" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px', background: 'var(--soft)', color: 'var(--navy)' }}
                />
                <textarea 
                  placeholder="የዜናው ዝርዝር ይዘት..." 
                  rows="4" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required
                  style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px', background: 'var(--soft)', color: 'var(--navy)', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ background: '#10B981', color: '#fff', border: 0, padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                    {editId ? 'አስተካክለው አስቀምጥ' : 'ዜናውን ለጥፍ'}
                  </button>
                  {editId && (
                    <button type="button" onClick={() => { setEditId(null); setTitle(''); setContent(''); }} style={{ background: '#6B7280', color: '#fff', border: 0, padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      ሰርዝ (Cancel)
                    </button>
                  )}
                </div>
              </form>

              <h3 style={{ fontSize: '18px', margin: '0 0 15px', color: 'var(--navy)' }}>📋 የተለጠፉ ዜናዎች ዝርዝር እና አስተዳደር</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {newsList.length > 0 ? (
                  newsList.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'var(--soft)', borderRadius: '10px', border: '1px solid var(--line)', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ flex: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <h4 style={{ margin: '0 0 5px', color: 'var(--navy)', fontSize: '16px' }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{item.content.substring(0, 100)}...</p>
                        <span style={{ fontSize: '11px', color: 'var(--blue)', display: 'inline-block', marginTop: '5px' }}>{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => { setEditId(item.id); setTitle(item.title); setContent(item.content); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={{ background: '#F59E0B', color: '#fff', border: 0, padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                        >
                          አስተካክል
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(item.id)}
                          style={{ background: '#EF4444', color: '#fff', border: 0, padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                        >
                          ሰርዝ
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>እስካሁን የተለጠፈ ዜና የለም።</p>
                )}
              </div>
            </div>

            {/* 2. Submitted Applications & Live Chat Table Card */}
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(16,42,67,0.04)' }}>
              <div style={{ padding: '22px 25px', borderBottom: '1px solid var(--line)', background: 'var(--soft)' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--navy)' }}>Submitted Applications & Live Chat (ማመልከቻዎች እና የቻት ውይይት)</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <colgroup>
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '35%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: 'var(--soft)', borderBottom: '1px solid var(--line)', fontSize: '12px', color: 'var(--muted)' }}>
                      <th style={{ padding: '15px 20px' }}>ID / Code</th>
                      <th style={{ padding: '15px 20px' }}>ሙሉ ስም & ስልክ</th>
                      <th style={{ padding: '15px 20px' }}>አገልግሎት (Service Type)</th>
                      <th style={{ padding: '15px 20px' }}>ሁኔታ (Status)</th>
                      <th style={{ padding: '15px 20px' }}>የውይይት ታሪክ እና መልእክት መላኪያ (Live Chat & Actions)</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '14px' }}>
                    {applications.length > 0 ? (
                      applications.map((app) => {
                        let chatMessages = [];
                        try {
                          chatMessages = app.messages ? JSON.parse(app.messages) : [];
                        } catch (e) {
                          chatMessages = [];
                        }

                        return (
                          <tr key={app.id} style={{ borderBottom: '1px solid var(--line)', verticalAlign: 'top' }}>
                            <td style={{ padding: '16px 20px', color: 'var(--muted)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              <strong style={{ display: 'block', color: 'var(--navy)' }}>#{app.id}</strong>
                              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--blue)' }}>{app.tracking_code || 'N/A'}</span>
                            </td>
                            <td style={{ padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{app.full_name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.phone}</div>
                            </td>
                            <td style={{ padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              <span style={{ background: 'var(--sky)', color: 'var(--blue)', padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '750', display: 'inline-block' }}>
                                {app.service_type}
                              </span>
                            </td>
                            <td style={{ padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              <span style={{ 
                                padding: '5px 10px', 
                                borderRadius: '6px', 
                                fontSize: '11px', 
                                fontWeight: 'bold',
                                background: app.status === 'Approved' ? '#D1FAE5' : app.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                                color: app.status === 'Approved' ? '#047857' : app.status === 'Rejected' ? '#B91C1C' : '#B45309',
                                display: 'inline-block'
                              }}>
                                {app.status || 'Pending'}
                              </span>
                            </td>

                            {/* 💬 ቻት ቦክስ እና ውሳኔ መስጫ ክፍል */}
                            <td style={{ padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {chatMessages.length > 0 ? (
                                  chatMessages.map((msg, idx) => (
                                    <div key={idx} style={{
                                      alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                      background: msg.sender === 'admin' ? '#2563eb' : '#e2e8f0',
                                      color: msg.sender === 'admin' ? '#fff' : '#1e293b',
                                      padding: '8px 12px',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      maxWidth: '85%',
                                      wordBreak: 'break-word',
                                      overflowWrap: 'break-word'
                                    }}>
                                      <div style={{ fontSize: '9px', opacity: 0.8, marginBottom: '2px' }}>
                                        {msg.sender === 'admin' ? 'አድሚን (እርስዎ)' : 'ተጠቃሚ (User)'}
                                      </div>
                                      {msg.text}
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>እስካሁን የተደረገ ውይይት የለም</div>
                                )}
                              </div>

                              <div style={{ display: 'grid', gap: '8px' }}>
                                <input
                                  type="text"
                                  placeholder="ተጨማሪ መልእክት ወይም ምላሽ ይጻፉ..."
                                  value={chatInputs[app.id] || ''}
                                  onChange={(e) => setChatInputs({ ...chatInputs, [app.id]: e.target.value })}
                                  style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--line)', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                                />
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                  <button
                                    disabled={actionLoading === app.id}
                                    onClick={() => handleSendAdminChat(app.id)}
                                    style={{ background: '#4f46e5', color: '#fff', border: 0, padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    መልእክት ላክ (Send)
                                  </button>
                                  <button
                                    disabled={actionLoading === app.id}
                                    onClick={() => handleUpdateApplication(app.id, 'Approved')}
                                    style={{ background: '#10B981', color: '#fff', border: 0, padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    disabled={actionLoading === app.id}
                                    onClick={() => handleUpdateApplication(app.id, 'Rejected')}
                                    style={{ background: '#EF4444', color: '#fff', border: 0, padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                          እስካሁን ምንም ማመልከቻ አልገባም።
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Contact Messages Table Card */}
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(16,42,67,0.04)' }}>
              <div style={{ padding: '22px 25px', borderBottom: '1px solid var(--line)', background: 'var(--soft)' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--navy)' }}>Contact Messages & Replies (የተጠቃሚዎች መልእክቶች እና ምላሽ መስጫ)</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '25%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: 'var(--soft)', borderBottom: '1px solid var(--line)', fontSize: '12px', color: 'var(--muted)' }}>
                      <th style={{ padding: '15px 20px' }}>ID</th>
                      <th style={{ padding: '15px 20px' }}>ስም (Name) & ኢሜይል</th>
                      <th style={{ padding: '15px 20px' }}>የላከው መልእክት (Message)</th>
                      <th style={{ padding: '15px 20px' }}>ለተጠቃሚው መልእክት መላኪያ (Reply)</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '14px' }}>
                    {contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <tr key={contact.id} style={{ borderBottom: '1px solid var(--line)', verticalAlign: 'top' }}>
                          <td style={{ padding: '16px 20px', color: 'var(--muted)', fontFamily: 'monospace', wordBreak: 'break-word', overflowWrap: 'break-word' }}>#{contact.id}</td>
                          <td style={{ padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{contact.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--blue)', wordBreak: 'break-all' }}>{contact.email}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{new Date(contact.created_at).toLocaleString()}</div>
                          </td>
                          <td style={{ padding: '16px 20px', color: 'var(--navy)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            <p style={{ margin: 0, background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              {contact.message}
                            </p>
                          </td>
                          
                          {/* 💬 ለኮንታክት መልእክት አድሚኑ ምላሽ የሚሰጥበት */}
                          <td style={{ padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            <div style={{ display: 'grid', gap: '8px' }}>
                              <input
                                type="text"
                                placeholder="ለዚህ ተጠቃሚ ምላሽ ይጻፉ..."
                                value={contactChatInputs[contact.id] || ''}
                                onChange={(e) => setContactChatInputs({ ...contactChatInputs, [contact.id]: e.target.value })}
                                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--line)', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                              />
                              <button
                                disabled={actionLoading === `contact-${contact.id}`}
                                onClick={() => handleSendContactReply(contact.id)}
                                style={{ background: '#2563eb', color: '#fff', border: 0, padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                ምላሽ ላክ (Send Reply)
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                          እስካሁን ምንም የኮንታክት መልእክት አልገባም።
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}