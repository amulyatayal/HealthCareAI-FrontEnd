import { useState, useEffect } from 'react'
import { FlaskConical } from 'lucide-react'
import { fetchTestUserLoginEnabled, obtainTestUserSession } from '../services/api'

type Props = {
  onToken: (accessToken: string) => void
  /** Optional wrapper class for the classic LoginPage layout */
  className?: string
  style?: React.CSSProperties
}

export function TestUserLoginSection({ onToken, className, style }: Props) {
  const [userId, setUserId] = useState('test.anvega1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetchTestUserLoginEnabled().then((on) => {
      if (!cancelled) setAllowed(on)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (allowed !== true) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = userId.trim()
    if (!id) return
    setError(null)
    setLoading(true)
    try {
      const { access_token } = await obtainTestUserSession(id)
      onToken(access_token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test login failed')
    } finally {
      setLoading(false)
    }
  }

  const body = (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          justifyContent: 'center',
        }}
      >
        <FlaskConical size={16} style={{ color: '#9ca3af' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Test user (dev)
        </span>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. test.anvega1"
          autoComplete="username"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'ui-monospace, monospace',
          }}
        />
        <button
          type="submit"
          disabled={loading || !userId.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '12px 16px',
            background: userId.trim() && !loading ? '#111827' : '#e5e7eb',
            color: userId.trim() && !loading ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: 12,
            cursor: userId.trim() && !loading ? 'pointer' : 'not-allowed',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {loading ? 'Signing in…' : 'Sign in as test user'}
        </button>
      </form>
      {error ? (
        <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0', lineHeight: 1.4 }}>{error}</p>
      ) : null}
      <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0', lineHeight: 1.4 }}>
        Shown when the API has test-user sign-in enabled. User id must be{' '}
        <span style={{ fontFamily: 'ui-monospace, monospace' }}>test.anvega</span>
        {' '}plus digits only (e.g. test.anvega1).
      </p>
    </>
  )

  if (className) {
    return (
      <div className={className} style={style}>
        {body}
      </div>
    )
  }

  return <div style={style}>{body}</div>
}
