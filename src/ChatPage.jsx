import { useState, useEffect, useRef, useCallback } from "react";
import { loadAllSessions, saveSession, deleteSession, clearAllSessions, formatDate, isSaveHistoryEnabled } from "./storage";
import "./chat.css";

const API_HEADERS = {
  "Content-Type": "application/json",
};

const PERSONA_META = {
  mack: { label: "Mack", mode: "Ironworker",   accent: "#4A6FA5", bg: "rgba(74,111,165,0.12)",  border: "rgba(74,111,165,0.25)",  bubble: "#4A6FA5" },
  ray:  { label: "Ray",  mode: "Pipefitter",   accent: "#C0531A", bg: "rgba(192,83,26,0.12)",   border: "rgba(192,83,26,0.25)",   bubble: "#C0531A" },
  deb:  { label: "Deb",  mode: "Safety Lead",  accent: "#2E8B80", bg: "rgba(46,139,128,0.12)",  border: "rgba(46,139,128,0.25)",  bubble: "#2E8B80" },
  lou:  { label: "Lou",  mode: "Carpenter",    accent: "#8B5A2B", bg: "rgba(139,90,43,0.12)",   border: "rgba(139,90,43,0.25)",   bubble: "#8B5A2B" },
};

const STAGE_LABELS = {
  approach:               "Listening",
  listen:                 "Listening",
  give_info:              "Informing",
  encourage_professional: "Supporting",
  encourage_self:         "Guiding",
};

const STARTERS = {
  mack: [
    "Long shift today",
    "Something's been sitting with me",
    "Can't really explain it, just off",
    "Rough one with the foreman",
    "Just need somewhere to put it",
  ],
  ray: [
    "Rough day, need to vent",
    "Something happened on site",
    "Been drinking more than I should",
    "Fed up with work lately",
    "Something I can't say to anyone else",
  ],
  deb: [
    "Something's been weighing on me",
    "Worried about someone on my crew",
    "Hard to talk about this with anyone",
    "Not sleeping well lately",
    "A lot going on at home",
  ],
  lou: [
    "Feels like nobody would get it",
    "Things at home are falling apart",
    "Drinking more than I should",
    "Not sure where to even start",
    "Been here before and I don't want to be back",
  ],
};

const PLACEHOLDERS = ["Say something.", "Long shift?", "Rough day?", "Need a minute?"];

const Icons = {
  back: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  send: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="currentColor"/>
    </svg>
  ),
  crisis: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  history: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  phone: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
};

// ── Typewriter component ─────────────────────────────────────────
function TypedText({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    // Finish in ~2–3s regardless of length
    const speed = Math.max(4, Math.min(25, 2400 / text.length));
    const timer = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {displayed}
      <span className="typing-cursor" />
    </>
  );
}

// Storage helpers imported from ./storage

