import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const navigate = useNavigate()
  const pathwayResourcesAnchorRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const dashboard = useDashboardData()
  const { resourceCategories, hasStageSelected } = usePathwayResources()

  useEffect(() => {
    const state = location.state as { scrollToPathwayResources?: boolean } | undefined
    if (!state?.scrollToPathwayResources) return

    const t = window.setTimeout(() => {
      pathwayResourcesAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: {} })
    }, 0)
    return () => clearTimeout(t)
  }, [location.state, location.pathname, location.search, navigate])

  return (
    <WireframeLayout>
      <HeroWelcome firstName={firstName} streakDays={dashboard.streak_days} basePath={basePath} />
      <WellnessStats dashboard={dashboard} />
      {dashboard.daily_quote && <DailyQuote quote={dashboard.daily_quote} />}
      <Notifications />
      <UpcomingAppointments basePath={basePath} />
      <div ref={pathwayResourcesAnchorRef} id="pathway-resources">
        <PathwayResources categories={resourceCategories} hasStageSelected={hasStageSelected} basePath={basePath} />
      </div>
      <QuickActions basePath={basePath} />
      <CommunityActivity />
      <ClinicalTrials />
    </WireframeLayout>
  )
}
