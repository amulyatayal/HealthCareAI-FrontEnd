import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { getDomainQueryParam } from '../../utils/domainDetector'
import '../../styles/website.css'

interface WebsiteLayoutProps {
  children: React.ReactNode
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const domainQuery = getDomainQueryParam()

  const isActive = (path: string) => location.pathname === path
  
  // Helper to preserve domain query param in links
  const getLinkPath = (path: string) => `${path}${domainQuery}`

  return (
    <div className="website-container">
      <header className="website-header">
        <div className="website-header-content">
          <Link to={getLinkPath('/')} className="website-logo">
            <img 
              src="/founders/Anvega.AI - Logo.png" 
              alt="anvega.ai" 
              className="logo-image"
            />
          </Link>
          
          <nav className="website-nav">
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <ul className={`website-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              <li>
                <Link
                  to={getLinkPath('/')}
                  className={isActive('/') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={getLinkPath('/about')}
                  className={isActive('/about') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={getLinkPath('/services')}
                  className={isActive('/services') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to={getLinkPath('/team')}
                  className={isActive('/team') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to={getLinkPath('/contact')}
                  className={isActive('/contact') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="website-main">
        {children}
      </main>

      <footer className="website-footer">
        <div className="website-footer-content">
          <div className="footer-section">
            <h3>anvega.ai</h3>
            <p>AI solutions for healthcare transformation</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>
              <a href="mailto:sales@anvega.ai">sales@anvega.ai</a>
            </p>
            <p>
              <a href="mailto:support@anvega.ai">support@anvega.ai</a>
            </p>
            <p>
              <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to={getLinkPath('/about')}>About</Link>
            <Link to={getLinkPath('/services')}>Services</Link>
            <Link to={getLinkPath('/team')}>Team</Link>
            <Link to={getLinkPath('/contact')}>Contact</Link>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <Link to={getLinkPath('/privacy')}>Privacy Policy</Link>
            <Link to={getLinkPath('/terms')}>Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} anvega.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
