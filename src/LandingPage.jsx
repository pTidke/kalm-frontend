import { useState, useEffect, useRef } from "react";
import "./landing.css";

const PERSONAS = [
  {
    id: "mate",
    label: "Buddy",
    tagline: "No BS, straight talk",
    desc: "Talks like a coworker. Plain language, no therapy-speak.",
    color: "#C4693A",
  },
  {
    id: "counselor",
    label: "Counselor",
    tagline: "Steady and direct",
    desc: "Calm, focused. Helps you work through it without the fluff.",
    color: "#2E8B80",
  },
  {
    id: "mindful",
    label: "Mindful",
    tagline: "Quiet, no pressure",
    desc: "Slows things down. Good when your head won't stop.",
    color: "#4A6FA5",
  },
  {
    id: "info",
    label: "Informer",
    tagline: "Just the facts",
    desc: "Straight answers about what you're going through.",
    color: "#7B68C8",
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
  mate: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h20"/>
      <path d="M20 18v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/>
      <path d="M12 14V4c0-1.1.9-2 2-2h4a1 1 0 0 1 1 1v1"/>
      <path d="M4 16c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
      <path d="M12 8V4"/>
    </svg>
  ),
  counselor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  mindful: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
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

/* ── Top Nav Bar ──────────────────────────────────────────── */
function TopBar({ activeTab, onTabChange, apiOk, misconfig, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on tab select
  const handleTabChange = (id) => {
    onTabChange(id);
    setMenuOpen(false);
  };

  return (
    <header className={`topbar ${scrolled ? "topbar-scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      {/* Single row: logo | tabs (desktop) | actions | hamburger (mobile) */}
      <div className="topbar-inner">
        {/* Brand name as home link, logo image removed as requested */}
        <button className="logo" onClick={() => handleTabChange("talk")} aria-label="Go to home">
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
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && <span className="tab-active-pill" />}
            </button>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="topbar-actions">
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
          <button className="login-btn" onClick={onLoginClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="login-btn-label">Sign In</span>
          </button>

          {/* Hamburger — mobile only */}
          <button
            className={`hamburger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {menuOpen && (
        <nav className="mobile-menu" role="tablist" aria-label="Mobile navigation">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`mobile-menu-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function LandingPage({ onStart, apiBase, apiOk, misconfig }) {
  const [selected, setSelected] = useState("mate");
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [activeTab, setActiveTab] = useState("talk");
  const [showLogin, setShowLogin] = useState(false);
  // Force light theme and remove toggle logic
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

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

  const persona = PERSONAS.find((p) => p.id === selected);

  if (activeTab !== "talk") {
    const data = ContentData[activeTab];
    return (
      <div className="tab-page-container">
        <TopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          apiOk={apiOk}
          misconfig={misconfig}
          onLoginClick={() => setShowLogin(true)}
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
    );
  }

  return (
    <div className={`landing ${visible ? "visible" : ""}`}>
            <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        apiOk={apiOk}
        misconfig={misconfig}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* Hero */}
      <section className="hero">
        <div className="hero-logo-wrap">
          <img src="/logo.png" alt="MyTrailer Logo" className="hero-logo-img" />
        </div>
        <div className="hero-eyebrow">Built for the ones who build</div>
        <h1 className="hero-title">
          Your space<br />
          <em>on site.</em>
        </h1>
        <p className="hero-tagline">Built for the ones who build.</p>
        <p className="hero-sub">
          In the middle of the noise, pressure, and long shifts, it’s your trailer — a place to talk freely, reset your mind, get real support, and walk back stronger. No judgment. No labels. Just a quiet space that’s yours.

        </p>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-num">17.9%</span>
            <span className="stat-label">of US work suicides are construction workers</span>
          </div>
          <div className="stat">
            <span className="stat-num">4×</span>
            <span className="stat-label">more likely to die by suicide than a work related accident</span>
          </div>
          <div className="stat">
            <span className="stat-num">16%</span>
            <span className="stat-label">of workers experience significant mental distress</span>
          </div>
        </div>
      </section>

      {/* Persona selector */}
      <section className="persona-section">
        <div className="section-label">How do you want to talk?</div>
        <div className="persona-grid">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              className={`persona-card ${selected === p.id ? "active" : ""}`}
              style={{ "--p-color": p.color }}
              onClick={() => setSelected(p.id)}
            >
              <div className="persona-icon">{PersonaIcons[p.id]}</div>
              <div className="persona-label">{p.label}</div>
              <div className="persona-tagline">{p.tagline}</div>
              <div className="persona-desc">{p.desc}</div>
              {selected === p.id && (
                <div className="persona-check">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            <span className="btn-loading"><span/><span/><span/></span>
          ) : (
            <>
              Step Inside
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="btn-arrow">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
        <p className="cta-note">Private · Confined to this device</p>
      </section>

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
      </div>

      <footer className="footer">
        MyTrailer is not a substitute for professional mental health care.
        In immediate danger, call <strong>911</strong>.
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}