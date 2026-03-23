import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import ChatPage from "./ChatPage";
import Entrance from "./Entrance";
import ProfilePage from "./ProfilePage";
import PrivacyPage from "./PrivacyPage";
import TermsPage from "./TermsPage";
import { supabase } from "./supabase";

/* ── Simple path-based routing for direct URLs ─────────── */
function getInitialPage() {
  const path = window.location.pathname;
  if (path === "/privacy") return "privacy";
  if (path === "/terms") return "terms";
  return "landing";
}

const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export default function App() {
  const [page, setPage]               = useState(getInitialPage);
  const [sessionData, setSessionData] = useState(null);
  const [apiOk, setApiOk]             = useState(null);
  const [misconfig, setMisconfig]     = useState(false);
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showEntrance, setShowEntrance] = useState(
    !sessionStorage.getItem("mytrailer_visited")
  );

  /* ── Auth listener ─────────────────────────────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ── Handle browser back/forward ─────────────────────── */
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      if (path === "/privacy") setPage("privacy");
      else if (path === "/terms") setPage("terms");
      else if (path === "/profile") setPage("profile");
      else setPage("landing");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
    navigate("landing");
    setSessionData(null);
    pingServer();
  };

  const handleEntranceComplete = () => {
    setShowEntrance(false);
    sessionStorage.setItem("mytrailer_visited", "true");
  };

  const navigate = (p) => {
    const urlMap = { landing: "/", profile: "/profile", privacy: "/privacy", terms: "/terms", chat: "/" };
    window.history.pushState(null, "", urlMap[p] || "/");
    setPage(p);
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("landing");
    setSessionData(null);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-deep)" }}>
        <div style={{ color: "var(--text-primary)", opacity: 0.5, fontFamily: "Montserrat, sans-serif" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {showEntrance && <Entrance onComplete={handleEntranceComplete} />}
      {page === "privacy" ? (
        <PrivacyPage onBack={() => navigate("landing")} />
      ) : page === "terms" ? (
        <TermsPage onBack={() => navigate("landing")} onNavigate={navigate} />
      ) : page === "landing" ? (
        <LandingPage
          onStart={handleStart}
          onResume={handleResume}
          apiBase={apiBase}
          apiOk={apiOk}
          misconfig={misconfig}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onProfileClick={() => navigate("profile")}
        />
      ) : page === "profile" ? (
        <ProfilePage
          user={user}
          onSignOut={handleSignOut}
          onBack={() => navigate("landing")}
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