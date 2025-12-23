import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, ChevronDown } from 'lucide-react'
import './HeaderUserMenu.css'

export function HeaderUserMenu() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleViewProfile = () => {
        setIsOpen(false)
        navigate('/profile')
    }

    const handleLogout = () => {
        setIsOpen(false)
        logout()
    }

    return (
        <div className="header-user-menu" ref={menuRef}>
            <button
                className="header-user-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                {user.picture ? (
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="header-avatar"
                    />
                ) : (
                    <div className="header-avatar header-avatar-initials">
                        {getInitials(user.name)}
                    </div>
                )}
                <ChevronDown size={16} className={`header-chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="header-dropdown">
                    <div className="header-dropdown-user">
                        <span className="header-dropdown-name">{user.name}</span>
                        {user.email && (
                            <span className="header-dropdown-email">{user.email}</span>
                        )}
                    </div>
                    <div className="header-dropdown-divider" />
                    <button className="header-dropdown-item" onClick={handleViewProfile}>
                        <User size={16} />
                        <span>View Profile</span>
                    </button>
                    <button className="header-dropdown-item header-dropdown-logout" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    )
}
