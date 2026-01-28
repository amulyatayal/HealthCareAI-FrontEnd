import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App'
import { WireframeApp } from './wireframes/WireframeApp'
import { WebsiteApp } from './components/website/WebsiteApp'
import { AuthProvider } from './contexts/AuthContext'
import { detectDomain } from './utils/domainDetector'
import './styles/index.css'

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

  // Default to Tara app
  return (
    <Routes>
      <Route path="/demo/*" element={<WireframeApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
