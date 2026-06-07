import { useState, useEffect } from 'react'
import { Home, Users, Heart, User, MessageCircle, Stethoscope, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useBasePath } from '../hooks/useBasePath'

function getNavMode(): 'ai' | 'search' {
  try {
    const v = localStorage.getItem('nav_mode')
    if (v === 'ai') return 'ai'
  } catch { /* ignore */ }
  return 'search'
}

export function BottomNav() {
  const base = useBasePath()
  const [navMode, setNavMode] = useState<'ai' | 'search'>(getNavMode)

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === 'nav_mode') setNavMode(getNavMode())
    }
    function handleCustom() {
      setNavMode(getNavMode())
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('nav_mode_changed', handleCustom)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('nav_mode_changed', handleCustom)
    }
  }, [])

  return (
    <nav className="wf-bottom-nav">
      <NavLink
        to={`${base}/`}
        end
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Home />
        <span className="wf-nav-label">Home</span>
      </NavLink>

      {navMode === 'search' ? (
        <NavLink
          to={`${base}/search`}
          className={({ isActive }) => `wf-nav-item wf-nav-chat ${isActive ? 'active' : ''}`}
        >
          <Search />
          <span className="wf-nav-label">Search</span>
        </NavLink>
      ) : (
        <NavLink
          to={`${base}/chat`}
          className={({ isActive }) => `wf-nav-item wf-nav-chat ${isActive ? 'active' : ''}`}
        >
          <MessageCircle />
          <span className="wf-nav-label">Ask Tara</span>
        </NavLink>
      )}

      <NavLink
        to={`${base}/community`}
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Users />
        <span className="wf-nav-label">Community</span>
      </NavLink>

      <NavLink
        to={`${base}/health`}
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Heart />
        <span className="wf-nav-label">Health</span>
      </NavLink>

      <NavLink
        to={`${base}/team`}
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Stethoscope />
        <span className="wf-nav-label">Team</span>
      </NavLink>

      <NavLink
        to={`${base}/profile`}
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <User />
        <span className="wf-nav-label">Profile</span>
      </NavLink>
    </nav>
  )
}
