import { useState, useEffect } from 'react'
import { Shield, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { recordCookieConsent } from '../../services/api'

const CONSENT_KEY = 'gdpr_consent_v1'

export interface ConsentPreferences {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
}

interface StoredConsent {
  preferences: ConsentPreferences
  timestamp: string
  version: 1
}

function getStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveConsent(preferences: ConsentPreferences) {
  const stored: StoredConsent = {
    preferences,
    timestamp: new Date().toISOString(),
    version: 1,
  }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored))
  } catch {
    // ignore
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      setVisible(true)
    }
  }, [])

  const syncToBackend = (prefs: ConsentPreferences) => {
    recordCookieConsent(
      { necessary: true, functional: prefs.functional, analytics: prefs.analytics, marketing: prefs.marketing },
      'banner',
    ).catch((err) => {
      console.error('[CookieConsent] Backend sync failed:', err)
    })
  }

  const handleAcceptAll = () => {
    const all: ConsentPreferences = { necessary: true, functional: true, analytics: true, marketing: true }
    saveConsent(all)
    syncToBackend(all)
    setVisible(false)
  }

  const handleEssentialOnly = () => {
    const essential: ConsentPreferences = { necessary: true, functional: false, analytics: false, marketing: false }
    saveConsent(essential)
    syncToBackend(essential)
    setVisible(false)
  }

  const handleSaveCustom = () => {
    saveConsent(preferences)
    syncToBackend(preferences)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 200,
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {!showCustomize ? (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <Shield size={18} style={{ color: '#f43f5e', flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                We value your privacy
              </p>
              <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                We use essential cookies to make this site work. With your consent, we may also use non-essential
                cookies to improve your experience.{' '}
                <Link to="/privacy" style={{ color: '#f43f5e', textDecoration: 'underline' }}>Privacy Policy</Link>
              </p>
            </div>
            <button
              onClick={handleEssentialOnly}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9ca3af' }}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleAcceptAll} style={btnPrimary}>
              Accept All
            </button>
            <button onClick={handleEssentialOnly} style={btnSecondary}>
              Essential Only
            </button>
            <button onClick={() => setShowCustomize(true)} style={btnSecondary}>
              Customize
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
            Cookie Preferences
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <Toggle label="Strictly Necessary" description="Required for the site to function." checked disabled />
            <Toggle
              label="Functional"
              description="Remembers your preferences and settings."
              checked={preferences.functional}
              onChange={(v) => setPreferences((p) => ({ ...p, functional: v }))}
            />
            <Toggle
              label="Analytics"
              description="Helps us understand how you use the site."
              checked={preferences.analytics}
              onChange={(v) => setPreferences((p) => ({ ...p, analytics: v }))}
            />
            <Toggle
              label="Marketing"
              description="Used for relevant advertising (if applicable)."
              checked={preferences.marketing}
              onChange={(v) => setPreferences((p) => ({ ...p, marketing: v }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSaveCustom} style={btnPrimary}>
              Save Preferences
            </button>
            <button onClick={() => setShowCustomize(false)} style={btnSecondary}>
              Back
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (val: boolean) => void
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: disabled ? 'default' : 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: '#f43f5e', flexShrink: 0 }}
      />
      <div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{label}</span>
        {disabled && (
          <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 4 }}>(always on)</span>
        )}
        <p style={{ fontSize: 11, color: '#6b7280', margin: '1px 0 0' }}>{description}</p>
      </div>
    </label>
  )
}

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 600,
  color: 'white',
  background: '#f43f5e',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
}

const btnSecondary: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  background: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  cursor: 'pointer',
}
