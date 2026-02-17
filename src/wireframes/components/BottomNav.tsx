import { Home, Users, Heart, User, MessageCircle, Stethoscope } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useBasePath } from '../hooks/useBasePath'

export function BottomNav() {
  const base = useBasePath()

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
      
      <NavLink
        to={`${base}/chat`}
        className={({ isActive }) => `wf-nav-item wf-nav-chat ${isActive ? 'active' : ''}`}
      >
        <MessageCircle />
        <span className="wf-nav-label">Ask Tara</span>
      </NavLink>
      
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
