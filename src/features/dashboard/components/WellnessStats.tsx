import { TrendingUp } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import type { DashboardSummary } from '../types'

interface Props {
  dashboard: DashboardSummary
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
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          😊
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--wf-gray-800)' }}>{(dashboard.avg_mood ?? 0).toFixed(1)}</div>
          <div style={{ fontSize: '12px', color: 'var(--wf-gray-500)' }}>Avg Mood</div>
        </div>
      </WireframeCard>

      <WireframeCard style={statCardStyle}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <TrendingUp size={22} style={{ color: '#16a34a' }} />
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>
            {dashboard.trend_direction === 'down' ? '' : '+'}{dashboard.trend_percentage ?? 0}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--wf-gray-500)' }}>This week</div>
        </div>
      </WireframeCard>
    </div>
  )
}
