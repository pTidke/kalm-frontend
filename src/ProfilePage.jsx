import { useState } from "react";
import { clearAllSessions } from "./storage";
import "./profile.css";

const BackArrow = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const LogoutIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const TrashIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export default function ProfilePage({ user, onSignOut, onBack }) {
  const meta = user?.user_metadata || {};
  const name = meta.full_name || meta.name || "User";
  const email = user?.email || "";
  const avatar = meta.avatar_url || null;
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const [saveHistory, setSaveHistory] = useState(
    () => localStorage.getItem("mytrailer_save_history") !== "false"
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleSaveHistory = () => {
    const next = !saveHistory;
    setSaveHistory(next);
    localStorage.setItem("mytrailer_save_history", String(next));
  };

  const handleDeleteAllData = async () => {
    setDeleting(true);
    await clearAllSessions();
    localStorage.removeItem("mytrailer_consent");
    localStorage.removeItem("mytrailer_save_history");
    setDeleting(false);
    setShowDeleteConfirm(false);
    onSignOut();
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="profile-back-btn" onClick={onBack}>
          {BackArrow}
        </button>
        <h1 className="profile-header-title">Profile</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="profile-content">
        <div className="profile-avatar-section">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="profile-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="profile-avatar-fallback">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="profile-name">{name}</h2>
          <p className="profile-email">{email}</p>
          {joinDate && (
            <p className="profile-joined">Member since {joinDate}</p>
          )}
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Privacy</h3>
          <p className="profile-section-text">
            Your conversations are private and encrypted. We do not share your
            data with third parties. Chat history is stored securely in your
            account.
          </p>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Chat History</h3>
          <div className="profile-toggle-row">
            <div className="profile-toggle-label">
              <span>Save chat history</span>
              <span className="profile-toggle-hint">
                {saveHistory
                  ? "Conversations are saved to your account"
                  : "Conversations are not saved after you leave"}
              </span>
            </div>
            <button
              className={`profile-toggle ${saveHistory ? "on" : ""}`}
              onClick={toggleSaveHistory}
              aria-label="Toggle save chat history"
            >
              <span className="profile-toggle-knob" />
            </button>
          </div>
        </div>

        <div className="profile-section profile-section-danger">
          <h3 className="profile-section-title">Danger Zone</h3>
          <p className="profile-section-text">
            Permanently delete all your chat history and sign out. This cannot be
            undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              className="profile-delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              {TrashIcon}
              <span>Delete All My Data</span>
            </button>
          ) : (
            <div className="profile-delete-confirm">
              <p className="profile-delete-warning">
                Are you sure? All chat sessions will be permanently deleted.
              </p>
              <div className="profile-delete-actions">
                <button
                  className="profile-delete-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="profile-delete-confirm-btn"
                  onClick={handleDeleteAllData}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete Everything"}
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="profile-logout-btn" onClick={onSignOut}>
          {LogoutIcon}
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
