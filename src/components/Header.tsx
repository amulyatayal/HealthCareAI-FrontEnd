import { Heart, PanelLeftClose, PanelLeft, Plus } from 'lucide-react'
import './Header.css'

interface HeaderProps {
  onNewChat: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function Header({ onNewChat, onToggleSidebar, sidebarOpen }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="btn btn-ghost btn-icon"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
        </button>
        
        <div className="logo">
          <div className="logo-icon">
            <Heart size={22} fill="currentColor" />
          </div>
          <div className="logo-text">
            <span className="logo-name">HopeAI</span>
            <span className="logo-tagline">Your Healthcare Companion</span>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <button className="btn btn-secondary" onClick={onNewChat}>
          <Plus size={18} />
          New Chat
        </button>
      </div>
    </header>
  )
}

