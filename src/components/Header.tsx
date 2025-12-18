import { Heart, PanelLeftClose, PanelLeft, Plus } from 'lucide-react'
import { IndexSelector } from './IndexSelector'
import type { IndexInfo } from '../types'
import './Header.css'

interface HeaderProps {
  onNewChat: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
  selectedIndex: string
  onSelectIndex: (index: string) => void
  availableIndexes: IndexInfo[]
  indexesLoading: boolean
}

export function Header({ 
  onNewChat, 
  onToggleSidebar, 
  sidebarOpen,
  selectedIndex,
  onSelectIndex,
  availableIndexes,
  indexesLoading
}: HeaderProps) {
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
            <span className="logo-name">Healthcare AI</span>
            <span className="logo-tagline">Your Healthcare Companion</span>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <IndexSelector 
          selectedIndex={selectedIndex}
          onSelectIndex={onSelectIndex}
          availableIndexes={availableIndexes}
          isLoading={indexesLoading}
        />
        <button className="btn btn-secondary" onClick={onNewChat}>
          <Plus size={18} />
          New Chat
        </button>
      </div>
    </header>
  )
}

