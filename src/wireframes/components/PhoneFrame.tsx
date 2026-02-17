import { ReactNode } from 'react'
import { CookieConsent } from '../../components/gdpr/CookieConsent'
import '../wireframes.css'

/**
 * A lightweight phone-frame wrapper that gives any page the same
 * centred mobile-device look used by the wireframe tabs — without
 * the header or bottom navigation.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="wireframe-viewport">
      <div className="wireframe-phone-frame">
        <div className="wireframe-container">
          <CookieConsent />
          {children}
        </div>
      </div>
    </div>
  )
}
