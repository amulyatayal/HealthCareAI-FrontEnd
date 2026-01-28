import { ReactNode } from 'react'
import { ChevronLeft, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from './components'

interface WireframeLayoutProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  hideNav?: boolean
}

export function WireframeLayout({ children, title, showBack, hideNav }: WireframeLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="wireframe-container">
      <div className="prototype-badge">Prototype</div>
      
      <header className="wf-header">
        {showBack ? (
          <button className="wf-header-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Back
          </button>
        ) : (
          <div className="wf-logo">
            <div className="wf-logo-icon">
              <Heart size={18} fill="currentColor" />
              <span className="wf-sparkle">✦</span>
            </div>
            <span className="wf-logo-name">Tara</span>
          </div>
        )}
        {title && <h1 className="wf-header-title">{title}</h1>}
        <div style={{ width: showBack ? 60 : 40 }} />
      </header>
      
      <main className="wf-main">
        {children}
      </main>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}
