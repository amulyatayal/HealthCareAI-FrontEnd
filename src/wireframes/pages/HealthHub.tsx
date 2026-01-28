import { Smile, Sparkles, Activity, Timer, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

export function HealthHub() {
  const features = [
    {
      icon: Smile,
      title: 'Basic Mood Diary',
      subtitle: 'Quick 0-10 mood tracking',
      to: '/demo/health/mood',
      priority: 'P0'
    },
    {
      icon: Sparkles,
      title: 'Advanced Mood Diary',
      subtitle: 'Detailed emotions and patterns',
      to: '/demo/health/mood-advanced',
      priority: 'P1'
    },
    {
      icon: Activity,
      title: 'Symptom Tracker',
      subtitle: 'Log and monitor symptoms',
      to: '/demo/health/symptoms',
      priority: 'P1'
    },
    {
      icon: Timer,
      title: 'Physical Tests',
      subtitle: '1 Mile, Sit-to-Stand, Balance',
      to: '/demo/health/tests',
      priority: 'P1'
    },
  ]

  // Weekly mood summary
  const weekMoods = [7, 6, 8, 7, 9, 8, null] // null = today
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <WireframeLayout title="Health">
      {/* Weekly Overview */}
      <WireframeCard title="This Week's Mood">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {days.map((day, i) => (
            <div key={day} style={{ textAlign: 'center' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: weekMoods[i] 
                    ? `linear-gradient(135deg, var(--wf-rose-${Math.min(500, 200 + weekMoods[i] * 30)}), var(--wf-rose-${Math.min(600, 300 + weekMoods[i] * 30)}))` 
                    : 'var(--wf-gray-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: weekMoods[i] ? 'white' : 'var(--wf-gray-400)',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 auto 4px'
                }}
              >
                {weekMoods[i] ?? '?'}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--wf-gray-500)' }}>{day}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/demo/health/mood" className="wf-btn wf-btn-primary wf-btn-sm">
            Log Today's Mood
          </Link>
        </div>
      </WireframeCard>

      {/* Feature List */}
      <div className="wf-section-header">
        <span className="wf-section-title">Health Tracking</span>
      </div>

      {features.map((feature) => (
        <Link 
          key={feature.title} 
          to={feature.to} 
          style={{ textDecoration: 'none' }}
        >
          <WireframeCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="wf-list-avatar">
                <feature.icon size={22} />
              </div>
              <div className="wf-list-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="wf-list-title">{feature.title}</span>
                  {feature.priority === 'P0' && (
                    <span className="wf-badge wf-badge-primary">Core</span>
                  )}
                </div>
                <div className="wf-list-subtitle">{feature.subtitle}</div>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
            </div>
          </WireframeCard>
        </Link>
      ))}

      {/* Quick Stats */}
      <div className="wf-section-header" style={{ marginTop: '24px' }}>
        <span className="wf-section-title">Your Stats</span>
      </div>
      
      <div className="wf-grid-3">
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>28</div>
          <div className="wf-stat-label">Entries</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>7.8</div>
          <div className="wf-stat-label">Avg Mood</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>12</div>
          <div className="wf-stat-label">Day Streak</div>
        </WireframeCard>
      </div>
    </WireframeLayout>
  )
}
