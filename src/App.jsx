import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import ChatPage from "./ChatPage";
import Entrance from "./Entrance";

const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export default function App() {
  const [page, setPage]               = useState("landing");
  const [sessionData, setSessionData] = useState(null);
  const [waking, setWaking]           = useState(false);
  const [apiOk, setApiOk]             = useState(null);
  const [misconfig, setMisconfig]     = useState(false);
  const [showEntrance, setShowEntrance] = useState(
    !sessionStorage.getItem("mytrailer_visited")
  );

  useEffect(() => {
    if (!apiBase) { setMisconfig(true); setApiOk(false); return; }
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
    } catch { setApiOk(false); }
  };

  const handleStart = async (personaId) => {
    if (!apiBase) {
      alert("VITE_API_URL is not configured.");
      return;
    }
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
      alert("Could not connect to MyTrailer. Please try again in a moment.");
    }
  };

  const handleBack = () => {
    setPage("landing");
    setSessionData(null);
    pingServer();
  };

  if (waking) {
    return (
      <div style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#1A2535", fontFamily: "'Inter', sans-serif",
        gap: 16, padding: 24,
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#E8680A",
              animation: "bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}/>
          ))}
        </div>
        <p style={{ fontSize: 15, color: "#F0EDE8", fontWeight: 600 }}>
          Starting up MyTrailer...
        </p>
        <p style={{ fontSize: 13, color: "#56647A", textAlign: "center",
          maxWidth: 280, lineHeight: 1.6 }}>
          The server is waking up after a period of inactivity.
          This takes about 30 seconds — just the once.
        </p>
        <style>{`
          @keyframes bounce {
            0%,60%,100%{transform:translateY(0);opacity:0.4}
            30%{transform:translateY(-8px);opacity:1}
          }
        `}</style>
      </div>
    );
  }

  const handleEntranceComplete = () => {
    setShowEntrance(false);
    sessionStorage.setItem("mytrailer_visited", "true");
  };

  return (
    <div>
      {showEntrance && <Entrance onComplete={handleEntranceComplete} />}
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