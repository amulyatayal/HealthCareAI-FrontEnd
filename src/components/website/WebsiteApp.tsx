import { Routes, Route } from 'react-router-dom'
import { WebsiteLayout } from './WebsiteLayout'
import { HomePage } from './HomePage'
import { AboutPage } from './AboutPage'
import { ServicesPage } from './ServicesPage'
import { FoundersPage } from './FoundersPage'
import { ContactPage } from './ContactPage'

export function WebsiteApp() {
  return (
    <WebsiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/founders" element={<FoundersPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </WebsiteLayout>
  )
}
