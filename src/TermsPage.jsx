import "./legal.css";

const BackArrow = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export default function TermsPage({ onBack, onNavigate }) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <button className="legal-back-btn" onClick={onBack}>
          {BackArrow}
        </button>
        <h1 className="legal-header-title">Terms of Service</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="legal-content">
        <p className="legal-last-updated">Last updated: March 23, 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using MyTrailer ("the app"), you agree to be bound by
          these Terms of Service. If you do not agree, please do not use the
          app.
        </p>

        <h2>Description of Service</h2>
        <p>
          MyTrailer is an AI-powered mental health support tool designed for
          construction workers. The app provides a safe, private space to talk
          through challenges using AI personas trained in the ALGEE mental
          health first aid framework.
        </p>

        <h2>Not a Substitute for Professional Care</h2>
        <p>
          MyTrailer is a supportive tool only. It does not provide medical
          advice, diagnosis, or treatment. It is not a substitute for
          professional mental health services, therapy, or emergency care.
        </p>
        <p>
          If you are experiencing a mental health crisis, please contact
          emergency services or one of the following resources immediately:
        </p>
        <ul>
          <li>988 Suicide & Crisis Lifeline — call or text 988</li>
          <li>Crisis Text Line — text HOME to 741741</li>
          <li>Emergency services — call 911</li>
        </ul>

        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years of age to use MyTrailer. By using the
          app, you confirm that you meet this requirement.
        </p>

        <h2>User Accounts</h2>
        <ul>
          <li>You may sign in using your Google account</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You agree to provide accurate information during sign-in</li>
          <li>You may delete your account at any time</li>
        </ul>

        <h2>Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the app for any unlawful purpose</li>
          <li>Attempt to exploit, hack, or disrupt the service</li>
          <li>Impersonate another person or misrepresent your identity</li>
          <li>Use the app to harm or harass others</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          All content, design, and code in MyTrailer are the property of the
          MyTrailer team. You may not copy, modify, or distribute any part of
          the app without prior written permission.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          MyTrailer is provided "as is" without warranties of any kind. We are
          not liable for any damages arising from your use of the app, including
          but not limited to emotional distress, reliance on AI-generated
          responses, or service interruptions.
        </p>

        <h2>Privacy</h2>
        <p>
          Your use of MyTrailer is also governed by our{" "}
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("privacy"); }}>
            Privacy Policy
          </a>
          , which describes how we collect, use, and protect your information.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of the app after changes constitutes acceptance of the updated terms.
        </p>

        <div className="legal-contact">
          <p>
            Questions about these terms? Contact us at{" "}
            <a href="mailto:ms.ptidke@gmail.com">ms.ptidke@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
