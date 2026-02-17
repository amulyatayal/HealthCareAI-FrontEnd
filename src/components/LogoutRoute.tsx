import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PhoneFrame } from '../wireframes/components/PhoneFrame'
import { LogOut } from 'lucide-react'

/**
 * Visiting /logout clears the session and shows a confirmation with link back.
 */
export function LogoutRoute() {
  const { logout } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    logout()
    localStorage.removeItem('auth_token')
    setDone(true)
  }, [])

  return (
    <PhoneFrame>
      <div style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fdf2f8 100%)',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: 24,
      }}>
        <div>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <LogOut size={24} style={{ color: '#f43f5e' }} />
          </div>
          <h2 style={{ fontSize: 22, color: '#111827', marginBottom: 8, fontWeight: 700 }}>
            {done ? 'You have been logged out' : 'Logging out...'}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
            Your session has been cleared.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: 'white',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    </PhoneFrame>
  )
}
