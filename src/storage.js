import { supabase } from "./supabase";

/* ── Check if user has opted in to saving history ────────── */
export function isSaveHistoryEnabled() {
  return localStorage.getItem("mytrailer_save_history") !== "false";
}

/* ── API helpers ─────────────────────────────────────────── */

async function apiHeaders() {
  const headers = { "Content-Type": "application/json" };
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
}

function getApiBase() {
  return (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
}

/* ── Load all sessions from backend API ──────────────────── */
export async function loadAllSessions() {
  const apiBase = getApiBase();
  if (!apiBase) return {};

  try {
    const headers = await apiHeaders();
    const res = await fetch(`${apiBase}/sessions`, { headers });
    if (!res.ok) return {};

    const { sessions } = await res.json();
    const result = {};
    for (const s of sessions) {
      result[s.session_id] = {
        sessionId: s.session_id,
        personaId: s.persona_id,
        savedAt: s.updated_at,
        preview: s.preview,
        messages: null, // Loaded on demand via loadSessionMessages
      };
    }
    return result;
  } catch {
    console.warn("Failed to load sessions from API");
    return {};
  }
}

/* ── Load messages for a specific session from backend ───── */
export async function loadSessionMessages(sessionId) {
  const apiBase = getApiBase();
  if (!apiBase) return null;

  try {
    const headers = await apiHeaders();
    const res = await fetch(`${apiBase}/sessions/${sessionId}/messages`, { headers });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      sessionId: data.session_id,
      personaId: data.persona_id,
      messages: data.messages.map((m) => ({
        id: Date.now() + Math.random(),
        role: m.role,
        content: m.content,
        time: m.time,
      })),
    };
  } catch {
    console.warn("Failed to load session messages");
    return null;
  }
}

/* ── Save session — backend handles this via /chat, this is now a no-op ── */
export async function saveSession() {
  // Messages are persisted by the backend on each /chat call.
  // No separate save needed.
}

/* ── Delete a single session ─────────────────────────────── */
export async function deleteSession(sessionId) {
  // Frontend-side: clear from legacy table if it exists
  await supabase
    .from("chat_sessions")
    .delete()
    .eq("session_id", sessionId)
    .then(() => {})
    .catch(() => {});
}

/* ── Delete all sessions for current user ────────────────── */
export async function clearAllSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Clear legacy frontend table
  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("user_id", user.id);

  if (error) console.warn("Clear sessions error:", error.message);
}

/* ── Format date (unchanged) ─────────────────────────────── */
export function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000)
    return d.toLocaleDateString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
