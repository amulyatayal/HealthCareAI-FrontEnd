import { ReactNode } from 'react'
import { LogIn, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { WireframeLayout } from '../WireframeLayout'

interface GuestGateProps {
  children: ReactNode
  featureName?: string
}

export function GuestGate({ children, featureName = 'this feature' }: GuestGateProps) {
  const { user } = useAuth()

  if (user?.isGuest) {
    return (
      <WireframeLayout title="Sign In Required" showBack>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff1f2, #fecdd3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Heart size={28} style={{ color: '#f43f5e' }} />
          </div>

          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--wf-gray-800)',
            marginBottom: 8,
          }}>
            Sign in to access {featureName}
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--wf-gray-500)',
            lineHeight: 1.6,
            maxWidth: 300,
            marginBottom: 24,
          }}>
            This feature requires a registered account to ensure your health data is stored
            securely and in compliance with GDPR.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem('auth_token')
              window.location.href = '/'
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogIn size={18} />
            Sign in with Google
          </button>

          <p style={{
            fontSize: 12,
            color: 'var(--wf-gray-400)',
            marginTop: 16,
            lineHeight: 1.5,
          }}>
            As a guest, you can still use Ask Tara (AI chat) and browse health knowledge.
          </p>
        </div>
      </WireframeLayout>
    )
  }

  return <>{children}</>
}
