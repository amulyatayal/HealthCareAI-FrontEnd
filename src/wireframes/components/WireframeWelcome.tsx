import type { ReactNode } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

interface WireframeWelcomeProps {
  children?: ReactNode
}

export function WireframeWelcome({ children }: WireframeWelcomeProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      textAlign: 'center',
    }}>
      {/* Icon */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #e91e63 0%, #f48fb1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
      }}>
        <Heart size={28} color="white" fill="white" />
      </div>

      {/* Greeting */}
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1a1a2e',
        margin: '0 0 0.5rem 0',
      }}>
        How can I help you today?
      </h2>

      {/* Subtitle */}
      <p style={{
        fontSize: '0.875rem',
        color: '#666',
        margin: '0 0 1.5rem 0',
        maxWidth: '280px',
      }}>
        Ask me about your health, symptoms, medications, or anything on your mind
      </p>

      {/* Quick suggestions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        maxWidth: '320px',
      }}>
        {['Side effects', 'Nutrition tips', 'Managing fatigue', 'Emotional support'].map((suggestion) => (
          <span
            key={suggestion}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              color: '#e91e63',
              background: 'rgba(233, 30, 99, 0.08)',
              borderRadius: '1rem',
              border: '1px solid rgba(233, 30, 99, 0.2)',
            }}
          >
            <MessageCircle size={12} />
            {suggestion}
          </span>
        ))}
      </div>

      {/* Chat input renders here */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {children}
      </div>
    </div>
  )
}
