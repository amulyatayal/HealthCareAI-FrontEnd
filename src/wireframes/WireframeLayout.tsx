import { ReactNode, useEffect } from 'react'
import { ChevronLeft, Heart } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BottomNav } from './components'

const HOSPITAL_STORAGE_KEY = 'wireframe_hospital_logo'

function getShowHospitalLogo(searchParams: URLSearchParams): boolean {
  return searchParams.get('hospital') === 'apollo'
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
  const showHospitalLogo = getShowHospitalLogo(searchParams)

  useEffect(() => {
    try {
      if (searchParams.get('hospital') === 'apollo') {
        sessionStorage.setItem(HOSPITAL_STORAGE_KEY, 'apollo')
      } else {
        sessionStorage.removeItem(HOSPITAL_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [searchParams])

  return (
    <div className="wireframe-phone-frame">
      <div className="wireframe-container">
        <div className="prototype-badge">Prototype</div>
        
        <header className="wf-header">
        {showBack ? (
          <button className="wf-header-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Back
          </button>
        ) : (
          <div style={{ width: 40 }} />
        )}
        
        {showBack && title ? (
          <h1 className="wf-header-title">{title}</h1>
        ) : (
          <div className="wf-logo" style={{ display: 'flex', alignItems: 'center', gap: showHospitalLogo ? '12px' : undefined }}>
            {showHospitalLogo && (
              <img
                src="/apollo-logo.svg"
                alt="Hospital"
                style={{ maxHeight: 36, objectFit: 'contain', width: 'auto' }}
              />
            )}
            <div className="wf-logo-icon">
              <Heart size={18} fill="currentColor" />
              <span className="wf-sparkle">✦</span>
            </div>
            <span className="wf-logo-name">Tara</span>
          </div>
        )}
        
        <div style={{ width: showBack ? 60 : 40 }} /> {/* Right spacer */}
      </header>
      
        <main className="wf-main">
          {children}
        </main>
      </div>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}
