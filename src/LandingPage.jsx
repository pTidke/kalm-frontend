import { useState, useEffect } from "react";
import "./landing.css";
import { loadAllSessions, formatDate, deleteSession } from "./storage";

const PERSONAS = [
  {
    id: "mate",
    label: "Buddy",
    tagline: "Straight talk, no BS",
    desc: "Like a trusted coworker who gets it. Plain language, no therapy-speak.",
    color: "#C4693A",
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
    color: "#5A7FA8",
  },
  {
    id: "info",
    label: "Informer",
    tagline: "Just the facts",
    desc: "Clear, no-nonsense info about what you're going through.",
    color: "#7260A8",
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

export default function LandingPage({ onStart, onResume, apiBase }) {
  const [selected, setSelected] = useState("mate");
  const [loading, setLoading]   = useState(false);
  const [apiOk, setApiOk]       = useState(null);
  const [visible, setVisible]   = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setVisible(true);
    fetch(`${apiBase}/health`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((r) => r.json())
      .then(() => setApiOk(true))
      .catch(() => setApiOk(false));
      
    // Load recent chats
    const sessions = Object.values(loadAllSessions());
    sessions.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    setRecentSessions(sessions); // show all
  }, [apiBase]);

  const handleStart = async () => {
    setLoading(true);
    await onStart(selected);
    setLoading(false);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    deleteSession(sessionId);
    // Reload recent chats
    const sessions = Object.values(loadAllSessions());
    sessions.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    setRecentSessions(sessions);
  };

  const persona = PERSONAS.find((p) => p.id === selected);

  return (
    <div className={`landing ${visible ? "visible" : ""}`}>
      {/* Top bar */}
      <header className="topbar">
        <div className="logo"><span>K</span>alm</div>
        <div className="tagline-top">Mental Health Support · Construction Workers</div>
        {apiOk === false && (
          <div className="api-warning">Backend offline — start server first</div>
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
          <em style={{ color: persona.color }}>no judgment</em>
        </h1>
        <p className="hero-sub">
          Construction work is tough on your body and your head.
          Kalm is a confidential space to talk through what's going on.
        </p>

      </section>


      {/* Persona selector */}
      <section className="persona-section">
        <div className="section-label">Choose how you want to talk</div>
        <div className="persona-grid">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              className={`persona-card ${selected === p.id ? "active" : ""}`}
              style={{ "--p-color": p.color, "--p-bg": p.color + "0A", "--p-border": p.color + "33" }}
              onClick={() => setSelected(p.id)}
            >
              <div className="persona-icon">{PersonaIcons[p.id]}</div>
              <div className="persona-label">{p.label}</div>
              <div className="persona-tagline">{p.tagline}</div>
              <div className="persona-desc">{p.desc}</div>
              {selected === p.id && (
                <div className="persona-check">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {recentSessions.length > 0 && (
        <section className="recent-chats-section">
          <div className="recent-chats-header">
            <div className="section-label">Recent Conversations</div>
            <div className="recent-chats-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search chats..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="recent-chats-grid">
            {recentSessions.filter(session => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              const pMeta = PERSONAS.find(p => p.id === session.personaId) || PERSONAS[1];
              return pMeta.label.toLowerCase().includes(q) || session.preview.toLowerCase().includes(q);
            }).map(session => {
              const pMeta = PERSONAS.find(p => p.id === session.personaId) || PERSONAS[1];
              return (
                <button 
                  key={session.sessionId} 
                  className="recent-chat-card"
                  style={{ "--p-color": pMeta.color, "--p-bg": pMeta.color + "14" }}
                  onClick={() => onResume(session)}
                >
                  <div className="recent-chat-header">
                    <div className="recent-chat-icon">{PersonaIcons[pMeta.id]}</div>
                    <div className="recent-chat-meta">
                      <span className="recent-chat-persona">{pMeta.label}</span>
                      <span className="recent-chat-time">{formatDate(session.savedAt)}</span>
                    </div>
                    <button 
                      className="recent-chat-delete" 
                      onClick={(e) => handleDeleteSession(e, session.sessionId)}
                      aria-label="Delete chat"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                  <div className="recent-chat-preview">{session.preview}</div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <button
          className="start-btn"
          style={{ background: persona.color, boxShadow: `0 8px 24px ${persona.color}33` }}
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
      <div className="crisis-section">
        <h2 className="crisis-label">Crisis support 24/7</h2>
        <div className="crisis-list">
          <div className="crisis-item">
            988 Suicide &amp; Crisis Lifeline — call or text <strong>988</strong>
          </div>
          <div className="crisis-item">
            Crisis Text Line — text <strong>HOME</strong> to <strong>741741</strong>
          </div>
          <div className="crisis-item">
            Construction Helpline — <strong>(833) 405-0207</strong>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Kalm is not a substitute for professional mental health care. If you're in immediate danger, call <strong>911</strong>.</p>
      </footer>
    </div>
  );
}