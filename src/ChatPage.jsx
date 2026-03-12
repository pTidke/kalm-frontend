import { useState, useEffect, useRef, useCallback } from "react";
import "./chat.css";

const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// ── Per-persona config ──────────────────────────────────────────
const PERSONA_META = {
  mate: {
    label: "Buddy",
    accent: "#C4693A",
    bg: "rgba(196,105,58,0.08)",
    border: "rgba(196,105,58,0.2)",
    userBubble: "#C4693A",
    stageBorder: "rgba(196,105,58,0.3)",
    stageBg: "rgba(196,105,58,0.07)",
  },
  counselor: {
    label: "Counselor",
    accent: "#4A7C6F",
    bg: "rgba(74,124,111,0.08)",
    border: "rgba(74,124,111,0.2)",
    userBubble: "#4A7C6F",
    stageBorder: "rgba(74,124,111,0.3)",
    stageBg: "rgba(74,124,111,0.07)",
  },
  mindful: {
    label: "Mindful",
    accent: "#5A7FA8",
    bg: "rgba(90,127,168,0.08)",
    border: "rgba(90,127,168,0.2)",
    userBubble: "#5A7FA8",
    stageBorder: "rgba(90,127,168,0.3)",
    stageBg: "rgba(90,127,168,0.07)",
  },
  info: {
    label: "Informer",
    accent: "#7260A8",
    bg: "rgba(114,96,168,0.08)",
    border: "rgba(114,96,168,0.2)",
    userBubble: "#7260A8",
    stageBorder: "rgba(114,96,168,0.3)",
    stageBg: "rgba(114,96,168,0.07)",
  },
};

const STAGE_LABELS = {
  approach:               "Listening",
  listen:                 "Listening",
  give_info:              "Informing",
  encourage_professional: "Supporting",
  encourage_self:         "Guiding",
};

const STARTERS = [
  "I've been really low lately and not sure why",
  "I think I'm drinking more than I should",
  "I can't sleep and I'm exhausted all the time",
  "Something happened on site that I can't shake",
  "A workmate seems really off — I'm worried about him",
];

