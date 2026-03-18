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
      setSessionData({ error: "misconfigured", personaId, apiBase });
      setPage("chat");
      return;
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
      setSessionData({ error: "service_unavailable", personaId, apiBase });
      setPage("chat");
    }
  };

  const handleResume = (session) => {
    setSessionData({
      session_id: session.sessionId,
      personaId:  session.personaId,
      apiBase,
      resumedMessages: session.messages,
    });
    setPage("chat");
  };

  const handleBack = () => {
    setPage("landing");
    setSessionData(null);
    pingServer();
  };

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
          onResume={handleResume}
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