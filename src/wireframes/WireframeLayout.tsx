import { ReactNode, useEffect } from 'react'
import { ChevronLeft, Heart } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BottomNav } from './components'

const HOSPITAL_STORAGE_KEY = 'wireframe_hospital_logo'

const HOSPITAL_LOGOS: Record<string, string> = {
  apollo: '/apollo-logo.svg',
  bart: '/bart-logo.svg',
}

const HOSPITAL_LABELS: Record<string, string> = {
  apollo: '',
  bart: 'Bart health',
}

function getHospitalId(searchParams: URLSearchParams): string | null {
  const hospital = searchParams.get('hospital')
  return hospital && HOSPITAL_LOGOS[hospital] ? hospital : null
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
      if (hospitalId) {
        sessionStorage.setItem(HOSPITAL_STORAGE_KEY, hospitalId)
      } else {
        sessionStorage.removeItem(HOSPITAL_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [searchParams, hospitalId])

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
          <div className="wf-logo" style={{ display: 'flex', alignItems: 'center', gap: hospitalId ? '12px' : undefined }}>
            {hospitalId && (
              <>
                <img
                  src={HOSPITAL_LOGOS[hospitalId]}
                  alt={HOSPITAL_LABELS[hospitalId] || 'Hospital'}
                  style={{ maxHeight: 36, objectFit: 'contain', width: 'auto' }}
                />
                {HOSPITAL_LABELS[hospitalId] && (
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--wf-gray-800)' }}>
                    {HOSPITAL_LABELS[hospitalId]}
                  </span>
                )}
              </>
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
