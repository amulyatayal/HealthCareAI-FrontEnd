import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
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
      
      {title && (
        <header className="wf-header">
          {showBack ? (
            <button className="wf-header-back" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              Back
            </button>
          ) : (
            <div />
          )}
          <h1 className="wf-header-title">{title}</h1>
          <div style={{ width: 60 }} />
        </header>
      )}
      
      <main className="wf-main">
        {children}
      </main>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}
