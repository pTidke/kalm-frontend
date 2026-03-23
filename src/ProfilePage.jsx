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
            data with third parties. Chat history is stored locally on your
            device.
          </p>
        </div>

        <button className="profile-logout-btn" onClick={onSignOut}>
          {LogoutIcon}
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
