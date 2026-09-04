import React, { useState } from 'react';

export default function ApplyService() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    service_type: 'Residency Certificate',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTrackingCode('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('ማመልከቻዎ በተሳካ ሁኔታ ገብቷል! እባክዎ የሚከተለውን የትራኪንግ ኮድ ይያዙ።');
        setTrackingCode(data.tracking_code);
        setFormData({
          full_name: '',
          phone: '',
          service_type: 'Residency Certificate',
          description: ''
        });
      } else {
        setError(data.error || 'ማመልከቻውን መላክ አልተቻለም።');
      }
    } catch (err) {
      console.error(err);
      setError('ከ ሰርቨር ጋር መገናኘት አልተቻለም። ሰርቨሩ መጀመሩን ያረጋግጡ።');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'inherit' }}>
      
      {/* ርዕስ ክፍል */}
      <div style={{ marginBottom: '30px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#2563eb', textTransform: 'uppercase' }}>CITIZEN E-SERVICE</span>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '6px 0 8px' }}>ለአገልግሎት ማመልከቻ ይሙሉ</h1>
        <p style={{ color: '#475569', fontSize: '14px' }}>ከዚህ በታች ያለውን ፎርም በትክክል ይሙሉ (* በምልክት የተደረገባቸው ግዴታ ናቸው)።</p>
      </div>

      {/* ዋናው የሁለትዮሽ አቀማመጥ (Grid Layout በ Inline Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '30px', alignItems: 'start' }}>
        
        {/* ግራ በኩል፡ መመሪያዎች እና ማስታወሻዎች */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100%'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>ፈጣን ዲጂታል አገልግሎት</span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>የማመልከቻ መመሪያዎች</h2>
            <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              ትክክለኛ መረጃ በመሙላት ፈጣን ምላሽ ያግኙ። ማመልከቻዎ ሲጠናቀቅ የሚደርሰዎትን የመከታተያ ቁጥር (Tracking Code) በመጠቀም የሂደቱን ሁኔታ መከታተል ይችላሉ።
            </p>

            <div style={{ display: 'grid', gap: '12px', fontSize: '13px', color: '#e2e8f0' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>✓</div>
                <div>ሙሉ ስምዎን እና ስልክ ቁጥርዎን በትክክል ያስገቡ።</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>✓</div>
                <div>የሚፈልጉትን ትክክለኛ የአገልግሎት ዓይነት ከዝርዝሩ ይምረጡ።</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>✓</div>
                <div>አስፈላጊ ተጨማሪ ማብራሪያዎችን በመግለጫው ሳጥን ውስጥ ይፃፉ።</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#94a3b8' }}>
            © 2026 የዝገን ወረዳ ፖርታል - መብቱ በህግ የተጠበቀ ነው።
          </div>
        </div>

        {/* ቀኝ በኩል፡ የማመልከቻ መሙያ ፎርም */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)' }}>
          
          {/* Success Message & Tracking Code Box */}
          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>🎉 {message}</p>
              {trackingCode && (
                <div style={{ marginTop: '12px', padding: '12px 15px', background: '#ffffff', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 'bold' }}>የእርስዎ ማመልከቻ የትራኪንግ ኮድ (Tracking Code):</span>
                    <strong style={{ fontSize: '18px', color: '#1d4ed8', letterSpacing: '1px' }}>{trackingCode}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(trackingCode);
                      alert('ኮዱ ተገልብጧል (Copied)!');
                    }}
                    style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    ኮድ ቅዳ (Copy)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 15px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>ሙሉ ስም *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="ሙሉ ስምዎን ያስገቡ"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>ስልክ ቁጥር *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="09..."
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>የአገልግሎት አይነት *</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="Residency Certificate">የመኖሪያ ሰርተፊኬት (Residency Certificate)</option>
                <option value="Support Letter">የድጋፍ ደብዳቤ (Support Letter)</option>
                <option value="Clearance / Certificate">ክሊራንስ / ሰርተፊኬት (Clearance / Certificate)</option>
                <option value="Land Service">የመሬት አገልግሎት (Land Service)</option>
                <option value="Other Services">ልዩ ልዩ አገልግሎቶች (Other Services)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>መግለጫ / ምክንያት (Description)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                placeholder="ስለ ጥያቄዎ ዝርዝር መረጃ ይስጡ..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                marginTop: '6px'
              }}
            >
              {loading ? 'በመላክ ላይ...' : 'ማመልከቻ ላክ (Submit Application)'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}