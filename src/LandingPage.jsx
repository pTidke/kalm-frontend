import { useState, useEffect, useRef } from "react";
import { loadAllSessions, deleteSession } from "./storage";
import "./landing.css";

const PERSONAS = [
  {
    id: "mack",
    label: "Mack",
    tagline: "Ironworker · Ohio · 18 yrs",
    shortDesc: "Doesn't say much. But he's listening.",
    color: "#4A6FA5",
    bio: "Grew up in Youngstown. Dad was a steelworker before the mills closed. Mack never left — just moved from steel to iron. Divorced seven years ago. Has a teenage son he sees on weekends. Doesn't talk about it much, but you can tell it shaped him.",
    stats: [
      { key: "Age",      val: "42" },
      { key: "Trade",    val: "Ironworker — structural steel, bridges, high-rises" },
      { key: "Home",     val: "Columbus, Ohio. Rents a house. Doesn't need much." },
      { key: "Family",   val: "Divorced. Son named Tyler, 16. Every other weekend." },
      { key: "Off-site", val: "Works on an old F-150 in the driveway. Doesn't watch much TV." },
    ],
    howTheyTalk: [
      "Short sentences. Waits for you to finish.",
      "Never gives advice unless you ask for it.",
      "Doesn't fake enthusiasm. Means what he says.",
      'If he says "yeah" — he actually heard you.',
    ],
    signature: "I'm not going anywhere. Take your time.",
    intro: "won't push. He won't offer advice until he's sure you're done talking. But he's not going anywhere. Short sentences. Real listening. When he finally says something — it lands.",
  },
  {
    id: "ray",
    label: "Ray",
    tagline: "Pipefitter · Texas · 14 yrs",
    shortDesc: "No filter, no judgment. Says it straight.",
    color: "#C0531A",
    bio: "Grew up outside San Antonio. Third generation in the trades — grandfather was a plumber, dad was a welder. Ray went pipefitting because the money was better. Never married, but close. Has a younger sister he looks out for. Says what he thinks and has the bar tab stories to prove it.",
    stats: [
      { key: "Age",      val: "38" },
      { key: "Trade",    val: "Pipefitter — refineries, industrial plants, chemical facilities" },
      { key: "Home",     val: "Odessa, Texas. Owns a small house. Has a dog named Chief." },
      { key: "Family",   val: "Single. Close with his sister and her two kids." },
      { key: "Off-site", val: "Fantasy football. Friday night poker. Volunteers at the local VFW sometimes." },
    ],
    howTheyTalk: [
      "Says what everyone else is thinking.",
      "No filter — but not cruel about it.",
      'Uses "look" and "man" and "here\'s the thing."',
      "Dry humor when the moment calls for it.",
    ],
    signature: "Look, I'm gonna say it straight — and I mean it.",
    intro: "doesn't sugarcoat. He'll tell you what he thinks — but only after he hears you out. Third generation in the trades. He's seen the pressure from every angle. He gets it.",
  },
  {
    id: "deb",
    label: "Deb",
    tagline: "Safety Lead · Michigan · 20 yrs",
    shortDesc: "Seen everything. Zero drama. Easy to talk to.",
    color: "#2E8B80",
    bio: "Started on sites as a laborer out of Detroit — one of the only women on the crew. Worked her way to safety lead the hard way. Seen two fatalities in twenty years. It changed how she sees everything. She doesn't panic, doesn't dramatize — she just handles it.",
    stats: [
      { key: "Age",      val: "46" },
      { key: "Trade",    val: "Safety Lead — commercial construction, heavy civil" },
      { key: "Home",     val: "Grand Rapids, Michigan. Has a house she's been renovating herself for six years." },
      { key: "Family",   val: "Married 18 years. Two kids, both in college now." },
      { key: "Off-site", val: "Runs half-marathons. Terrible at watching sports but goes anyway." },
    ],
    howTheyTalk: [
      "Steady and warm — never rushed.",
      "Doesn't minimize what you're carrying.",
      "Makes you feel like you're the only conversation happening.",
      "Zero drama. Just presence.",
    ],
    signature: "Whatever you're carrying — it's okay to put it down here.",
    intro: "has had a thousand hard conversations on site. Nothing you say will rattle her. She doesn't dramatize, doesn't minimize. She just shows up — steady, warm, and completely present.",
  },
  {
    id: "lou",
    label: "Lou",
    tagline: "Carpenter · Pennsylvania · 22 yrs",
    shortDesc: "Been through it himself. Still here.",
    color: "#8B5A2B",
    bio: "Been in the trade since he was 19. Worked his way from apprentice to foreman on big commercial jobs in Pittsburgh. Around year 12, his marriage fell apart and he spent 18 months drinking too much and not talking to anyone. One guy on his crew noticed and asked him straight. That conversation changed things. He hasn't forgotten it.",
    stats: [
      { key: "Age",      val: "44" },
      { key: "Trade",    val: "Carpenter / Foreman — commercial and residential, framing to finish" },
      { key: "Home",     val: "Pittsburgh, Pennsylvania. Same neighborhood he grew up in." },
      { key: "Family",   val: "Divorced. Two daughters, 14 and 17. Sees them most weekends." },
      { key: "Off-site", val: "Coaches youth baseball in summer. Makes furniture in his garage." },
    ],
    howTheyTalk: [
      "Takes his time. Never rushes you.",
      "Will share a bit of himself when it actually helps.",
      "Doesn't pretend things are fine when they're not.",
      "Patient in a way that feels earned, not performed.",
    ],
    signature: "I've been exactly where you are. And I'm still here.",
    intro: "has been exactly where you are. The silence, the too many drinks, the eighteen months of not talking to anyone. He came out the other side. He wants you to as well.",
  },
];

