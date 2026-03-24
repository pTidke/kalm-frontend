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

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

/* ── Authenticated API headers ───────────────────────────── */
async function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
}

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
  const [showConsent, setShowConsent]   = useState(false);
  const [pendingPersona, setPendingPersona] = useState(null);

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
      const headers = await getAuthHeaders();
      const res = await fetch(`${apiBase}/health`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      setApiOk(data.status === "ok");
    } catch { setApiOk(false); }
  };

  const hasConsented = () => localStorage.getItem("mytrailer_consent") === "true";

  const handleStart = async (personaId) => {
    // Show consent modal if user hasn't agreed yet
    if (!hasConsented()) {
      setPendingPersona(personaId);
      setShowConsent(true);
      return;
    }
    await startSession(personaId);
  };

  const handleConsent = async () => {
    localStorage.setItem("mytrailer_consent", "true");
    setShowConsent(false);
    if (pendingPersona) {
      await startSession(pendingPersona);
      setPendingPersona(null);
    }
  };

  const startSession = async (personaId) => {
    if (!apiBase) {
      setSessionData({ error: "misconfigured", personaId, apiBase });
      setPage("chat");
      return;
    }
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${apiBase}/session/new`, {
        method: "POST",
        headers,
        body: JSON.stringify({ persona_id: personaId }),
      });
      if (res.status === 429) {
        setSessionData({ error: "rate_limited", personaId, apiBase });
        setPage("chat");
        return;
      }
      if (!res.ok) {
        setSessionData({ error: "service_unavailable", personaId, apiBase });
        setPage("chat");
        return;
      }
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
          onNavigate={navigate}
        />
      ) : page === "profile" ? (
        <ProfilePage
          user={user}
          onSignOut={handleSignOut}
          onBack={() => navigate("landing")}
          apiBase={apiBase}
          getAuthHeaders={getAuthHeaders}
        />
      ) : (
        <ChatPage
          sessionData={sessionData}
          onBack={handleBack}
          apiBase={apiBase}
          getAuthHeaders={getAuthHeaders}
        />
      )}
      {showConsent && (
        <div className="consent-overlay">
          <div className="consent-modal">
            <h2 className="consent-title">Before you start</h2>
            <p className="consent-text">
              Your conversations are <strong>encrypted</strong> before storage.
              Messages are processed by <strong>Microsoft Azure OpenAI</strong> to
              generate responses. No data is shared beyond what is needed for this
              purpose. You can export or delete your data at any time from your profile.
            </p>
            <p className="consent-text">
              MyTrailer is <strong>not a substitute</strong> for professional
              mental health care. If you are in crisis, call <strong>988</strong> or
              text <strong>HOME to 741741</strong>.
            </p>
            <p className="consent-text consent-text-small">
              By continuing, you agree to our{" "}
              <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate("privacy"); setShowConsent(false); }}>Privacy Policy</a>
              {" "}and{" "}
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate("terms"); setShowConsent(false); }}>Terms of Service</a>.
            </p>
            <div className="consent-actions">
              <button className="consent-cancel" onClick={() => { setShowConsent(false); setPendingPersona(null); }}>
                Cancel
              </button>
              <button className="consent-agree" onClick={handleConsent}>
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}