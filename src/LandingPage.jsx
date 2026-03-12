import { useState, useEffect } from "react";
import "./landing.css";

const PERSONAS = [
  {
    id: "mate",
    label: "Buddy",
    tagline: "Straight talk, no BS",
    desc: "Like a trusted coworker who gets it. Plain language, no therapy-speak.",
    color: "#4A7C6F",
  },
  {
    id: "counselor",
    label: "Counselor",
    tagline: "Calm, professional support",
    desc: "Warm and measured. Listens carefully, helps you work through things.",
    color: "#4A7C6F",
  },
  {
    id: "mindful",
    label: "Mindful",
    tagline: "Slow down, breathe",
    desc: "Gentle and grounded. Helps you find stillness when things get heavy.",
    color: "#4A7C6F",
  },
  {
    id: "info",
    label: "Informer",
    tagline: "Just the facts",
    desc: "Clear, no-nonsense info about what you're going through.",
    color: "#4A7C6F",
  },
];

const PersonaIcons = {
  mate: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  counselor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  mindful: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
};

export default function LandingPage({ onStart, apiBase, apiOk, misconfig }) {
  const [selected, setSelected] = useState("mate");
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    setVisible(true);
    
  }, []);

  const handleStart = async () => {
    setLoading(true);
    await onStart(selected);
    setLoading(false);
  };

  const persona = PERSONAS.find((p) => p.id === selected);

  return (
    <div className={`landing ${visible ? "visible" : ""}`}>
      {/* Top bar */}
      <header className="topbar">
        <div className="logo"><span>K</span>alm</div>
        <div className="tagline-top">Mental Health Support · Construction Workers</div>
        {apiOk === false && (
          <div className="api-warning">
            {misconfig
              ? "⚠ VITE_API_URL not set in Vercel — see deployment guide"
              : "⚠ Server offline — waking up, click Start to retry"}
          </div>
        )}
        {apiOk === true && (
          <div className="api-ok">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#4A7C6F"/></svg>
            Live
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Built for the trades</div>
        <h1 className="hero-title">
          Someone to talk to,<br />
          <em>no judgment</em>
        </h1>
        <p className="hero-sub">
          Construction work is tough on your body and your head.
          Kalm is a confidential space to talk through what's going on.
        </p>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-num">17.9%</span>
            <span className="stat-label">of US suicides are construction workers</span>
          </div>
          <div className="stat">
            <span className="stat-num">4×</span>
            <span className="stat-label">more likely to die by suicide than a work accident</span>
          </div>
          <div className="stat">
            <span className="stat-num">16%</span>
            <span className="stat-label">of workers experience significant mental distress</span>
          </div>
        </div>
      </section>

      {/* Persona selector */}
      <section className="persona-section">
        <div className="section-label">Choose how you want to talk</div>
        <div className="persona-grid">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              className={`persona-card ${selected === p.id ? "active" : ""}`}
              onClick={() => setSelected(p.id)}
            >
              <div className="persona-icon">{PersonaIcons[p.id]}</div>
              <div className="persona-label">{p.label}</div>
              <div className="persona-tagline">{p.tagline}</div>
              <div className="persona-desc">{p.desc}</div>
              {selected === p.id && (
                <div className="persona-check">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <button
          className="start-btn"
          onClick={handleStart}
          disabled={loading || apiOk === false}
        >
          {loading ? (
            <span className="btn-loading"><span /><span /><span /></span>
          ) : (
            <>
              Start talking as <strong>{persona.label}</strong>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="btn-arrow">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
        <p className="cta-note">Confidential · No login · No data stored permanently</p>
      </section>

      {/* Crisis bar */}
      <div className="crisis-bar">
        <span className="crisis-label">Crisis support 24/7</span>
        <span className="crisis-items">
          <span>988 Suicide &amp; Crisis Lifeline — call or text <strong>988</strong></span>
          <span className="crisis-sep">·</span>
          <span>Crisis Text Line — text <strong>HOME</strong> to <strong>741741</strong></span>
          <span className="crisis-sep">·</span>
          <span>Construction Helpline — <strong>(833) 405-0207</strong></span>
        </span>
      </div>

      <footer className="footer">
        Kalm is not a substitute for professional mental health care.
        If you're in immediate danger, call <strong>911</strong>.
      </footer>
    </div>
  );
}