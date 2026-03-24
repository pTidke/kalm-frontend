import { supabase } from "./supabase";

/* ── Load all sessions for the current user ──────────────── */
export async function loadAllSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("Load sessions error:", error.message);
    return {};
  }

  const result = {};
  for (const row of data) {
    result[row.session_id] = {
      sessionId: row.session_id,
      personaId: row.persona_id,
      savedAt: row.updated_at,
      preview: row.preview,
      messages: row.messages,
    };
  }
  return result;
}

/* ── Save or update a session ────────────────────────────── */
export async function saveSession(sessionId, personaId, messages) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const preview =
    messages.filter((m) => m.role === "user").slice(-1)[0]?.content ||
    "New session";

  const cleanMessages = messages.map((m) => ({
    ...m,
    time: m.time instanceof Date ? m.time.toISOString() : m.time,
  }));

  const { error } = await supabase
    .from("chat_sessions")
    .upsert(
      {
        user_id: user.id,
        session_id: sessionId,
        persona_id: personaId,
        preview,
        messages: cleanMessages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" }
    );

  if (error) console.warn("Save session error:", error.message);

  // Keep last 20 sessions — delete oldest if over limit
  const { data: all } = await supabase
    .from("chat_sessions")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  if (all && all.length > 20) {
    const toDelete = all.slice(20).map((r) => r.id);
    await supabase.from("chat_sessions").delete().in("id", toDelete);
  }
}

/* ── Delete a single session ─────────────────────────────── */
export async function deleteSession(sessionId) {
  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("session_id", sessionId);

  if (error) console.warn("Delete session error:", error.message);
}

/* ── Delete all sessions for current user ────────────────── */
export async function clearAllSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("user_id", user.id);

  if (error) console.warn("Clear sessions error:", error.message);
}

/* ── Format date (unchanged, not async) ──────────────────── */
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
