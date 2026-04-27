import { ReactNode } from 'react'
import { ChevronLeft, Heart } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BottomNav } from './components'
import { CookieConsent } from '../components/gdpr/CookieConsent'

const HOSPITAL_LOGOS: Record<string, string> = {
  barts: '/barts_logo.png',
  apollo: '/apollo-logo.svg',
  futuredreams: '/futuredreams-logo.png',
  uhnm: '/uhnm-logo.png',
}

/**
 * Resolves the active hospital id from (in priority order):
 *   1. ?hospital= URL param   (for demo / QA overrides)
 *   2. localStorage selected_hospital   (set at login)
 * Returns undefined when no hospital is selected.
 */
function resolveHospitalId(searchParams: URLSearchParams): string | undefined {
  const fromUrl = searchParams.get('hospital')
  if (fromUrl && HOSPITAL_LOGOS[fromUrl]) return fromUrl

  try {
    const fromLogin = localStorage.getItem('selected_hospital')
    if (fromLogin && HOSPITAL_LOGOS[fromLogin]) return fromLogin
  } catch { /* ignore */ }

  return undefined
}

interface WireframeLayoutProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  hideNav?: boolean
}

export function WireframeLayout({ children, title, showBack, hideNav }: WireframeLayoutProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hospitalId = resolveHospitalId(searchParams)

  return (
    <div className="wireframe-phone-frame">
      <div className="wireframe-container">
        <CookieConsent />
        <div className="prototype-badge">Prototype</div>
        
        <header className="wf-header">
        {/* Left: back button or hospital logo (if selected) */}
        {showBack ? (
          <button className="wf-header-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Back
          </button>
        ) : hospitalId ? (
          <div className="wf-header-left">
            <img
              src={HOSPITAL_LOGOS[hospitalId]}
              alt="Hospital"
              style={{ maxHeight: 44, objectFit: 'contain', width: 'auto' }}
            />
          </div>
        ) : (
          <div className="wf-header-left" />
        )}

        {/* Center: page title when showing back */}
        {showBack && title ? (
          <h1 className="wf-header-title">{title}</h1>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }} />
        )}

        {/* Right: Tara logo */}
        {showBack ? (
          <div style={{ width: 60 }} />
        ) : (
          <div className="wf-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="wf-logo-icon">
              <Heart size={20} fill="currentColor" />
              <span className="wf-sparkle">✦</span>
            </div>
            <span className="wf-logo-name">Tara</span>
          </div>
        )}
      </header>
      
        <main className="wf-main">
          {children}
        </main>
      </div>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}