const TABS = [
  {
    id: "talk",
    label: "Talk",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: "reset",
    label: "Reset",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    ),
  },
  {
    id: "toolbox",
    label: "Toolbox",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: "checkin",
    label: "Check In",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

const PersonaIcons = {
  mack: (
    // I-beam — structural steel / ironworker
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4"  y1="4"  x2="20" y2="4"/>
      <line x1="12" y1="4"  x2="12" y2="20"/>
      <line x1="4"  y1="20" x2="20" y2="20"/>
    </svg>
  ),
  ray: (
    // Wrench — pipefitter
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  deb: (
    // Shield with check — safety lead
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  lou: (
    // Hammer — carpenter
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/>
      <path d="M17 11 12 6"/>
      <path d="M18 6a3 3 0 0 0-3-3l-3 3 3 3 3-3z"/>
    </svg>
  ),
};

const TrailerIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="2" y="8" width="28" height="18" rx="1.5"
      stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <circle cx="8" cy="26" r="2.2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <circle cx="24" cy="26" r="2.2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <rect x="12" y="12" width="8" height="11" rx="0.5"
      stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <line x1="19.5" y1="12.5" x2="19.5" y2="22.5"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <circle cx="13.5" cy="17.5" r="0.8" fill="currentColor"/>
    <line x1="2" y1="17" x2="0" y2="17"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const ContentData = {
  reset: {
    title: "Reset",
    subtitle: "Take a beat between shifts",
    items: [
      { id: 1, title: "Box Breathing", time: "2 min", desc: "Equalize your heart rate and settle your mind.", type: "Focus" },
      { id: 2, title: "Grounding (5-4-3-2-1)", time: "3 min", desc: "Re-center yourself in the present moment.", type: "Calm" },
      { id: 3, title: "Muscle Release", time: "1 min", desc: "Quick physical reset to shed job tension.", type: "Physical" },
    ]
  },
  toolbox: {
    title: "Toolbox",
    subtitle: "Practical support and resources",
    categories: [
      {
        label: "Immediate Help",
        links: [
          { name: "988 Suicide & Crisis Lifeline", text: "Call or text 988", urgent: true },
          { name: "Crisis Text Line", text: "Text HOME to 741741", urgent: true },
        ]
      },
      {
        label: "Industry Resources",
        links: [
          { name: "Construction Industry Alliance", text: "Mental health and suicide prevention research" },
          { name: "SafeBuild Alliance", text: "Mental health resources for field crews" },
        ]
      }
    ]
  },
  checkin: {
    title: "Check In",
    subtitle: "How is it today? No judgment.",
    options: [
      { level: 1, label: "Solid", icon: "💪" },
      { level: 2, label: "Fine", icon: "👍" },
      { level: 3, label: "Bit Off", icon: "😒" },
      { level: 4, label: "Rough", icon: "🛑" },
    ]
  }
};

/* ── Login Modal ──────────────────────────────────────────── */
function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // In a real app we'd redirect or close modal here
      setTimeout(() => onClose(), 2000);
    }, 1500);
  };

  return (
    <div className="login-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className={`login-modal ${shake ? "shake" : ""} ${success ? "success-state" : ""}`}>
        {success ? (
          <div className="login-success-view">
            <div className="success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="login-title">Welcome back!</h2>
            <p className="login-subtitle">You've successfully signed in.</p>
          </div>
        ) : (
          <>
            {/* Close button */}
            <button className="login-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Modal header */}
            <div className="login-header">
              <div className="login-brand">
                <img src="/logo.png" alt="MyTrailer" className="login-brand-img" />
                <span className="login-brand-name">MyTrailer</span>
              </div>
              <h2 className="login-title">Welcome back</h2>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">Email</label>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="login-email"
                    className="login-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label className="login-label" htmlFor="login-pass">Password</label>
                  <button type="button" className="login-forgot">Forgot password?</button>
                </div>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="login-pass"
                    className="login-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-toggle-pass"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading"><span/><span/><span/></span>
                ) : (
                  <>
                    Sign In
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="login-divider"><span>or</span></div>

            <div className="login-footer-text">
              Don't have an account?{" "}
              <button type="button" className="login-signup-link">Create one</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const THEMES = [
  { id: "light",      label: "Paper",       color: "#4a6fa5" },
  { id: "clay",       label: "Clay",        color: "#bc6c4d" },
  { id: "mint",       label: "Mint",        color: "#45b09e" },
  { id: "midnight",   label: "Midnight",    color: "#38bdf8" },
  { id: "steel",      label: "Steel",       color: "#facc15" },
  { id: "ultraviolet",label: "Ultraviolet", color: "#ff007f" },
  { id: "solar",      label: "Solar",       color: "#fbbf24" },
  { id: "frost",      label: "Frost",       color: "#3b82f6" },
];

/* ── Top Nav Bar ──────────────────────────────────────────── */
function TopBar({ activeTab, onTabChange, apiOk, misconfig, user, onSignIn, onProfileClick, theme, onThemeChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topbar ${scrolled ? "topbar-scrolled" : ""}`}>
      {/* Single row: logo | tabs (desktop) | actions */}
      <div className="topbar-inner">
        {/* Brand name as home link */}
        <button className="logo" onClick={() => onTabChange("talk")} aria-label="Go to home">
          <span className="logo-text">MyTrailer</span>
        </button>

        {/* Tabs — hidden on mobile, shown inline on desktop */}
        <nav className="tab-bar" role="tablist" aria-label="Main navigation">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && <span className="tab-active-pill" />}
            </button>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="topbar-actions">
          {/* Theme switcher — horizontal list for visibility */}
          <div className="theme-switcher-row">
            <span className="theme-row-label">THEME</span>
            <div className="theme-dots-wrap">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-dot-btn ${theme === t.id ? "active" : ""}`}
                  onClick={() => onThemeChange(t.id)}
                  title={t.label}
                  aria-label={`Switch to ${t.label} theme`}
                >
                  <span className="theme-color-dot" style={{ background: t.color }} />
                </button>
              ))}
            </div>
          </div>

          {apiOk === false && (
            <div className="api-warning">
              {misconfig ? "⚠ VITE_API_URL not set" : "⚠ Not connected"}
            </div>
          )}
          {apiOk === true && (
            <div className="api-ok">
              <span className="api-dot"/>
              Live
            </div>
          )}
          {user ? (
            <button className="user-menu-btn" onClick={onProfileClick} title="Profile">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="user-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="user-avatar-fallback">
                  {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </button>
          ) : (
            <button className="login-btn" onClick={onSignIn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="login-btn-label">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Bottom Nav Bar (Mobile) ──────────────────────────────── */
function BottomBar({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── Persona Intro Modal (fullscreen pre-chat) ────────────── */
function PersonaIntroModal({ persona, onBack, onStart, loading }) {
  const initials = persona.label.slice(0, 2).toUpperCase();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onBack(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    <div className="intro-modal" style={{ "--p-color": persona.color }}>
      {/* Back */}
      <button className="intro-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back
      </button>

      <div className="intro-content">
        <div className="intro-eyebrow">YOUR TRAILER · YOUR CHOICE</div>

        <div className="intro-avatar">{initials}</div>

        <h1 className="intro-name">{persona.label.toUpperCase()}</h1>
        <div className="intro-tagline">{persona.tagline.toUpperCase()}</div>

        <p className="intro-text">
          <strong>{persona.label}</strong> {persona.intro}
        </p>

        <button
          className="intro-cta"
          onClick={onStart}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading"><span/><span/><span/></span>
          ) : (
            `HEY ${persona.label.toUpperCase()}, GOT A MINUTE? →`
          )}
        </button>

        <p className="intro-privacy">
          Nothing leaves this device · No records · No judgment
        </p>
      </div>
    </div>
  );
}

function fmtSessionDate(iso) {
  const d = new Date(iso), now = new Date(), diff = now - d;
  if (diff < 86400000)  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/* ── Main Component ───────────────────────────────────────── */
export default function LandingPage({ onStart, onResume, apiBase, apiOk, misconfig, user, onSignIn, onSignOut, onProfileClick, onNavigate, theme, onThemeChange }) {
  const [selected, setSelected]       = useState("mack");
  const [expanded, setExpanded]       = useState("mack");
  const [loading, setLoading]         = useState(false);
  const [visible, setVisible]         = useState(false);
  const [activeTab, setActiveTab]     = useState("talk");
  const [showLogin, setShowLogin]     = useState(false);
  const [showIntro, setShowIntro]     = useState(false);
  const [historyList, setHistoryList] = useState([]);
  // Load history from Supabase on mount
  useEffect(() => {
    loadAllSessions().then((all) => {
      setHistoryList(
        Object.values(all).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      );
    });
  }, []);

  const deleteHistoryItem = async (sessionId) => {
    await deleteSession(sessionId);
    setHistoryList(prev => prev.filter(s => s.sessionId !== sessionId));
  };

  useEffect(() => { setVisible(true); }, []);

  // Prevent body scroll when login is open
  useEffect(() => {
    document.body.style.overflow = showLogin ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLogin]);

  const handleStart = async () => {
    setLoading(true);
    await onStart(selected);
    setLoading(false);
  };

  const handlePersonaClick = (id) => {
    const newExpanded = expanded === id ? null : id;
    setSelected(id);
    setExpanded(newExpanded);
    if (newExpanded) {
      setTimeout(() => {
        const item = document.querySelector(`[data-persona="${id}"]`);
        if (!item) return;
        const rect    = item.getBoundingClientRect();
        const headerH = 56;   // --nav-h
        window.scrollBy({ top: rect.top - headerH - 8, behavior: "smooth" });
      }, 380);
    }
  };

  const persona = PERSONAS.find((p) => p.id === selected);

  if (activeTab !== "talk") {
    const data = ContentData[activeTab];
    return (
      <>
        <div className="tab-page-container">
          <TopBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            apiOk={apiOk}
            misconfig={misconfig}
            user={user}
            onSignIn={onSignIn}
            onProfileClick={onProfileClick}
            theme={theme}
            onThemeChange={onThemeChange}
          />
          <main className="tab-content">
            <header className="tab-header">
              <h1 className="tab-title">{data.title}</h1>
              <p className="tab-subtitle">{data.subtitle}</p>
            </header>

            {activeTab === "reset" && (
              <div className="reset-grid">
                {data.items.map(item => (
                  <button key={item.id} className="reset-card">
                    <div className="reset-card-meta">
                      <span className="reset-card-type">{item.type}</span>
                      <span className="reset-card-time">{item.time}</span>
                    </div>
                    <h3 className="reset-card-title">{item.title}</h3>
                    <p className="reset-card-desc">{item.desc}</p>
                    <div className="reset-card-cta">Start Exercise →</div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === "toolbox" && (
              <div className="toolbox-list">
                {data.categories.map((cat, idx) => (
                  <div key={idx} className="toolbox-cat">
                    <h3 className="toolbox-cat-label">{cat.label}</h3>
                    <div className="toolbox-links">
                      {cat.links.map((link, lidx) => (
                        <a key={lidx} href="#" className={`toolbox-link ${link.urgent ? "urgent" : ""}`}>
                          <div className="link-info">
                            <span className="link-name">{link.name}</span>
                            <span className="link-text">{link.text}</span>
                          </div>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "checkin" && (
              <div className="checkin-container">
                <div className="checkin-grid">
                  {data.options.map(opt => (
                    <button key={opt.level} className="checkin-opt">
                      <span className="checkin-icon">{opt.icon}</span>
                      <span className="checkin-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <p className="checkin-note">Your check-ins are private and stay on this device.</p>
              </div>
            )}
          </main>
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>
        <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  return (
    <>
      <div className={`landing ${visible ? "visible" : ""}`}>
        <TopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          apiOk={apiOk}
          misconfig={misconfig}
          user={user}
          onSignIn={onSignIn}
          onProfileClick={onProfileClick}
          theme={theme}
          onThemeChange={onThemeChange}
        />

        <main className="hero">
          <div className="hero-logo-wrap">
            <img src="/logo.png" alt="MyTrailer" className="hero-logo-img" />
          </div>

          <div className="hero-eyebrow">A quiet space for you</div>
          <h1 className="hero-title">
            NOTHING LEAVES <br/>
            <em>THIS TRAILER.</em>
          </h1>
          <div className="hero-tagline">BUILT FOR THE ONES WHO BUILD.</div>
          <p className="hero-sub">
            Whatever happened out there - the pressure, the foreman, the long shift, the thing you can't say to anyone - it stays in here. No records. No judgment. Just a quiet space that's yours.
          </p>
        </main>

        {/* Persona selector */}
        <section className="persona-section">
          <div className="section-label">Who do you want in your Trailer today?</div>
          <div className="persona-accordion">
            {PERSONAS.map((p) => (
              <div
                key={p.id}
                className={`persona-item ${selected === p.id ? "selected" : ""} ${expanded === p.id ? "open" : ""}`}
                style={{ "--p-color": p.color }}
                data-persona={p.id}
              >
                {/* Header row */}
                <button className="persona-item-header" onClick={() => handlePersonaClick(p.id)}>
                  <div className="persona-item-left">
                    <div className="persona-item-icon">{PersonaIcons[p.id]}</div>
                    <div className="persona-item-text">
                      <div className="persona-item-name">{p.label}</div>
                      <div className="persona-item-meta">{p.tagline}</div>
                      <div className="persona-item-desc">{p.shortDesc}</div>
                    </div>
                  </div>
                  <div className="persona-item-right">
                    {selected === p.id && (
                      <span className="persona-selected-tag">Selected</span>
                    )}
                    <svg
                      className={`persona-chevron ${expanded === p.id ? "open" : ""}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </button>

                {/* Expandable bio */}
                <div className={`persona-item-body ${expanded === p.id ? "open" : ""}`}>
                  <div className="persona-item-body-inner">
                    <div className="persona-item-body-content">
                      <p className="persona-bio-text">{p.bio}</p>
                      <div className="persona-stats-grid">
                        {p.stats.map((s) => (
                          <div key={s.key} className="persona-stat-row">
                            <span className="persona-stat-key">{s.key}</span>
                            <span className="persona-stat-val">{s.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="persona-talk-section">
                        <div className="persona-section-sublabel">How they talk</div>
                        <ul className="persona-talk-list">
                          {p.howTheyTalk.map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="persona-sig">"{p.signature}"</div>
                      <button
                        className="persona-talk-cta"
                        onClick={() => { setSelected(p.id); setShowIntro(true); }}
                      >
                        Talk to {p.label} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <button
            className="start-btn"
            style={{ "--p-color": persona?.color }}
            onClick={() => setShowIntro(true)}
          >
            <>
              Invite {persona?.label} in
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="btn-arrow">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          </button>
          <p className="cta-note">Private · Confined to this device</p>
        </section>

        {/* Chat history */}
        {historyList.length > 0 && (
          <section className="home-history-section">
            <div className="section-label" style={{ marginTop: 0 }}>
              Pick up where you left off
            </div>
            <div className="home-history-list">
              {historyList.slice(0, 4).map(session => {
                const meta = PERSONAS.find(p => p.id === session.personaId) || PERSONAS[0];
                return (
                  <div
                    key={session.sessionId}
                    className="home-history-card"
                    style={{ "--h-color": meta.color }}
                  >
                    <button className="hhc-body" onClick={() => onResume(session)}>
                      <div className="hhc-left">
                        <div className="hhc-dot" />
                        <div className="hhc-info">
                          <span className="hhc-name">{meta.label}</span>
                          <span className="hhc-preview">{session.preview}</span>
                        </div>
                      </div>
                      <div className="hhc-right">
                        <span className="hhc-time">{fmtSessionDate(session.savedAt)}</span>
                        <span className="hhc-count">{session.messages?.length || 0} msgs</span>
                      </div>
                    </button>
                    <button
                      className="hhc-delete"
                      onClick={() => deleteHistoryItem(session.sessionId)}
                      title="Delete"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Crisis bar */}
        <div className="crisis-bar">
          <span className="crisis-label">Crisis support 24/7</span>
          <span className="crisis-items">
            <span>988 Lifeline — call or text <strong>988</strong></span>
            <span className="crisis-sep">·</span>
            <span>Crisis Text — text <strong>HOME</strong> to <strong>741741</strong></span>
            <span className="crisis-sep">·</span>
            <span>Construction Helpline — <strong>(833) 405-0207</strong></span>
          </span>
          <div className="crisis-disclaimer">
            MyTrailer is not a substitute for professional mental health care.
            In immediate danger, call <strong>911</strong>.
          </div>
        </div>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

        <footer className="landing-footer">
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("privacy"); }}>Privacy Policy</a>
          <span className="landing-footer-dot" />
          <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate("terms"); }}>Terms of Service</a>
        </footer>
      </div>
      <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
      {showIntro && persona && (
        <PersonaIntroModal
          persona={persona}
          onBack={() => setShowIntro(false)}
          onStart={handleStart}
          loading={loading}
        />
      )}
    </>
  );
}