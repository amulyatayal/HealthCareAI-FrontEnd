import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

export function AdminLoginPage() {
  const { adminLogin, adminDemoLogin, loginError, isAdminAuthenticated } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      await adminLogin(email.trim(), password);
    } catch {
      setLocalError(loginError || 'Unable to connect. The backend may be unavailable.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || loginError;

  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Clinician Portal</h1>
          <p>Sign in to manage pathway resources</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {displayError && <div className="admin-login-error">{displayError}</div>}

          <div className="admin-form-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clinician@hospital.nhs.uk"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <label className="admin-terms-check">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Link to="/admin/terms" target="_blank" rel="noreferrer">
                Admin Terms of Service
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={submitting || !email.trim() || !password.trim() || !acceptedTerms}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 13, color: 'var(--warm-gray-400)' }}>or</div>

        <button
          type="button"
          className="admin-demo-btn"
          style={{ marginTop: 12 }}
          onClick={() => adminDemoLogin()}
        >
          Continue in Demo Mode
        </button>

        <p className="admin-login-legal-links">
          <Link to="/admin/terms" target="_blank" rel="noreferrer">Admin Terms of Service</Link>
          <span>·</span>
          <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
