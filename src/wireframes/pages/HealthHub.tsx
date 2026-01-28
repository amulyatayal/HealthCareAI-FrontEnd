import { Smile, Sparkles, Activity, Timer, ChevronRight, TrendingUp, Heart, Flame } from 'lucide-react'
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
      iconColor: 'amber',
      priority: 'P0'
    },
    {
      icon: Sparkles,
      title: 'Advanced Mood Diary',
      subtitle: 'Detailed emotions and patterns',
      to: '/demo/health/mood-advanced',
      iconColor: 'purple',
      priority: 'P1'
    },
    {
      icon: Activity,
      title: 'Symptom Tracker',
      subtitle: 'Log and monitor symptoms',
      to: '/demo/health/symptoms',
      iconColor: 'blue',
      priority: 'P1'
    },
    {
      icon: Timer,
      title: 'Physical Tests',
      subtitle: '1 Mile, Sit-to-Stand, Balance',
      to: '/demo/health/tests',
      iconColor: 'green',
      priority: 'P1'
    },
  ]

  const iconStyles: Record<string, React.CSSProperties> = {
    amber: { background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#f59e0b' },
    purple: { background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)', color: '#a855f7' },
    blue: { background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#3b82f6' },
    green: { background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', color: '#22c55e' },
  }

  // Weekly mood summary with emoji mapping
  const weekMoods = [7, 6, 8, 7, 9, 8, null] // null = today
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const moodEmojis: Record<number, string> = {
    1: '😢', 2: '😔', 3: '😕', 4: '😐', 5: '🙂',
    6: '😊', 7: '😄', 8: '😁', 9: '🤩', 10: '🥳'
  }

  return (
    <WireframeLayout>
      {/* Hero Section */}
      <WireframeCard className="wf-hero-card" style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '8px 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '32px',
            boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)',
          }}>
            😊
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '0 0 4px' }}>
            You're Doing Great!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', margin: '0 0 12px' }}>
            Your average mood is <strong style={{ color: 'var(--wf-rose-500)' }}>7.8</strong> this week
          </p>
          
          {/* Streak Badge */}
          <div className="wf-streak-badge">
            <Flame size={16} />
            12 day streak!
          </div>
        </div>
      </WireframeCard>

      {/* Weekly Overview */}
      <WireframeCard title="This Week's Mood" className="wf-card-accent">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginBottom: '16px' }}>
          {days.map((day, i) => {
            const mood = weekMoods[i]
            const isToday = i === 6
            return (
              <div key={day} style={{ textAlign: 'center', flex: 1 }}>
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: mood 
                      ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                      : isToday 
                        ? 'linear-gradient(135deg, var(--wf-rose-100), var(--wf-rose-200))'
                        : 'var(--wf-gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: mood ? '20px' : '14px',
                    margin: '0 auto 6px',
                    boxShadow: mood ? '0 2px 8px rgba(251, 191, 36, 0.2)' : 'none',
                    border: isToday && !mood ? '2px dashed var(--wf-rose-300)' : 'none',
                    color: 'var(--wf-gray-400)',
                  }}
                >
                  {mood ? moodEmojis[mood] : isToday ? '?' : '–'}
                </div>
                <span style={{ 
                  fontSize: '11px', 
                  color: isToday ? 'var(--wf-rose-500)' : 'var(--wf-gray-500)',
                  fontWeight: isToday ? 600 : 400,
                }}>
                  {isToday ? 'Today' : day}
                </span>
              </div>
            )
          })}
        </div>
        <Link 
          to="/demo/health/mood" 
          className="wf-btn wf-btn-primary wf-btn-full"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Heart size={18} />
          Log Today's Mood
        </Link>
      </WireframeCard>

      {/* Quick Stats */}
      <div className="wf-grid-3" style={{ marginBottom: '20px' }}>
        <WireframeCard style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, var(--wf-rose-500), #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>28</div>
          <div style={{ fontSize: '11px', color: 'var(--wf-gray-500)', marginTop: '2px' }}>Entries</div>
        </WireframeCard>
        <WireframeCard style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}>
            7.8 
            <TrendingUp size={16} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--wf-gray-500)', marginTop: '2px' }}>Avg Mood</div>
        </WireframeCard>
        <WireframeCard style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#f97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}>
            12
            <span style={{ fontSize: '16px' }}>🔥</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--wf-gray-500)', marginTop: '2px' }}>Day Streak</div>
        </WireframeCard>
      </div>

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
          <WireframeCard style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                ...iconStyles[feature.iconColor],
              }}>
                <feature.icon size={24} />
              </div>
              <div className="wf-list-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wf-gray-800)' }}>
                    {feature.title}
                  </span>
                  {feature.priority === 'P0' && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      color: 'white',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}>
                      Daily
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>{feature.subtitle}</div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--wf-gray-300)' }} />
            </div>
          </WireframeCard>
        </Link>
      ))}
    </WireframeLayout>
  )
}
