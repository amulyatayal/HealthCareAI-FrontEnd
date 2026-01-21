import { useState, useRef, useEffect } from 'react'
import { Heart, PanelLeftClose, PanelLeft, Plus, LogOut, ChevronDown } from 'lucide-react'
import { IndexSelector } from './IndexSelector'
import { useAuth } from '../contexts/AuthContext'
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
  apiVersion: 'v1' | 'v2'
  onApiVersionChange: (version: 'v1' | 'v2') => void
  onUpdateJourney: () => void
}

export function Header({
  onNewChat,
  onToggleSidebar,
  sidebarOpen,
  selectedIndex,
  onSelectIndex,
  availableIndexes,
  indexesLoading,
  apiVersion,
  onApiVersionChange,
  onUpdateJourney,
}: HeaderProps) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            <span className="logo-name">
              Healthcare AI
              <span className="beta-badge">Beta</span>
            </span>
            <span className="logo-tagline">Your Healthcare Companion</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {apiVersion === 'v1' && (
          <IndexSelector
            selectedIndex={selectedIndex}
            onSelectIndex={onSelectIndex}
            availableIndexes={availableIndexes}
            isLoading={indexesLoading}
          />
        )}
        <div className="api-toggle" role="group" aria-label="Select API version">
          <button
            className={`api-chip ${apiVersion === 'v1' ? 'active' : ''}`}
            onClick={() => onApiVersionChange('v1')}
            aria-pressed={apiVersion === 'v1'}
          >
            API v1
          </button>
          <button
            className={`api-chip ${apiVersion === 'v2' ? 'active' : ''}`}
            onClick={() => onApiVersionChange('v2')}
            aria-pressed={apiVersion === 'v2'}
          >
            API v2
          </button>
        </div>
        <button className="btn btn-secondary" onClick={onNewChat}>
          <Plus size={18} />
          New Chat
        </button>

        {/* User Menu */}
        {user && (
          <div className="user-menu-container" ref={menuRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-expanded={showUserMenu}
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown size={16} className={`menu-arrow ${showUserMenu ? 'open' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="user-avatar-large" />
                  ) : (
                    <div className="user-avatar-placeholder large">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    {user.email && <span className="user-email">{user.email}</span>}
                    {user.isGuest && <span className="user-guest-badge">Guest</span>}
                  </div>
                </div>
                <div className="user-menu-divider" />
                <button className="user-menu-item" onClick={() => {
                  setShowUserMenu(false)
                  onUpdateJourney()
                }}>
                  <Heart size={16} />
                  Update Journey
                </button>
                <div className="user-menu-divider" />
                <button className="user-menu-item" onClick={logout}>
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
