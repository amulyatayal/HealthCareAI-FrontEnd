import { useState } from 'react'
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import { Heart, User, ArrowRight } from 'lucide-react'
import './LoginPage.css'

// Google OAuth Client ID - works with authorized origins in Google Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '282021051502-09vacaqf3avjaa4utjv1c9laetcq2jbf.apps.googleusercontent.com'

export function LoginPage() {
  const { login, loginAsGuest } = useAuth()
  const [guestName, setGuestName] = useState('')
  const [showGuestForm, setShowGuestForm] = useState(false)

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      login(credentialResponse.credential)
    }
  }

  const handleError = () => {
    console.error('Google Login Failed')
  }

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (guestName.trim()) {
      loginAsGuest(guestName.trim())
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Heart size={32} fill="currentColor" />
            </div>
            <h1>Healthcare AI</h1>
            <p>Your personal AI companion for breast cancer support</p>
          </div>
          
          <div className="login-divider">
            <span>Sign in to continue</span>
          </div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              width="300"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          <div className="login-or-divider">
            <span>or</span>
          </div>

          {!showGuestForm ? (
            <button 
              className="guest-login-btn"
              onClick={() => setShowGuestForm(true)}
            >
              <User size={18} />
              Continue as Guest
            </button>
          ) : (
            <form onSubmit={handleGuestLogin} className="guest-form">
              <div className="guest-input-wrapper">
                <User size={18} className="guest-input-icon" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  className="guest-input"
                  autoFocus
                  maxLength={50}
                />
              </div>
              <button 
                type="submit" 
                className="guest-submit-btn"
                disabled={!guestName.trim()}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          <p className="login-footer">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <footer className="login-page-footer">
          <p>
            <strong>Remember:</strong> This AI provides information only and is not a substitute for professional medical advice.
          </p>
        </footer>
      </div>
    </GoogleOAuthProvider>
  )
}
