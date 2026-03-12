import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import ChatPage from "./ChatPage";

const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// VITE_API_URL must be set in Vercel environment variables
// e.g. https://kalm-api.onrender.com
const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export default function App() {
  const [page, setPage]               = useState("landing");
  const [sessionData, setSessionData] = useState(null);
  const [waking, setWaking]           = useState(false);
  const [apiOk, setApiOk]             = useState(null);
  const [misconfig, setMisconfig]     = useState(false);

  useEffect(() => {
    if (!apiBase) {
      setMisconfig(true);
      setApiOk(false);
      return;
    }
    pingServer();
  }, []);

  const pingServer = async () => {
    try {
      const res = await fetch(`${apiBase}/health`, {
        headers: API_HEADERS,
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      setApiOk(data.status === "ok");
    } catch {
      setApiOk(false);
    }
  };

  const handleStart = async (personaId) => {
    if (!apiBase) {
      alert("VITE_API_URL is not configured. Please set it in your Vercel environment variables.");
      return;
    }

    // If server appears down, try waking it (Render cold start = ~30s)
    if (!apiOk) {
      setWaking(true);
      for (let i = 0; i < 7; i++) {
        try {
          const res = await fetch(`${apiBase}/ping`, {
            headers: API_HEADERS,
            signal: AbortSignal.timeout(6000),
          });
          if (res.ok) { setApiOk(true); break; }
        } catch {}
        await new Promise(r => setTimeout(r, 5000));
      }
      setWaking(false);
    }

    try {
      const res = await fetch(`${apiBase}/session/new`, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({ persona_id: personaId }),
      });
      const data = await res.json();
      setSessionData({ ...data, personaId, apiBase });
      setPage("chat");
    } catch {
      alert("Could not connect to Kalm server. Please try again in a moment.");
    }
  };

  const handleBack = () => {
    setPage("landing");
    setSessionData(null);
    pingServer();
  };

  // Cold start loading screen
  if (waking) {
    return (
      <div style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#F5F3EF", fontFamily: "'DM Sans', sans-serif", gap: 16,
        padding: 24,
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%", background: "#4A7C6F",
              animation: "bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}/>
          ))}
        </div>
        <p style={{ fontSize: 15, color: "#1C1C1C", fontWeight: 500 }}>Starting up Kalm...</p>
        <p style={{ fontSize: 13, color: "rgba(28,28,28,0.45)", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
          The server is waking up after a period of inactivity.
          This takes about 30 seconds — just the once.
        </p>
        <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.5} 30%{transform:translateY(-8px);opacity:1} }`}</style>
      </div>
    );
  }

  return (
    <div>
      {page === "landing" ? (
        <LandingPage
          onStart={handleStart}
          apiBase={apiBase}
          apiOk={apiOk}
          misconfig={misconfig}
        />
      ) : (
        <ChatPage
          sessionData={sessionData}
          onBack={handleBack}
          apiBase={apiBase}
        />
      )}
    </div>
  );
}