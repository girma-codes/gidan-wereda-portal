import React, { useState } from "react";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";
import { Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function TrackApplication() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🆕 የተጠቃሚው ቻት መጻፊያ ኢንፑት ስቴት
  const [userMsg, setUserMsg] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    // ከዳታቤዝ (Backend) በ Tracking Code መረጃውን መፈለግ
    fetch(`http://localhost:5000/api/applications/track/${code.trim()}`)
      .then((res) => {
        if (!res.ok) throw new Error("ማመልከቻው አልተገኘም");
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("ይህ Tracking Code ያለው ማመልከቻ አልተገኘም ወይም ትክክል አይደለም።");
        setLoading(false);
      });
  };

  // 🆕 ተጠቃሚው ከትራኪንግ ገጹ ሆኖ አድሚን ጋር መልእክት ሲልክ (Send Chat)
  const handleSendUserChat = async () => {
    if (!userMsg.trim() || !result) return;

    setChatLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${result.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'user', text: userMsg }),
      });

      if (response.ok) {
        setUserMsg("");
        // ቻቱ ከተላከ በኋላ ዳታውን ሪፍሬሽ በማድረግ አዲሱን መልእክት ማምጣት
        const res = await fetch(`http://localhost:5000/api/applications/track/${result.tracking_code}`);
        const updatedData = await res.json();
        setResult(updatedData);
      } else {
        alert('መልእክት መላክ አልተቻለም');
      }
    } catch (err) {
      console.error(err);
      alert('ሰርቨር ጋር መገናኘት አልተቻለም');
    } finally {
      setChatLoading(false);
    }
  };

  // 🆕 የቻት መልእክቶችን ከ JSON ፕርስ ማድረግ
  let chatMessages = [];
  if (result && result.messages) {
    try {
      chatMessages = typeof result.messages === 'string' ? JSON.parse(result.messages) : result.messages;
    } catch (e) {
      chatMessages = [];
    }
  }

  return (
    <>
      <PageHero 
        eyebrow="APPLICATION TRACKING" 
        title="የማመልከቻዎን ሁኔታ ይከታተሉ" 
        text="ማመልከቻ ሲያስገቡ የተሰጠዎትን የትራኪንግ ኮድ (Tracking Code) በመጻፍ ወቅታዊ ሁኔታውን እና ከአድሚን ጋር የሚደረግ ውይይት ማየት ይችላሉ።"
      />
      
      <section className="section">
        <div className="container narrow" style={{ maxWidth: '700px' }}>
          
          <form className="search-panel" onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '15px', color: 'var(--muted)' }} />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="የማመልከቻ ኮድ ያስገቡ (ለምሳሌ: GIDAN-123456)"
                required
                style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--navy)', fontSize: '15px' }}
              />
            </div>
            <button type="submit" className="button button-dark" style={{ padding: '0 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? ' በመፈለግ ላይ...' : 'ፈልግ'}
            </button>
          </form>

          {error && (
            <div style={{ background: '#FDECEC', color: 'var(--red)', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="tracking-result" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              
              <div className="result-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', borderBottom: '1px solid var(--line)', paddingBottom: '15px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold' }}>TRACKING CODE</span>
                  <h2 style={{ margin: '4px 0 0', color: 'var(--navy)', fontSize: '22px' }}>{result.tracking_code}</h2>
                </div>
                <StatusBadge status={result.status} />
              </div>

              {/* Timeline / Status representation */}
              <div className="timeline" style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="timeline-item done" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--green)' }}>
                  <CheckCircle2 size={20} />
                  <span>
                    <b style={{ display: 'block', color: 'var(--navy)' }}>ማመልከቻው ገብቷል (Submitted)</b>
                    <small style={{ color: 'var(--muted)' }}>{new Date(result.created_at).toLocaleString()}</small>
                  </span>
                </div>
                
                <div className="timeline-item active" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: result.status !== 'Pending' ? 'var(--green)' : '#D97706' }}>
                  {result.status !== 'Pending' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  <span>
                    <b style={{ display: 'block', color: 'var(--navy)' }}>የአድሚን ውሳኔ (Decision Status: {result.status})</b>
                    <small style={{ color: 'var(--muted)' }}>
                      {result.status === 'Pending' ? 'አድሚኑ እስካሁን አልገመገመውም፣ በሂደት ላይ ይገኛል።' : `ውሳኔው ተሰጥቷል: ${result.status}`}
                    </small>
                  </span>
                </div>
              </div>

              {/* 💬 Live Chat & Admin Discussion Section */}
              <div style={{ background: 'var(--soft)', padding: '18px', borderRadius: '12px', marginTop: '20px', border: '1px solid var(--line)' }}>
                <strong style={{ color: 'var(--navy)', display: 'block', marginBottom: '12px' }}>💬 ከአድሚን ጋር የሚደረግ ውይይት (Live Chat & Messages):</strong>
                
                {/* የቻት መልእክቶች ማሳያ ሳጥን */}
                <div style={{ maxHeight: '220px', overflowY: 'auto', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chatMessages.length > 0 ? (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? '#10B981' : '#2563eb',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        maxWidth: '85%'
                      }}>
                        <div style={{ fontSize: '9px', opacity: 0.8, marginBottom: '2px' }}>
                          {msg.sender === 'user' ? 'እርስዎ (User)' : 'አድሚን (Admin)'}
                        </div>
                        {msg.text}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', padding: '15px' }}>
                      {result.admin_reply || 'እስካሁን ምንም የተደረገ ውይይት የለም።'}
                    </div>
                  )}
                </div>

                {/* ተጠቃሚው መልእክት መጻፊያ ኢንፑት */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="ለአድሚን መልእክት ወይም ጥያቄ ይጻፉ..."
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', background: '#fff' }}
                  />
                  <button
                    disabled={chatLoading}
                    onClick={handleSendUserChat}
                    style={{ background: '#2563eb', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {chatLoading ? '...' : 'ላክ (Send)'}
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
                <div>
                  <small style={{ color: 'var(--muted)', display: 'block', fontSize: '12px' }}>የአገልግሎት አይነት</small>
                  <b style={{ color: 'var(--navy)', fontSize: '14px' }}>{result.service_type}</b>
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', display: 'block', fontSize: '12px' }}>ያመለከተው ሰው ስም</small>
                  <b style={{ color: 'var(--navy)', fontSize: '14px' }}>{result.full_name}</b>
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', display: 'block', fontSize: '12px' }}>ስልክ ቁጥር</small>
                  <b style={{ color: 'var(--navy)', fontSize: '14px' }}>{result.phone}</b>
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', display: 'block', fontSize: '12px' }}>መግለጫ</small>
                  <b style={{ color: 'var(--navy)', fontSize: '14px' }}>{result.description || '-'}</b>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>
    </>
  );
}