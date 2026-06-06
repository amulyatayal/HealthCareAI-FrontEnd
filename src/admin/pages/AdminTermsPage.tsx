import { Link } from 'react-router-dom';

export function AdminTermsPage() {
  return (
    <div className="admin-terms-page">
      <div className="admin-terms-card">
        <div className="admin-terms-header">
          <h1>Admin Terms of Service</h1>
          <p>Please review these terms before using the clinician portal.</p>
        </div>

        <section className="admin-terms-section">
          <h2>1. Authorized Use</h2>
          <p>
            Admin access is restricted to approved clinicians, moderators, and authorized hospital staff
            supporting patient care pathways.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>2. Confidentiality and Minimum Necessary Access</h2>
          <p>
            You must access only the data required for your role and keep all patient-related information
            confidential under applicable law and hospital policy.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>3. Account and Access Security</h2>
          <p>
            You are responsible for your account credentials and any access codes you generate. Do not
            share credentials and report suspected compromise immediately.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>4. Responsible Content and Moderation</h2>
          <p>
            Resources, notifications, events, and community actions must be clinically appropriate,
            respectful, and compliant with approved organizational standards.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>5. Audit and Monitoring</h2>
          <p>
            Administrative actions in this portal may be logged for security, quality assurance, and
            compliance review.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>6. Compliance Obligations</h2>
          <p>
            You must follow relevant legal and regulatory requirements, including applicable privacy and
            data protection rules in your jurisdiction and hospital policies.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>7. Incident Reporting</h2>
          <p>
            Any potential privacy breach, suspicious access, or harmful/misleading content should be
            escalated promptly through your organization&apos;s incident process.
          </p>
        </section>

        <section className="admin-terms-section">
          <h2>8. Access Restriction</h2>
          <p>
            Failure to comply with these terms may result in temporary or permanent suspension of admin
            access.
          </p>
        </section>

        <div className="admin-terms-footer">
          <span>Version 1.0 - Last updated 27 Apr 2026</span>
          <Link to="/admin/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
