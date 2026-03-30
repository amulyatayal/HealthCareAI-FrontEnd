import { WireframeLayout } from '../../wireframes/WireframeLayout'
import { useBasePath } from '../../wireframes/hooks/useBasePath'
import { useAuth } from '../../contexts/AuthContext'
import { useDashboardData } from './hooks/useDashboardData'
import { usePathwayResources } from './hooks/usePathwayResources'
import { HeroWelcome } from './components/HeroWelcome'
import { WellnessStats } from './components/WellnessStats'
import { DailyQuote } from './components/DailyQuote'
import { Notifications } from './components/Notifications'
import { UpcomingAppointments } from './components/UpcomingAppointments'
import { PathwayResources } from './components/PathwayResources'
import { ClinicalTrials } from './components/ClinicalTrials'
import { QuickActions } from './components/QuickActions'
import { CommunityActivity } from './components/CommunityActivity'

export function DashboardPage() {
  const basePath = useBasePath()
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const dashboard = useDashboardData()
  const { resourceCategories, hasStageSelected } = usePathwayResources()

  return (
    <WireframeLayout>
      <HeroWelcome firstName={firstName} streakDays={dashboard.streak_days} basePath={basePath} />
      <WellnessStats dashboard={dashboard} />
      {dashboard.daily_quote && <DailyQuote quote={dashboard.daily_quote} />}
      <Notifications />
      <UpcomingAppointments basePath={basePath} />
      <PathwayResources categories={resourceCategories} hasStageSelected={hasStageSelected} basePath={basePath} />
      <ClinicalTrials />
      <QuickActions basePath={basePath} />
      <CommunityActivity basePath={basePath} />
    </WireframeLayout>
  )
}
