import { useState, useEffect } from 'react'
import { Smile, Sparkles, Activity, Timer, ChevronRight, TrendingUp, TrendingDown, Minus, Heart, Flame, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { getMoodHistory, getDashboardSummary } from '../../services/api'
import type { MoodEntry } from '../../services/api'

const MOOD_EMOJIS: Record<number, string> = {
  1: '😢', 2: '😔', 3: '😕', 4: '😐', 5: '🙂',
  6: '😊', 7: '😄', 8: '😁', 9: '🤩', 10: '🥳',
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getHeroContent(avg: number | null) {
  if (avg == null) return { emoji: '👋', message: "Let's Get Started!", subtext: 'Log your first mood to see insights' }
  if (avg >= 8) return { emoji: '🤩', message: "You're Doing Great!", subtext: null }
  if (avg >= 6) return { emoji: '😊', message: 'Keep It Up!', subtext: null }
  if (avg >= 4) return { emoji: '🙂', message: 'Hang In There', subtext: null }
  return { emoji: '💪', message: "We're Here For You", subtext: null }
}

function getLast7Days(): Date[] {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return d
  })
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function HealthHub() {
  const base = useBasePath()

  const [loading, setLoading] = useState(true)
  const [last7Dates] = useState(() => getLast7Days())
  const [weekMoods, setWeekMoods] = useState<(number | null)[]>(Array(7).fill(null))
  const [totalEntries, setTotalEntries] = useState(0)
  const [avgMood, setAvgMood] = useState<number | null>(null)
  const [trendDir, setTrendDir] = useState<'up' | 'down' | 'stable'>('stable')
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const last7 = getLast7Days()
      const weekKeys = last7.map(toDateKey)

      try {
        const [moodData, dashData] = await Promise.allSettled([
          getMoodHistory(30),
          getDashboardSummary(),
        ])

        if (cancelled) return

        if (moodData.status === 'fulfilled') {
          const entries: MoodEntry[] = moodData.value.entries ?? []
          const entryByDate = new Map<string, number>()
          for (const e of entries) {
            const key = toDateKey(new Date(e.timestamp))
            if (!entryByDate.has(key)) entryByDate.set(key, e.mood_score)
          }
          setWeekMoods(weekKeys.map((k) => entryByDate.get(k) ?? null))
          setTotalEntries(moodData.value.total_count ?? entries.length)
          setAvgMood(moodData.value.avg_mood ?? null)
          setTrendDir(moodData.value.trend_direction ?? 'stable')
        }

        if (dashData.status === 'fulfilled') {
          setStreakDays(dashData.value.streak_days ?? 0)
        }
      } catch (err) {
        console.info('[HealthHub] APIs unavailable, showing empty state', err)
      }

      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const hero = getHeroContent(avgMood)

  const features = [
    { icon: Smile, title: 'Basic Mood Diary', subtitle: 'Quick 0-10 mood tracking', to: `${base}/health/mood`, iconColor: 'amber', priority: 'P0' },
    { icon: Sparkles, title: 'Advanced Mood Diary', subtitle: 'Detailed emotions and patterns', to: `${base}/health/mood-advanced`, iconColor: 'purple', priority: 'P1' },
    { icon: Activity, title: 'Symptom Tracker', subtitle: 'Log and monitor symptoms', to: `${base}/health/symptoms`, iconColor: 'blue', priority: 'P1' },
    { icon: Timer, title: 'Physical Tests and Wearable Integration', subtitle: '1 Mile, Sit-to-Stand, Balance, device sync', to: `${base}/health/tests`, iconColor: 'green', priority: 'P1' },
    { icon: ClipboardList, title: 'PROM Questionnaire', subtitle: 'Patient-reported outcome questionnaire', to: `${base}/health/prom/breast-satisfaction`, iconColor: 'pink', priority: 'P1' },
  ]

  const iconStyles: Record<string, React.CSSProperties> = {
    amber: { background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#f59e0b' },
    purple: { background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)', color: '#a855f7' },
    blue: { background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#3b82f6' },
    green: { background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', color: '#22c55e' },
    pink: { background: 'linear-gradient(135deg, #ffe4e6, #fecdd3)', color: '#e11d48' },
  }

  const TrendIcon = trendDir === 'up' ? TrendingUp : trendDir === 'down' ? TrendingDown : Minus
  const trendColor = trendDir === 'up' ? '#22c55e' : trendDir === 'down' ? '#ef4444' : '#a3a3a3'

  if (loading) {
    return (
      <WireframeLayout>
        <WireframeCard className="wf-hero-card" style={{ marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--wf-gray-100)', margin: '0 auto 12px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{ height: '18px', width: '180px', background: 'var(--wf-gray-100)', borderRadius: '8px', margin: '0 auto 8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: '14px', width: '220px', background: 'var(--wf-gray-100)', borderRadius: '8px', margin: '0 auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        </WireframeCard>
        <WireframeCard style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {last7Dates.map((date, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--wf-gray-100)', margin: '0 auto 6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: '11px', color: 'var(--wf-gray-400)' }}>{i === 6 ? 'Today' : SHORT_DAYS[date.getDay()]}</span>
              </div>
            ))}
          </div>
        </WireframeCard>
        <div className="wf-grid-3" style={{ marginBottom: '20px' }}>
          {[1, 2, 3].map((n) => (
            <WireframeCard key={n} style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ height: '24px', width: '40px', background: 'var(--wf-gray-100)', borderRadius: '6px', margin: '0 auto 4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: '12px', width: '50px', background: 'var(--wf-gray-100)', borderRadius: '4px', margin: '0 auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </WireframeCard>
          ))}
        </div>
      </WireframeLayout>
    )
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
            {hero.emoji}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '0 0 4px' }}>
            {hero.message}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', margin: '0 0 12px' }}>
            {hero.subtext ?? (
              <>Your average mood is <strong style={{ color: 'var(--wf-rose-500)' }}>{avgMood?.toFixed(1) ?? '--'}</strong> this week</>
            )}
          </p>
          
          {streakDays > 0 && (
            <div className="wf-streak-badge">
              <Flame size={16} />
              {streakDays} day streak!
            </div>
          )}
        </div>
      </WireframeCard>

      {/* Weekly Overview */}
      <WireframeCard title="Last 7 Days" className="wf-card-accent">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginBottom: '16px' }}>
          {last7Dates.map((date, i) => {
            const mood = weekMoods[i]
            const isToday = i === 6
            const label = isToday ? 'Today' : SHORT_DAYS[date.getDay()]
            const dateNum = date.getDate()
            return (
              <div key={i} style={{ textAlign: 'center', flex: 1 }}>
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
                  {mood ? MOOD_EMOJIS[mood] ?? '🙂' : '?'}
                </div>
                <span style={{ 
                  fontSize: '11px', 
                  color: isToday ? 'var(--wf-rose-500)' : 'var(--wf-gray-500)',
                  fontWeight: isToday ? 600 : 400,
                  lineHeight: '1.2',
                  display: 'block',
                }}>
                  {label}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: 'var(--wf-gray-400)',
                  lineHeight: '1.2',
                }}>
                  {dateNum}
                </span>
              </div>
            )
          })}
        </div>
        <Link 
          to={`${base}/health/mood`} 
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
          }}>{totalEntries}</div>
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
            {avgMood != null ? avgMood.toFixed(1) : '--'}
            <TrendIcon size={16} style={{ color: trendColor }} />
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
            {streakDays}
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
