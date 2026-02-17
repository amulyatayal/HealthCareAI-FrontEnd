import { useState, useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google'
import { useAuth } from './contexts/AuthContext'
import { WireframeApp } from './wireframes/WireframeApp'
import { PhoneFrame } from './wireframes/components/PhoneFrame'
import { DataConsentScreen, getStoredDataConsent } from './components/gdpr/DataConsentScreen'
import { Heart, User, ArrowRight } from 'lucide-react'

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '282021051502-09vacaqf3avjaa4utjv1c9laetcq2jbf.apps.googleusercontent.com'

/**
 * ProductApp wraps the full wireframe-based tabbed application
 * with authentication and GDPR data consent.
 *
 * Flow: Loading → Login → Data Consent (first time) → App
 */
export function ProductApp() {
  const { isAuthenticated, isLoading, loginAsGuest, login } = useAuth()
  const [hasDataConsent, setHasDataConsent] = useState<boolean | null>(null)

  useEffect(() => {
    setHasDataConsent(!!getStoredDataConsent())
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fff',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #e5e7eb',
          borderTopColor: '#f43f5e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPageWithGoogle onGuestLogin={loginAsGuest} onGoogleLogin={login} />
  }

  // Show data consent screen on first login (GDPR requirement)
  if (hasDataConsent === false) {
    return (
      <PhoneFrame>
        <DataConsentScreen onConsent={() => setHasDataConsent(true)} />
      </PhoneFrame>
    )
  }

  return <WireframeApp />
}

/**
 * Full login page with Google OAuth + guest login.
 */
function LoginPageWithGoogle({
  onGuestLogin,
  onGoogleLogin,
}: {
  onGuestLogin: (name: string) => void
  onGoogleLogin: (credential: string) => void
}) {
  const [guestName, setGuestName] = useState('')
  const [showGuestForm, setShowGuestForm] = useState(false)

  const handleGoogleSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      onGoogleLogin(response.credential)
    }
  }

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (guestName.trim()) {
      onGuestLogin(guestName.trim())
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PhoneFrame>
        <div style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fdf2f8 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 400,
            background: 'white',
            borderRadius: 20,
            padding: '40px 32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            {/* Logo */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'white',
              position: 'relative',
            }}>
              <Heart size={28} fill="currentColor" />
              <span style={{ position: 'absolute', top: -2, right: -2, fontSize: 14, color: '#f43f5e' }}>✦</span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Tara</h1>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 32px' }}>Your personal AI health companion</p>

            <div style={{ borderTop: '1px solid #f3f4f6', margin: '0 0 24px', position: 'relative' }}>
              <span style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '0 12px',
                fontSize: 13,
                color: '#9ca3af',
              }}>Sign in to continue</span>
            </div>

            {/* Google Sign-In */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Google Login Failed')}
                theme="outline"
                size="large"
                width="336"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '16px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 13, color: '#9ca3af' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {/* Guest login */}
            {!showGuestForm ? (
              <button
                type="button"
                onClick={() => setShowGuestForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '14px 20px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#374151',
                }}
              >
                <User size={18} />
                Continue as Guest
              </button>
            ) : (
              <form onSubmit={handleGuestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                    maxLength={50}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 42px',
                      border: '1px solid #e5e7eb',
                      borderRadius: 12,
                      fontSize: 15,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!guestName.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '14px 20px',
                    background: guestName.trim() ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : '#e5e7eb',
                    color: guestName.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: 12,
                    cursor: guestName.trim() ? 'pointer' : 'not-allowed',
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 24, lineHeight: 1.5 }}>
              By signing in, you agree to our{' '}
              <a href="/terms" style={{ color: '#6b7280', textDecoration: 'underline' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" style={{ color: '#6b7280', textDecoration: 'underline' }}>Privacy Policy</a>
            </p>
          </div>

          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 24, textAlign: 'center', maxWidth: 360 }}>
            <strong>Remember:</strong> This AI provides information only and is not a substitute for professional medical advice.
          </p>
        </div>
      </PhoneFrame>
    </GoogleOAuthProvider>
  )
}
