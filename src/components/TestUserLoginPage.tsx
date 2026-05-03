import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { TestUserLoginSection } from './TestUserLoginSection'
import { PhoneFrame } from '../wireframes/components/PhoneFrame'

/** Visiting `/test` shows test-user sign-in (same route pattern as `/logout`, `/privacy`, `/terms`). */
export function TestUserLoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#fff',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #e5e7eb',
            borderTopColor: '#f43f5e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <PhoneFrame>
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fdf2f8 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: 'white',
            borderRadius: 20,
            padding: '40px 32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
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
            }}
          >
            <Heart size={28} fill="currentColor" />
            <span style={{ position: 'absolute', top: -2, right: -2, fontSize: 14, color: '#f43f5e' }}>✦</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Tara</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>Test user sign-in</p>

          <TestUserLoginSection onToken={(t) => login(t)} />

          <p style={{ fontSize: 13, marginTop: 24 }}>
            <Link
              to="/"
              style={{ color: '#6b7280', textDecoration: 'underline' }}
            >
              ← Back to main sign in
            </Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  )
}