// ── Component ───────────────────────────────────────────────────
export default function ChatPage({ sessionData, onBack, apiBase, getAuthHeaders }) {
  const isOffline  = !!sessionData.error;
  const isResumed  = !!sessionData.resumedMessages;
  const offlineMsg = sessionData.error === "misconfigured"
    ? "MyTrailer isn't configured correctly. The API URL is missing — check your environment settings."
    : "Service is unavailable right now. The server couldn't be reached. Try again in a moment, or check your connection.";

  const [messages, setMessages] = useState(() => {
    if (isResumed)
      return sessionData.resumedMessages.map(m => ({ ...m, time: new Date(m.time) }));
    return [{ id: 1, role: "assistant", content: isOffline ? offlineMsg : sessionData.greeting, time: new Date() }];
  });
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [algeeStage, setAlgeeStage]     = useState("approach");
  const [safetyLevel, setSafetyLevel]   = useState(0);
  const [showCrisis, setShowCrisis]     = useState(false);
  const [showStarters, setShowStarters] = useState(!isOffline && !isResumed);
  const [showInfo, setShowInfo]         = useState(false);
  const [showHistory, setShowHistory]   = useState(false);
  const [pastSessions, setPastSessions] = useState({});
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [lastFailedText, setLastFailedText] = useState(null);
  const [historySearch, setHistorySearch]   = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const p = PERSONA_META[sessionData.personaId] || PERSONA_META.mack;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Rotate placeholder text
  useEffect(() => {
    const t = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Save to Supabase whenever messages update (if user opted in)
  useEffect(() => {
    if (messages.length > 1 && isSaveHistoryEnabled())
      saveSession(sessionData.session_id, sessionData.personaId, messages).catch(() => {});
  }, [messages]);

  // Auto-resize textarea height as content grows
  const resizeTextarea = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const openHistory = async () => {
    setPastSessions(await loadAllSessions());
    setShowHistory(true);
  };

  const loadSession = (session) => {
    setMessages(session.messages.map(m => ({ ...m, time: new Date(m.time) })));
    setShowHistory(false);
    setShowStarters(false);
  };

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    // Reset textarea height after clearing
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setShowStarters(false);
    setLoading(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: "user",
      content: trimmed,
      time: new Date(),
    }]);

    try {
      const headers = getAuthHeaders ? await getAuthHeaders() : API_HEADERS;
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          session_id: sessionData.session_id,
          message: trimmed,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        typing: true,
        time: new Date(),
      }]);
      setAlgeeStage(data.algee_stage_name || "approach");
      setSafetyLevel(data.safety_level || 0);
      if (data.crisis_resources) setShowCrisis(true);
    } catch {
      setLastFailedText(trimmed);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: "Lost connection.",
        time: new Date(),
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, apiBase, sessionData]);

  // Enter sends, Shift+Enter adds new line
  const handleKey = (e) => {
    // Only intercept Enter on desktop (non-touch devices)
    // On mobile, Enter/Return inserts a newline naturally
    // and the user taps the Send button instead
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      send(input);
    }
  };

  const fmtTime = (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="chat-shell"
      style={{
        "--p-accent": p.accent,
        "--p-bg":     p.bg,
        "--p-border": p.border,
        "--p-bubble": p.bubble,
      }}
    >

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="chat-header">
        <button className="back-btn" onClick={onBack}>
          {Icons.back} Back
        </button>

        <div className="header-identity">
          <div className="header-icon">
            {p.label.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="header-name">{p.label}</div>
            <div className="header-sub">{p.mode}</div>
          </div>
        </div>

        <div className="header-right">
          <div className="stage-badge">
            {STAGE_LABELS[algeeStage] || "Listening"}
          </div>
          {safetyLevel > 0 && (
            <button className="crisis-btn" onClick={() => setShowCrisis(true)}>
              {Icons.crisis} Resources
            </button>
          )}
          <button className="icon-btn" onClick={openHistory} title="History">
            {Icons.history}
          </button>
          <button
            className="icon-btn"
            onClick={() => setShowInfo(v => !v)}
            title="About"
          >
            {Icons.info}
          </button>
        </div>
      </header>

      {/* ── Info panel ─────────────────────────────────────── */}
      {showInfo && (
        <div className="info-panel">
          <div className="info-panel-header">
            <span className="info-title">About MyTrailer</span>
            <button
              className="icon-btn small"
              onClick={() => setShowInfo(false)}
            >
              {Icons.close}
            </button>
          </div>
          <p>
            MyTrailer uses the ALGEE framework — 5 stages from first contact
            through to practical support. Backed by DSM-5 knowledge and
            construction mental health research.
          </p>
          <p>
            Conversations stay on this device. MyTrailer is{" "}
            <strong>not a substitute</strong> for professional care.
            In crisis, call or text <strong>988</strong>.
          </p>
        </div>
      )}

      {/* ── History drawer ─────────────────────────────────── */}
      {showHistory && (
        <div
          className="history-overlay"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="history-drawer"
            onClick={e => e.stopPropagation()}
          >
            <div className="history-header">
              <span className="history-title">Previous conversations</span>
              <div className="history-header-actions">
                {Object.values(pastSessions).length > 0 && (
                  <button
                    className="history-clear-btn"
                    onClick={async () => {
                      await clearAllSessions();
                      setPastSessions({});
                      setHistorySearch("");
                    }}
                  >
                    Clear all
                  </button>
                )}
                <button className="icon-btn small" onClick={() => setShowHistory(false)}>
                  {Icons.close}
                </button>
              </div>
            </div>

            {Object.values(pastSessions).length > 0 && (
              <div className="history-search-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="history-search"
                  type="text"
                  placeholder="Search conversations…"
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  autoFocus
                />
                {historySearch && (
                  <button className="history-search-clear" onClick={() => setHistorySearch("")}>
                    {Icons.close}
                  </button>
                )}
              </div>
            )}

            <div className="history-list">
              {(() => {
                const q = historySearch.toLowerCase().trim();
                const all = Object.values(pastSessions)
                  .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
                  .filter(s => !q ||
                    s.preview?.toLowerCase().includes(q) ||
                    (PERSONA_META[s.personaId]?.label || "").toLowerCase().includes(q) ||
                    s.messages?.some(m => m.content?.toLowerCase().includes(q))
                  );

                if (Object.values(pastSessions).length === 0)
                  return <div className="history-empty">No saved conversations yet</div>;
                if (all.length === 0)
                  return <div className="history-empty">No results for "{historySearch}"</div>;

                return all.map(session => {
                  const meta = PERSONA_META[session.personaId] || PERSONA_META.mack;
                  return (
                    <div
                      key={session.sessionId}
                      className="history-item"
                      style={{ "--h-accent": meta.accent }}
                    >
                      <button
                        className="history-item-body"
                        onClick={() => loadSession(session)}
                      >
                        <div className="history-item-dot" />
                        <div className="history-item-content">
                          <div className="history-item-meta">
                            <span className="history-item-persona">{meta.label}</span>
                            <span className="history-item-time">{formatDate(session.savedAt)}</span>
                          </div>
                          <div className="history-item-preview">{session.preview}</div>
                          <div className="history-item-count">{session.messages.length} messages</div>
                        </div>
                      </button>
                      <button
                        className="history-item-delete"
                        title="Delete"
                        onClick={async () => {
                          await deleteSession(session.sessionId);
                          setPastSessions(prev => {
                            const next = { ...prev };
                            delete next[session.sessionId];
                            return next;
                          });
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Crisis modal ────────────────────────────────────── */}
      {showCrisis && (
        <div
          className="crisis-overlay"
          onClick={() => setShowCrisis(false)}
        >
          <div
            className="crisis-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="crisis-modal-header">
              <div className="crisis-modal-title">
                Support available now
              </div>
              <button
                className="icon-btn small"
                onClick={() => setShowCrisis(false)}
              >
                {Icons.close}
              </button>
            </div>
            <div className="crisis-lines">
              {[
                { label: "988 Suicide & Crisis Lifeline", detail: "Call or text 988" },
                { label: "Crisis Text Line",              detail: "Text HOME to 741741" },
                { label: "Veterans Crisis Line",          detail: "Call 988, press 1" },
                { label: "Construction Industry Helpline",detail: "(833) 405-0207" },
              ].map(r => (
                <div className="crisis-line" key={r.label}>
                  <div className="crisis-line-icon">{Icons.phone}</div>
                  <div className="crisis-line-body">
                    <span className="crisis-line-label">{r.label}</span>
                    <span className="crisis-line-detail">{r.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="crisis-close"
              onClick={() => setShowCrisis(false)}
            >
              Return to conversation
            </button>
          </div>
        </div>
      )}

      {/* ── Messages ───────────────────────────────────────── */}
      <div className="messages-area">
        <div className="messages-inner">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message-row ${
                msg.role === "user" ? "user-row" : "bot-row"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="bot-avatar">
                  {p.label.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div
                className={`bubble ${
                  msg.role === "user" ? "user-bubble" : "bot-bubble"
                } ${msg.error ? "error-bubble" : ""}`}
              >
                <p className="bubble-text">
                  {msg.typing ? (
                    <TypedText
                      text={msg.content}
                      onDone={() =>
                        setMessages(prev =>
                          prev.map(m => m.id === msg.id ? { ...m, typing: false } : m)
                        )
                      }
                    />
                  ) : msg.content}
                </p>
                {msg.error && lastFailedText && (
                  <button
                    className="retry-btn"
                    onClick={() => { setLastFailedText(null); send(lastFailedText); }}
                  >
                    Retry →
                  </button>
                )}
                <span className="bubble-time">{fmtTime(msg.time)}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot-row">
              <div className="bot-avatar">
                {p.label.slice(0, 2).toUpperCase()}
              </div>
              <div className="bubble bot-bubble typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Conversation starters ──────────────────────────── */}
      {showStarters && messages.length <= 1 && (
        <div className="starters">
          <div className="starters-label">Not sure where to start?</div>
          <div className="starters-list">
            {(STARTERS[sessionData.personaId] || STARTERS.mack).map((s, i) => (
              <button
                key={i}
                className="starter-btn"
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input area ─────────────────────────────────────── */}
      <div className="input-area">
        {isOffline ? (
          <div className="offline-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Service unavailable — <button className="offline-back-btn" onClick={onBack}>go back</button> and try again
          </div>
        ) : (
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onInput={resizeTextarea}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              rows={1}
              className="chat-input"
            />
            <button
              className={`send-btn ${
                input.trim() && !loading ? "ready" : ""
              }`}
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
            >
              {Icons.send}
            </button>
          </div>
        )}
        <div className="input-footer">
          <span>Private · Stays on your device</span>
          <span className="input-footer-dot">·</span>
          <span>Crisis: call or text <strong>988</strong></span>
        </div>
      </div>

    </div>
  );
}