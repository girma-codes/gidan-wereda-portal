import React, { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatusMessage('መልእክትዎ በሰአቱ ተልጓል! እናመሰግናለን።');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatusMessage('መልእክቱን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ padding: '50px 0 80px' }}>
      <div className="container">
        
        {/* የርዕስ ክፍል */}
        <div style={{ marginBottom: '35px' }}>
          <span className="eyebrow" style={{ color: 'var(--blue)', fontWeight: '800', letterSpacing: '1.5px', fontSize: '12px' }}>እኛን ያግኙን</span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '6px 0 10px', color: 'var(--navy)' }}>Contact Us</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>ማንኛውም ጥያቄ ወይም አስተያየት ካለዎት ከዚህ በታች ባለው ቅጽ መልእክት ይላኩልን።</p>
        </div>

        {/* ዋናው የሁለትዮሽ አቀማመጥ (Grid Container) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'stretch' }} className="contact-grid">
          
          {/* ግራ በኩል፡ የቢሮ መረጃዎች (Professional Info Card) */}
          <div style={{ 
            background: 'linear-gradient(145deg, #0B1F33 0%, #102A43 100%)', 
            color: '#fff', 
            borderRadius: '16px', 
            padding: '35px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(16, 42, 67, 0.12)'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#8DBBFF', letterSpacing: '1.5px', fontWeight: '700', display: 'block', marginBottom: '8px' }}>የዝገን ወረዳ ፖርታል</span>
              <h2 style={{ fontSize: '22px', fontWeight: '750', margin: '0 0 12px', lineHeight: '1.3' }}>የዝገን ወረዳ ሰላም እና ጸጥታ አስተዳደር</h2>
              <p style={{ color: '#C7D7E7', fontSize: '13px', lineHeight: '1.6', marginBottom: '25px' }}>
                ህብረተሰቡን ፈጣን፣ ግልጽ እና ቀልጣፋ ዲጂታል አገልግሎት ለመስጠት ሁልጊዜም ዝግጁ ነን።
              </p>
              
              <div style={{ display: 'grid', gap: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#8DBBFF' }}>📍</div>
                  <div>
                    <span style={{ color: '#9FB3C8', fontSize: '11px', display: 'block' }}>አድራሻ</span>
                    <strong style={{ color: '#fff', fontWeight: '600' }}>ዝገን, አማራ ክልል, ኢትዮጵያ</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#8DBBFF' }}>📞</div>
                  <div>
                    <span style={{ color: '#9FB3C8', fontSize: '11px', display: 'block' }}>ስልክ ቁጥር</span>
                    <strong style={{ color: '#fff', fontWeight: '600' }}>+251 33 000 0000</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#8DBBFF' }}>✉️</div>
                  <div>
                    <span style={{ color: '#9FB3C8', fontSize: '11px', display: 'block' }}>ኢሜይል</span>
                    <strong style={{ color: '#fff', fontWeight: '600' }}>contact@gidanwereda.gov.et</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#8DBBFF' }}>⏰</div>
                  <div>
                    <span style={{ color: '#9FB3C8', fontSize: '11px', display: 'block' }}>የሥራ ሰዓት</span>
                    <strong style={{ color: '#fff', fontWeight: '600' }}>ከሰኞ - አርብ: 2:00 - 11:00 ሰዓት</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#8DBBFF', paddingTop: '15px', marginTop: '25px' }}>
              © 2026 የዝገን ወረዳ ፖርታል - መብቱ በህግ የተጠበቀ ነው።
            </div>
          </div>

          {/* ቀኝ በኩል፡ የመልእክት መላኪያ ፎርም (Sleek Form Card) */}
          <div style={{ 
            background: '#fff', 
            border: '1px solid var(--line)', 
            borderRadius: '16px', 
            padding: '35px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '750', margin: '0 0 18px', color: 'var(--navy)' }}>መልእክት ይላኩላቸው</h2>

              {statusMessage && (
                <div style={{ marginBottom: '20px', padding: '12px 15px', borderRadius: '8px', fontSize: '13px', background: statusMessage.includes('ተልጓል') ? '#E3FCEF' : '#FDECEC', color: statusMessage.includes('ተልጓል') ? '#087F5B' : '#B42318', fontWeight: '600' }}>
                  {statusMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#334E68', marginBottom: '14px' }}>
                  ስምዎ (Name) *
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="ሙሉ ስምዎን ያስገቡ"
                    style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </label>

                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#334E68', marginBottom: '14px' }}>
                  ኢሜይል (Email) *
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@gmail.com"
                    style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </label>

                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#334E68', marginBottom: '20px' }}>
                  መልእክት (Message) *
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="የፅሁፍ መልእክትዎን እዚህ ይጻፉ..."
                    style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
                  ></textarea>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'var(--navy)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontWeight: '750',
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'background 0.2s'
                  }}
                >
                  {loading ? 'በመላክ ላይ...' : 'መልእክት ላክ (Send Message)'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}