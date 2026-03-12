import { useState } from "react";
import LandingPage from "./LandingPage";
import ChatPage from "./ChatPage";

const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

export default function App() {
  const [page, setPage] = useState("landing");
  const [sessionData, setSessionData] = useState(null);
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleStart = async (personaId) => {
    try {
      const res = await fetch(`${apiBase}/session/new`, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({ persona_id: personaId }),
      });
      const data = await res.json();
      setSessionData({ ...data, personaId, apiBase });
      setPage("chat");
    } catch (e) {
      alert("Could not connect to Kalm server. Make sure the backend is running.");
    }
  };

  const handleResume = (session) => {
    setSessionData({
      session_id: session.sessionId,
      personaId: session.personaId,
      messages: session.messages,
      apiBase
    });
    setPage("chat");
  };

  const handleBack = () => {
    setPage("landing");
    setSessionData(null);
  };

  return (
    <div>
      {page === "landing" ? (
        <LandingPage onStart={handleStart} onResume={handleResume} apiBase={apiBase} />
      ) : (
        <ChatPage sessionData={sessionData} onBack={handleBack} apiBase={apiBase} />
      )}
    </div>
  );
}