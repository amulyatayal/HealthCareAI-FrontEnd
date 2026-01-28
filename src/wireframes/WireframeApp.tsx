import { Routes, Route } from 'react-router-dom'
import './wireframes.css'

// Pages
import { DashboardPage } from './pages/DashboardPage'
import { CommunityChatPage } from './pages/CommunityChatPage'
import { BasicMoodPage } from './pages/BasicMoodPage'
import { BuddyPage } from './pages/BuddyPage'
import { EventsPage } from './pages/EventsPage'
import { CharitiesPage } from './pages/CharitiesPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { AdvancedMoodPage } from './pages/AdvancedMoodPage'
import { SymptomsPage } from './pages/SymptomsPage'
import { TestsPage } from './pages/TestsPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { CommunityHub } from './pages/CommunityHub'
import { HealthHub } from './pages/HealthHub'
import { ProfilePage } from './pages/ProfilePage'

export function WireframeApp() {
  return (
    <Routes>
      {/* Main tabs */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/community" element={<CommunityHub />} />
      <Route path="/health" element={<HealthHub />} />
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* Community features */}
      <Route path="/community/chat" element={<CommunityChatPage />} />
      <Route path="/community/chat/:roomId" element={<CommunityChatPage />} />
      <Route path="/community/buddy" element={<BuddyPage />} />
      <Route path="/community/events" element={<EventsPage />} />
      <Route path="/community/charities" element={<CharitiesPage />} />
      <Route path="/community/marketplace" element={<MarketplacePage />} />
      
      {/* Health features */}
      <Route path="/health/mood" element={<BasicMoodPage />} />
      <Route path="/health/mood-advanced" element={<AdvancedMoodPage />} />
      <Route path="/health/symptoms" element={<SymptomsPage />} />
      <Route path="/health/tests" element={<TestsPage />} />
      
      {/* Profile features */}
      <Route path="/profile/documents" element={<DocumentsPage />} />
      <Route path="/profile/appointments" element={<AppointmentsPage />} />
    </Routes>
  )
}
