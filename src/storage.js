const STORAGE_KEY = "kalm_chat_sessions";

export function loadAllSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

export function saveSession(sessionId, personaId, messages) {
  try {
    const all = loadAllSessions();
    all[sessionId] = {
      sessionId,
      personaId,
      savedAt: new Date().toISOString(),
      preview: messages.filter(m => m.role === "user").slice(-1)[0]?.content || "New session",
      messages: messages.map(m => ({
        ...m,
        time: m.time instanceof Date ? m.time.toISOString() : m.time,
      })),
    };
    // Keep last 20 sessions
    const keys = Object.keys(all);
    if (keys.length > 20) {
      keys.sort((a, b) => new Date(all[a].savedAt) - new Date(all[b].savedAt));
      delete all[keys[0]];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch(e) { console.warn("Storage error:", e); }
}

export function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function deleteSession(sessionId) {
  try {
    const all = loadAllSessions();
    delete all[sessionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch(e) { console.warn("Storage error:", e); }
}
