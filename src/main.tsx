import React, { Component, ErrorInfo, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App'
import { ProductApp } from './ProductApp'
import { WireframeApp } from './wireframes/WireframeApp'
import { WebsiteApp } from './components/website/WebsiteApp'
import { PrivacyPolicy } from './components/legal/PrivacyPolicy'
import { TermsOfService } from './components/legal/TermsOfService'

import { LogoutRoute } from './components/LogoutRoute'
import { AuthProvider } from './contexts/AuthContext'
import { detectDomain } from './utils/domainDetector'
import { useEffect } from 'react'
import './styles/index.css'

const FAVICON_ANVEGA = '/favicon.png'
const FAVICON_TARA = '/heart.svg'

/**
 * Top-level error boundary so crashes are visible instead of showing a blank screen.
 */
class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' }}>
          <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ background: '#fef2f2', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, color: '#991b1b' }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/' }}
            style={{ marginTop: 16, padding: '10px 24px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
          >
            Clear data &amp; reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Set favicon based on domain so mytara shows heart, anvega shows anvega icon
function FaviconSwitcher() {
  const location = useLocation()
  const domain = detectDomain()
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) {
      link.href = domain === 'anvega' ? FAVICON_ANVEGA : FAVICON_TARA
      link.type = domain === 'anvega' ? 'image/png' : 'image/svg+xml'
    }
  }, [domain, location.search])
  return null
}

// Component that conditionally renders based on domain
function AppRouter() {
  const location = useLocation()
  const domain = detectDomain()

  // Always prioritize /demo routes - show WireframeApp regardless of domain
  if (location.pathname.startsWith('/demo')) {
    return (
      <Routes>
        <Route path="/demo/*" element={<WireframeApp />} />
      </Routes>
    )
  }

  // Show website if domain is anvega (but not for /demo)
  if (domain === 'anvega') {
    return (
      <Routes>
        <Route path="/*" element={<WebsiteApp />} />
      </Routes>
    )
  }

  // Default to Tara app (full product with wireframe tabs)
  return (
    <Routes>
      <Route path="/demo/*" element={<WireframeApp />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/logout" element={<LogoutRoute />} />
      <Route path="/legacy/*" element={<App />} />
      <Route path="/*" element={<ProductApp />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <FaviconSwitcher />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)
