import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Mail, Shield, Calendar, Clock } from 'lucide-react'
import './UserProfile.css'

interface BackendProfile {
    user_id: string
    name: string
    email?: string
    picture?: string
    auth_provider: string
    created_at: string
    last_login: string
}

export function UserProfile() {
    const { user, token, logout } = useAuth()
    const [backendProfile, setBackendProfile] = useState<BackendProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProfile() {
            if (!user || !token) {
                setLoading(false)
                return
            }

            // Guest users don't have backend profiles - use local data only
            if (user.isGuest) {
                setLoading(false)
                return
            }

            try {
                const headers: Record<string, string> = {
                    'Authorization': `Bearer ${token}`
                }

                const response = await fetch('/api/v1/users/me', { headers })

                if (response.ok) {
                    const profile = await response.json()
                    setBackendProfile(profile)
                } else if (response.status === 404) {
                    // User not found in backend - that's okay, use local data
                    setError(null)
                } else {
                    setError('Failed to load profile')
                }
            } catch (err) {
                console.error('Error fetching profile:', err)
                setError('Unable to connect to server')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user, token])

    if (!user) {
        return null
    }

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <p>Loading profile...</p>
                </div>
            </div>
        )
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

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
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

                    {/* Member Since (from backend) */}
                    {backendProfile?.created_at && (
                        <div className="profile-detail">
                            <Calendar size={16} />
                            <span>Member since {formatDate(backendProfile.created_at)}</span>
                        </div>
                    )}

                    {/* Last Login (from backend) */}
                    {backendProfile?.last_login && (
                        <div className="profile-detail">
                            <Clock size={16} />
                            <span>Last login: {formatDate(backendProfile.last_login)}</span>
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

                    {/* Error message if backend unavailable */}
                    {error && (
                        <div className="profile-error">
                            <small>{error}</small>
                        </div>
                    )}
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
