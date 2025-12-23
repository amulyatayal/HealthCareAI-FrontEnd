import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface GoogleUser {
  email: string
  name: string
  picture: string
  sub: string
  exp: number
}

interface User {
  id: string
  email?: string
  name: string
  picture?: string
  isGuest: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credential: string) => void
  loginAsGuest: (username: string) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Generate a simple guest token (not a real JWT, just for local storage)
function generateGuestToken(username: string): string {
  const guestData = {
    id: `guest_${username.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    name: username,
    isGuest: true,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }
  return `guest:${btoa(JSON.stringify(guestData))}`
}

function parseGuestToken(token: string): User | null {
  try {
    if (!token.startsWith('guest:')) return null
    const data = JSON.parse(atob(token.substring(6)))
    if (data.exp < Date.now()) return null
    return {
      id: data.id,
      name: data.name,
      isGuest: true
    }
  } catch {
    return null
  }
}

// Sync user with backend on login
async function syncUserToBackend(
  token: string,
  name: string,
  email?: string,
  picture?: string,
  isGuest: boolean = false
): Promise<void> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (isGuest) {
      // Guest user - use X-User-ID header
      const guestData = parseGuestToken(token)
      if (guestData) {
        headers['X-User-ID'] = guestData.id
      }
    } else {
      // Google user - use Authorization header
      headers['Authorization'] = `Bearer ${token}`
    }

    await fetch('/api/v1/users/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, picture })
    })
  } catch (error) {
    console.error('Failed to sync user with backend:', error)
    // Don't block login if sync fails
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      // Check if it's a guest token
      if (savedToken.startsWith('guest:')) {
        const guestUser = parseGuestToken(savedToken)
        if (guestUser) {
          setToken(savedToken)
          setUser(guestUser)
        } else {
          localStorage.removeItem('auth_token')
        }
      } else {
        // Try to decode as Google JWT
        try {
          const decoded = jwtDecode<GoogleUser>(savedToken)
          // Check if token is expired
          if (decoded.exp * 1000 > Date.now()) {
            setToken(savedToken)
            setUser({
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name,
              picture: decoded.picture,
              isGuest: false
            })
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch {
          localStorage.removeItem('auth_token')
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credential: string) => {
    try {
      const decoded = jwtDecode<GoogleUser>(credential)
      setToken(credential)
      setUser({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        isGuest: false
      })
      localStorage.setItem('auth_token', credential)

      // Sync user with backend
      await syncUserToBackend(
        credential,
        decoded.name,
        decoded.email,
        decoded.picture,
        false
      )
    } catch (error) {
      console.error('Failed to decode token:', error)
    }
  }

  const loginAsGuest = async (username: string) => {
    const guestToken = generateGuestToken(username)
    const guestUser = parseGuestToken(guestToken)
    if (guestUser) {
      setToken(guestToken)
      setUser(guestUser)
      localStorage.setItem('auth_token', guestToken)
      // Guest users are client-only sessions - not synced to backend
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      loginAsGuest,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
