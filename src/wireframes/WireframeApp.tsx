import { Routes, Route } from 'react-router-dom'
import './wireframes.css'

// Pages
import { DashboardPage } from './pages/DashboardPage'
import { ChatPage } from './pages/ChatPage'
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
import { StageSelectorPage } from './pages/StageSelectorPage'
import { ShareDataPage } from './pages/ShareDataPage'
import { ClinicalTeamPage } from './pages/ClinicalTeamPage'
import { WatchVideoPage } from './pages/WatchVideoPage'
import { GuestGate } from './components/GuestGate'

export function WireframeApp() {
  return (
    <div className="wireframe-viewport">
      <Routes>
      {/* Main tabs — open to all users */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/community" element={<CommunityHub />} />
      <Route path="/health" element={<HealthHub />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/watch" element={<WatchVideoPage />} />

      {/* Guest-gated: health features */}
      <Route path="/health/mood" element={<GuestGate featureName="mood tracking"><BasicMoodPage /></GuestGate>} />
      <Route path="/health/mood-advanced" element={<GuestGate featureName="mood tracking"><AdvancedMoodPage /></GuestGate>} />
      <Route path="/health/symptoms" element={<GuestGate featureName="symptom tracking"><SymptomsPage /></GuestGate>} />
      <Route path="/health/tests" element={<GuestGate featureName="physical tests"><TestsPage /></GuestGate>} />

      {/* Guest-gated: profile features */}
      <Route path="/profile/documents" element={<GuestGate featureName="document storage"><DocumentsPage /></GuestGate>} />
      <Route path="/profile/appointments" element={<GuestGate featureName="appointments"><AppointmentsPage /></GuestGate>} />
      <Route path="/profile/stage" element={<StageSelectorPage />} />
      <Route path="/profile/share" element={<GuestGate featureName="data sharing"><ShareDataPage /></GuestGate>} />

      {/* Guest-gated: clinical team */}
      <Route path="/team" element={<GuestGate featureName="clinical team"><ClinicalTeamPage /></GuestGate>} />
      
      {/* Community features — open to all */}
      <Route path="/community/chat" element={<CommunityChatPage />} />
      <Route path="/community/chat/:roomId" element={<CommunityChatPage />} />
      <Route path="/community/buddy" element={<BuddyPage />} />
      <Route path="/community/events" element={<EventsPage />} />
      <Route path="/community/charities" element={<CharitiesPage />} />
      <Route path="/community/marketplace" element={<MarketplacePage />} />
      </Routes>
    </div>
  )
}
