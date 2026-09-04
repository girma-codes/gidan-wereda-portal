import React, { useState, useEffect } from 'react';
import PageHero from "../components/PageHero";
import { ArrowRight } from "lucide-react";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ሰርቨር ላይ ያሉትን ዜናዎች ከዳታቤዝ ማምጣት
  useEffect(() => {
    fetch('http://localhost:5000/api/news')
      .then(res => res.json())
      .then(data => {
        setNewsList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHero 
        eyebrow="NEWS & ANNOUNCEMENTS" 
        title="Official information from Gidan Wereda" 
        text="Public notices, service updates and verified district announcements."
      />
      
      <section className="section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>ዜናዎች በመጫን ላይ ናቸው...</p>
          ) : (
            <div className="news-list">
              {newsList.length > 0 ? (
                newsList.map((n) => {
                  // የተፈጠረበትን ቀን ከዳታቤዝ አምጥቶ ለመክፈል (ለዲዛይኑ እንዲመች)
                  const dateObj = new Date(n.created_at || n.date);
                  const day = dateObj.getDate();
                  const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                  return (
                    <article className="news-row" key={n.id}>
                      <div className="news-date">
                        {day}
                        <small>{monthYear}</small>
                      </div>
                      <div>
                        <span className="eyebrow">{n.author || 'የ ICT ባለሙያ'}</span>
                        <h2>{n.title}</h2>
                        <p>{n.content}</p>
                        <button className="text-link" onClick={() => alert(n.content)}>
                          Read full notice <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--muted)' }}>እስካሁን የታተመ አዲስ ዜና የለም።</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}