import React from 'react'
import { TrendingUp } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import type { DashboardSummary } from '../types'

interface Props {
  dashboard: DashboardSummary
}

export function WellnessStats({ dashboard }: Props) {
  return (
    <div className="wf-grid-2">
      <WireframeCard style={{ textAlign: 'center', padding: '20px 12px' }}>
        <div className="wf-score-ring" style={{ '--score': dashboard.wellness_score ?? 0 } as React.CSSProperties}>
          <div className="ring-inner">
            <span className="score-value">{dashboard.wellness_score ?? 0}</span>
            <span className="score-label">Score</span>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--wf-gray-500)', marginTop: '8px' }}>Wellness</p>
      </WireframeCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <WireframeCard style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
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

        <WireframeCard style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
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
    </div>
  )
}
