import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'
import { InlineDailyQuote } from './DailyQuote'
import { HeroWellnessStats } from './WellnessStats'
import type { DashboardSummary } from '../types'

interface Props {
  firstName: string
  streakDays: number
  basePath: string
  dashboard: DashboardSummary
}

export function HeroWelcome({ firstName, streakDays, basePath, dashboard }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,'

  return (
    <WireframeCard className="wf-hero-card">
      <div className="wf-hero-content">
        <div className="wf-decorative-circles">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
        </div>

        <p className="wf-hero-greeting">{greeting}</p>
        <h2 className="wf-hero-name">{firstName} 👋</h2>

        <div className="wf-streak-badge">
          <span className="streak-fire">🔥</span>
          {streakDays} day streak!
        </div>

        <HeroWellnessStats dashboard={dashboard} />

        <p className="wf-hero-prompt">How are you feeling today?</p>

        <Link to={`${basePath}/health/mood`} className="wf-btn wf-btn-primary">
          <Heart size={18} />
          Log Your Mood
        </Link>

        {dashboard.daily_quote && <InlineDailyQuote quote={dashboard.daily_quote} />}
      </div>
    </WireframeCard>
  )
}
