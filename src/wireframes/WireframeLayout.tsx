import { ReactNode, useEffect } from 'react'
import { ChevronLeft, Heart } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BottomNav } from './components'

const HOSPITAL_STORAGE_KEY = 'wireframe_hospital_logo'

const HOSPITAL_LOGOS: Record<string, string> = {
  apollo: '/apollo-logo.svg',
  bart: '/barts_logo.png',
}

const HOSPITAL_LABELS: Record<string, string> = {
  apollo: '',
  bart: '',
}

/** Returns hospital id: apollo if ?hospital=apollo, otherwise Barts by default. */
function getHospitalId(searchParams: URLSearchParams): string {
  const hospital = searchParams.get('hospital')
  return hospital && HOSPITAL_LOGOS[hospital] ? hospital : 'bart'
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
  const hospitalId = getHospitalId(searchParams)

  useEffect(() => {
    try {
      sessionStorage.setItem(HOSPITAL_STORAGE_KEY, hospitalId)
    } catch {
      // ignore
    }
  }, [searchParams, hospitalId])

  return (
    <div className="wireframe-phone-frame">
      <div className="wireframe-container">
        <div className="prototype-badge">Prototype</div>
        
        <header className="wf-header">
        {/* Left: back button or hospital (Barts) logo */}
        {showBack ? (
          <button className="wf-header-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Back
          </button>
        ) : (
          <div className="wf-header-left">
            <img
              src={HOSPITAL_LOGOS[hospitalId]}
              alt={HOSPITAL_LABELS[hospitalId] || 'Hospital'}
              style={{ maxHeight: 36, objectFit: 'contain', width: 'auto' }}
            />
          </div>
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
              <Heart size={18} fill="currentColor" />
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
