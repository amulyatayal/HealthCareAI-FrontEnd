import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'

interface Props {
  firstName: string
  streakDays: number
  basePath: string
}

export function HeroWelcome({ firstName, streakDays, basePath }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,'

  return (
    <WireframeCard className="wf-hero-card">
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '8px 0' }}>
        <div className="wf-decorative-circles">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
        </div>

        <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>{greeting}</p>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '4px 0 8px' }}>
          {firstName} 👋
        </h2>

        <div className="wf-streak-badge" style={{ marginBottom: '16px' }}>
          <span className="streak-fire">🔥</span>
          {streakDays} day streak!
        </div>

        <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
          How are you feeling today?
        </p>

        <Link to={`${basePath}/health/mood`} className="wf-btn wf-btn-primary">
          <Heart size={18} />
          Log Your Mood
        </Link>
      </div>
    </WireframeCard>
  )
}
