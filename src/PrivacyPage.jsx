import "./legal.css";

const BackArrow = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export default function PrivacyPage({ onBack }) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <button className="legal-back-btn" onClick={onBack}>
          {BackArrow}
        </button>
        <h1 className="legal-header-title">Privacy Policy</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="legal-content">
        <p className="legal-last-updated">Last updated: March 23, 2026</p>

        <h2>Overview</h2>
        <p>
          MyTrailer ("we", "our", "the app") is a mental health support tool
          designed for construction workers. Your privacy is important to us,
          especially given the sensitive nature of the conversations you may have
          through this app.
        </p>

        <h2>Information We Collect</h2>
        <p>When you sign in with Google, we receive:</p>
        <ul>
          <li>Your name and email address</li>
          <li>Your profile picture</li>
        </ul>
        <p>When you use the app, we process:</p>
        <ul>
          <li>Messages you send during chat sessions</li>
          <li>Session metadata (timestamps, selected persona)</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To authenticate your identity and provide access to the app</li>
          <li>To deliver AI-powered mental health support responses</li>
          <li>To save your chat history so you can return to previous conversations</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <ul>
          <li>Authentication data is managed by Supabase with encryption at rest (AES-256) and in transit (TLS/SSL)</li>
          <li>Chat messages are encrypted at the application level (AES-128 / Fernet) before being stored in our database</li>
          <li>Chat history is also cached locally on your device for quick access</li>
          <li>All data transmission uses HTTPS encryption</li>
        </ul>

        <h2>Data Sharing and Processing</h2>
        <p>
          We do not sell, rent, or share your personal information with third
          parties. Your conversations are private. We use the following
          third-party services to operate the app:
        </p>
        <ul>
          <li>Google (authentication only)</li>
          <li>Supabase (authentication and data management)</li>
          <li><strong>Microsoft Azure OpenAI</strong> (AI processing — your messages are sent to generate supportive responses)</li>
          <li>Vercel (frontend hosting)</li>
          <li>Render (backend hosting)</li>
        </ul>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Export all your data from your profile settings</li>
          <li>Permanently delete all your data from your profile settings</li>
          <li>Clear your local chat history at any time</li>
          <li>Withdraw consent by signing out and discontinuing use</li>
        </ul>

        <h2>Important Disclaimer</h2>
        <p>
          MyTrailer is a supportive tool and is not a substitute for
          professional mental health care. If you are in crisis, please contact
          the 988 Suicide & Crisis Lifeline by calling or texting 988, or the
          Crisis Text Line by texting HOME to 741741.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          MyTrailer is not intended for use by individuals under the age of 18.
          We do not knowingly collect personal information from minors.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          users of any significant changes through the app.
        </p>

        <div className="legal-contact">
          <p>
            Questions about this policy? Contact us at{" "}
            <a href="mailto:ms.ptidke@gmail.com">ms.ptidke@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
