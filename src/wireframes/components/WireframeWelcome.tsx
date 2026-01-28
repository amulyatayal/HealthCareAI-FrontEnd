import type { ReactNode } from 'react'
import { Heart, Sparkles } from 'lucide-react'

interface WireframeWelcomeProps {
  children?: ReactNode
}

const suggestions = [
  { emoji: '💊', text: 'Side effects' },
  { emoji: '🥗', text: 'Nutrition' },
  { emoji: '😴', text: 'Fatigue' },
  { emoji: '💜', text: 'Support' },
]

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
      background: 'linear-gradient(180deg, #fff1f2 0%, #fafafa 50%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-40px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '-60px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '5%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      {/* Icon with glow effect */}
      <div style={{
        position: 'relative',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(244, 63, 94, 0.35)',
          position: 'relative',
        }}>
          <Heart size={36} color="white" fill="white" />
          {/* Sparkle decoration */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            borderRadius: '50%',
            padding: '6px',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
          }}>
            <Sparkles size={14} color="white" />
          </div>
        </div>
        {/* Glow ring */}
        <div style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '50%',
          border: '2px solid rgba(244, 63, 94, 0.15)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* Greeting */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1a1a2e',
        margin: '0 0 0.5rem 0',
        background: 'linear-gradient(135deg, #1a1a2e, #4a4a6a)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        How can I help you?
      </h2>

      {/* Subtitle */}
      <p style={{
        fontSize: '0.9rem',
        color: '#666',
        margin: '0 0 1.5rem 0',
        maxWidth: '280px',
        lineHeight: 1.5,
      }}>
        Ask me about symptoms, medications, or anything on your mind
      </p>

      {/* Quick suggestions with emojis */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.625rem',
        justifyContent: 'center',
        marginBottom: '1.75rem',
        maxWidth: '340px',
      }}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 0.875rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#4a4a6a',
              background: 'white',
              borderRadius: '2rem',
              border: '1px solid rgba(244, 63, 94, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.4)'
              e.currentTarget.style.background = 'linear-gradient(135deg, #fff1f2, white)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.15)'
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '1rem' }}>{suggestion.emoji}</span>
            {suggestion.text}
          </button>
        ))}
      </div>

      {/* Chat input renders here */}
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
