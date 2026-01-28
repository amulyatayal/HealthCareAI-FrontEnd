import { Home, Users, Heart, User, MessageCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function BottomNav() {
  return (
    <nav className="wf-bottom-nav">
      <NavLink
        to="/demo"
        end
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Home />
        <span className="wf-nav-label">Home</span>
      </NavLink>
      
      <NavLink
        to="/demo/chat"
        className={({ isActive }) => `wf-nav-item wf-nav-chat ${isActive ? 'active' : ''}`}
      >
        <MessageCircle />
        <span className="wf-nav-label">Ask Tara</span>
      </NavLink>
      
      <NavLink
        to="/demo/community"
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Users />
        <span className="wf-nav-label">Community</span>
      </NavLink>
      
      <NavLink
        to="/demo/health"
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <Heart />
        <span className="wf-nav-label">Health</span>
      </NavLink>
      
      <NavLink
        to="/demo/profile"
        className={({ isActive }) => `wf-nav-item ${isActive ? 'active' : ''}`}
      >
        <User />
        <span className="wf-nav-label">Profile</span>
      </NavLink>
    </nav>
  )
}
