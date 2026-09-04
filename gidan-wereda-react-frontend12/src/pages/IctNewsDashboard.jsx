import React, { useState, useEffect } from 'react';

export default function IctNewsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ictKey, setIctKey] = useState('');
  const [newsList, setNewsList] = useState([]);
  
  // የፎርም ስቴቶች (ለአዲስ ዜና ወይም ለማስተካከል)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null); 
  const [message, setMessage] = useState('');

  // ዜናዎችን ከሰርቨር ማምጣት
  const fetchNews = () => {
    fetch('http://localhost:5000/api/news')
      .then(res => res.json())
      .then(data => setNewsList(data))
      .catch(err => console.error('Error fetching news:', err));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ዜና መመዝገብ (POST) ወይም ማስተካከል (PUT)
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId 
      ? `http://localhost:5000/api/ict/news/${editId}` 
      : 'http://localhost:5000/api/ict/news';
    
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, ict_key: ictKey })
    })
    .then(res => {
      if (!res.ok) throw new Error('የፈቃድ (Key) ስህተት ወይም ሰርቨር ችግር!');
      return res.json();
    })
    .then(data => {
      setMessage(data.message);
      setTitle('');
      setContent('');
      setEditId(null);
      fetchNews(); // ዜናዎችን ሪፍሬሽ ማድረግ
    })
    .catch(err => setMessage(err.message));
  };

  // ዜና ለመሰረዝ (DELETE)
  const handleDelete = (id) => {
    if (!window.confirm('ይህንን ዜና መቶ በመቶ መሰረዝ ትፈልጋለህ?')) return;

    fetch(`http://localhost:5000/api/ict/news/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ict_key: ictKey })
    })
    .then(res => {
      if (!res.ok) throw new Error('መሰረዝ አልተቻለም!');
      return res.json();
    })
    .then(data => {
      setMessage(data.message);
      fetchNews();
    })
    .catch(err => alert(err.message));
  };

  return (
    <div style={{ background: 'var(--soft)', minHeight: '100vh', padding: '50px 0' }}>
      <div className="container">
        
        {/* Header Section */}
        <div style={{ background: 'var(--paper)', padding: '30px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--line)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--blue)', letterSpacing: '1.5px' }}>ICT EXPERT PORTAL</span>
          <h1 style={{ fontSize: '26px', color: 'var(--navy)', margin: '5px 0' }}>የወረዳው ዜናዎች እና ማስታወቂያዎች ማስተዳደሪያ</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>ይህ ገጽ የተዘጋጀው ለ ICT ባለሙያው ዜናዎችን ለመለጠፍ፣ ለማስተካከል እና ለመሰረዝ ብቻ ነው።</p>
        </div>

        {/* Login Box (ማለፊያ ቁጥር ማስገቢያ) */}
        {!isAuthenticated ? (
          <div style={{ background: 'var(--paper)', padding: '30px', borderRadius: '16px', border: '1px solid var(--line)', maxWidth: '450px', margin: '40px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: '15px', fontSize: '18px' }}>🔐 የ ICT ባለሙያ መግቢያ</h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>ለመቀጠል ሚስጥራዊ ቁልፍዎን (ICT Key) ያስገቡ።</p>
            
            <input 
              type="password" 
              placeholder="ሚስጥራዊ ቁጥር (Key) ያስገቡ..." 
              value={ictKey}
              onChange={(e) => setIctKey(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '15px', fontSize: '14px' }}
            />
            <button 
              onClick={() => {
                // ከሰርቨር ካስቀመጥነው ኪይ ጋር መመሳከሩን ማረጋገጥ
                if(ictKey === 'gidan_ict_key_2026') {
                  setIsAuthenticated(true);
                  setMessage('');
                } else {
                  alert('ትክክለኛ ያልሆነ ሚስጥራዊ ቁጥር!');
                }
              }}
              style={{ width: '100%', background: 'var(--blue)', color: '#fff', border: 0, padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              ግባ (Login)
            </button>
          </div>
        ) : (
          <div>
            {/* Form for Add/Edit News */}
            <div style={{ background: 'var(--paper)', padding: '25px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--line)' }}>
              <h3 style={{ color: 'var(--navy)', marginTop: 0, fontSize: '18px' }}>
                {editId ? '✏️ ዜና ማስተካከያ (Edit News)' : '➕ አዲስ ዜና መለጠፊያ'}
              </h3>
              
              {message && (
                <div style={{ background: 'var(--sky)', color: 'var(--blue)', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                <input 
                  type="text" 
                  placeholder="የዜና ርዕስ (Title)" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px' }}
                />
                <textarea 
                  placeholder="የዜናው ዝርዝር ይዘት..." 
                  rows="4" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ background: 'var(--green)', color: '#fff', border: 0, padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                    {editId ? 'አስተካክለው አስቀምጥ' : 'ዜናውን ለጥፍ'}
                  </button>
                  {editId && (
                    <button type="button" onClick={() => { setEditId(null); setTitle(''); setContent(''); }} style={{ background: 'var(--muted)', color: '#fff', border: 0, padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      ሰርዝ (Cancel)
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of Existing News for Management */}
            <div style={{ background: 'var(--paper)', padding: '25px', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <h3 style={{ color: 'var(--navy)', marginTop: 0, fontSize: '18px' }}>📋 ነባር ዜናዎች ዝርዝር</h3>
              <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
                {newsList.length > 0 ? (
                  newsList.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'var(--soft)', borderRadius: '10px', border: '1px solid var(--line)', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px', color: 'var(--navy)', fontSize: '16px' }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{item.content.substring(0, 100)}...</p>
                        <span style={{ fontSize: '11px', color: 'var(--blue)', display: 'inline-block', marginTop: '5px' }}>{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => { setEditId(item.id); setTitle(item.title); setContent(item.content); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={{ background: '#FFC107', color: '#000', border: 0, padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                        >
                          አስተካክል
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          style={{ background: 'var(--red)', color: '#fff', border: 0, padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
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
          </div>
        )}

      </div>
    </div>
  );
}