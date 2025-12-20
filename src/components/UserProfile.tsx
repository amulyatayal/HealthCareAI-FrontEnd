import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Mail, Shield } from 'lucide-react'
import './UserProfile.css'

export function UserProfile() {
    const { user, logout } = useAuth()

    if (!user) {
        return null
    }

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Avatar Section */}
                <div className="profile-avatar-section">
                    {user.picture ? (
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="profile-avatar"
                        />
                    ) : (
                        <div className="profile-avatar profile-avatar-initials">
                            {getInitials(user.name)}
                        </div>
                    )}
                </div>

                {/* User Info Section */}
                <div className="profile-info">
                    <h1 className="profile-name">{user.name}</h1>

                    {user.email && (
                        <div className="profile-detail">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                    )}

                    {/* Account Type Badge */}
                    <div className="profile-badge-container">
                        <span className={`profile-badge ${user.isGuest ? 'profile-badge-guest' : 'profile-badge-google'}`}>
                            {user.isGuest ? (
                                <>
                                    <User size={14} />
                                    Guest Account
                                </>
                            ) : (
                                <>
                                    <Shield size={14} />
                                    Google Account
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="profile-actions">
                    <button onClick={logout} className="profile-logout-btn">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Info Card */}
            <div className="profile-info-card">
                <p>
                    <strong>Your privacy matters.</strong> We do not store personal health information.
                    Your conversations help you explore information, but always consult your healthcare team
                    for personalized medical advice.
                </p>
            </div>
        </div>
    )
}