// ── SVG Icons ───────────────────────────────────────────────────
const Icons = {
  back: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  send: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="currentColor"/></svg>,
  mic: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  crisis: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  history: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>,
  close: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  buddy: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  counselor: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  mindful: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  informer: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

import { loadAllSessions, saveSession, formatDate } from "./storage";

// ── Component ───────────────────────────────────────────────────
export default function ChatPage({ sessionData, onBack, apiBase }) {
  const [messages, setMessages] = useState(sessionData.messages ? 
    sessionData.messages.map(m => ({ ...m, time: new Date(m.time) })) : 
    [{ id: 1, role: "assistant", content: sessionData.greeting, time: new Date() }]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [algeeStage, setAlgeeStage]     = useState("approach");
  const [safetyLevel, setSafetyLevel]   = useState(0);
  const [showCrisis, setShowCrisis]     = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const [showInfo, setShowInfo]         = useState(false);
  const [showHistory, setShowHistory]   = useState(false);
  const [pastSessions, setPastSessions] = useState({});
  const [isRecording, setIsRecording]   = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const p = PERSONA_META[sessionData.personaId] || PERSONA_META.counselor;
  const personaIconKey = { mate: "buddy", counselor: "counselor", mindful: "mindful", info: "informer" }[sessionData.personaId] || "counselor";

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (messages.length > 1) {
      saveSession(sessionData.session_id, sessionData.personaId, messages);
    }
  }, [messages]);

  const openHistory = () => {
    setPastSessions(loadAllSessions());
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
    setShowStarters(false);
    setLoading(true);
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: trimmed, time: new Date() }]);

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST", headers: API_HEADERS,
        body: JSON.stringify({ session_id: sessionData.session_id, message: trimmed }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now()+1, role: "assistant", content: data.reply, time: new Date() }]);
      setAlgeeStage(data.algee_stage_name || "approach");
      setSafetyLevel(data.safety_level || 0);
      if (data.crisis_resources) setShowCrisis(true);
    } catch {
      setMessages(prev => [...prev, { id: Date.now()+1, role: "assistant", content: "Sorry, I had trouble connecting. Please try again.", time: new Date(), error: true }]);
    } finally { setLoading(false); }
  }, [loading, apiBase, sessionData]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    let finalTranscript = input ? input + " " : "";

    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const newText = finalTranscript + interimTranscript;
      setInput(newText);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);
    
    try {
      recognition.start();
    } catch(e) {
      setIsRecording(false);
    }
  };

  const fmtTime = (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-shell" style={{
      "--p-accent": p.accent,
      "--p-bg": p.bg,
      "--p-border": p.border,
      "--p-user": p.userBubble,
      "--p-stage-border": p.stageBorder,
      "--p-stage-bg": p.stageBg,
    }}>

      {/* ── Header ── */}
      <header className="chat-header">
        <button className="back-btn" onClick={onBack}>{Icons.back} Back</button>

        <div className="header-identity">
          <div className="header-icon">{Icons[personaIconKey]}</div>
          <div>
            <div className="header-name">Kalm</div>
            <div className="header-sub">{p.label} mode</div>
          </div>
        </div>

        <div className="header-right">
          <div className="stage-badge">{STAGE_LABELS[algeeStage] || "Listening"}</div>
          {safetyLevel > 0 && (
            <button className="crisis-btn" onClick={() => setShowCrisis(true)}>
              {Icons.crisis} Resources
            </button>
          )}
          <button className="icon-btn" onClick={openHistory} title="Chat history">{Icons.history}</button>
          <button className="icon-btn" onClick={() => setShowInfo(v => !v)} title="About Kalm">{Icons.info}</button>
        </div>
      </header>

      {/* ── Info panel ── */}
      {showInfo && (
        <div className="info-panel">
          <div className="info-panel-header">
            <span className="info-title">About Kalm</span>
            <button className="icon-btn small" onClick={() => setShowInfo(false)}>{Icons.close}</button>
          </div>
          <p>Kalm uses the 5-stage ALGEE framework — approaching with care through to encouraging practical support. It draws on DSM-5 knowledge and construction mental health research.</p>
          <p>Conversations are saved on this device only. Kalm is <strong>not a substitute</strong> for professional care. In crisis, call or text <strong>988</strong>.</p>
        </div>
      )}

      {/* ── History drawer ── */}
      {showHistory && (
        <div className="history-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-drawer" onClick={e => e.stopPropagation()}>
            <div className="history-header">
              <span className="history-title">Previous conversations</span>
              <button className="icon-btn small" onClick={() => setShowHistory(false)}>{Icons.close}</button>
            </div>
            <div className="history-list">
              {Object.values(pastSessions).length === 0 ? (
                <div className="history-empty">No saved conversations yet</div>
              ) : (
                Object.values(pastSessions)
                  .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
                  .map(session => {
                    const meta = PERSONA_META[session.personaId] || PERSONA_META.counselor;
                    return (
                      <button
                        key={session.sessionId}
                        className="history-item"
                        style={{ "--h-accent": meta.accent, "--h-bg": meta.bg }}
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
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Crisis modal ── */}
      {showCrisis && (
        <div className="crisis-overlay" onClick={() => setShowCrisis(false)}>
          <div className="crisis-modal" onClick={e => e.stopPropagation()}>
            <div className="crisis-modal-header">
              <div className="crisis-modal-title">Support is available now</div>
              <button className="icon-btn small" onClick={() => setShowCrisis(false)}>{Icons.close}</button>
            </div>
            <div className="crisis-lines">
              {[
                { label: "988 Suicide & Crisis Lifeline", detail: "Call or text 988" },
                { label: "Crisis Text Line", detail: "Text HOME to 741741" },
                { label: "Veterans Crisis Line", detail: "Call 988, press 1" },
                { label: "Construction Industry Helpline", detail: "(833) 405-0207" },
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
            <button className="crisis-close" onClick={() => setShowCrisis(false)}>
              Return to conversation
            </button>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="messages-area">
        <div className="messages-inner">
          {messages.map(msg => (
            <div key={msg.id} className={`message-row ${msg.role === "user" ? "user-row" : "bot-row"}`}>
              {msg.role === "assistant" && (
                <div className="bot-avatar">{Icons[personaIconKey]}</div>
              )}
              <div className={`bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"} ${msg.error ? "error-bubble" : ""}`}>
                <p className="bubble-text">{msg.content}</p>
                <span className="bubble-time">{fmtTime(msg.time)}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot-row">
              <div className="bot-avatar">{Icons[personaIconKey]}</div>
              <div className="bubble bot-bubble typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Starters ── */}
      {showStarters && messages.length <= 1 && (
        <div className="starters">
          <div className="starters-label">Not sure where to start?</div>
          <div className="starters-list">
            {STARTERS.map((s, i) => (
              <button key={i} className="starter-btn" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What's on your mind..."
            rows={1}
            className="chat-input"
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button 
            className={`mic-btn ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
            aria-label="Voice Input"
          >
            {Icons.mic}
          </button>
          <button
            className={`send-btn ${input.trim() && !loading ? "ready" : ""}`}
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
          >
            {Icons.send}
          </button>
        </div>
        <div className="input-footer">
          <span>Saved on this device</span>
          <span className="input-footer-dot">·</span>
          <span>Crisis support: call or text <strong>988</strong></span>
        </div>
      </div>
    </div>
  );
}