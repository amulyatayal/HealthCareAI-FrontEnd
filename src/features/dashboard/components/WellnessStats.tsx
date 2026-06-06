import { TrendingUp } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import type { DashboardSummary } from '../types'

interface Props {
  dashboard: DashboardSummary
}

export function HeroWellnessStats({ dashboard }: Props) {
  const trendPrefix = dashboard.trend_direction === 'down' ? '' : '+'

  return (
    <div className="wf-hero-stats">
      <div className="wf-hero-stat">
        <span className="wf-hero-stat-emoji" aria-hidden="true">😊</span>
        <span className="wf-hero-stat-value">{(dashboard.avg_mood ?? 0).toFixed(1)}</span>
        <span className="wf-hero-stat-label">Avg mood</span>
      </div>
      <div className="wf-hero-stat-divider" aria-hidden="true" />
      <div className="wf-hero-stat">
        <TrendingUp size={16} className="wf-hero-stat-icon trend" aria-hidden="true" />
        <span className="wf-hero-stat-value trend">
          {trendPrefix}{dashboard.trend_percentage ?? 0}%
        </span>
        <span className="wf-hero-stat-label">This week</span>
      </div>
    </div>
  )
}

const statCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
} as const

export function WellnessStats({ dashboard }: Props) {
  return (
    <div className="wf-grid-2">
      <WireframeCard style={statCardStyle}>
        <div className="wf-wellness-stat-icon mood">
          😊
        </div>
        <div>
          <div className="wf-wellness-stat-value">{(dashboard.avg_mood ?? 0).toFixed(1)}</div>
          <div className="wf-wellness-stat-label">Avg Mood</div>
        </div>
      </WireframeCard>

      <WireframeCard style={statCardStyle}>
        <div className="wf-wellness-stat-icon trend">
          <TrendingUp size={22} />
        </div>
        <div>
          <div className="wf-wellness-stat-value trend">
            {dashboard.trend_direction === 'down' ? '' : '+'}{dashboard.trend_percentage ?? 0}%
          </div>
          <div className="wf-wellness-stat-label">This week</div>
        </div>
      </WireframeCard>
    </div>
  )
}
