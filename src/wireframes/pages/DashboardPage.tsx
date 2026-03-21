import { useState, useEffect } from 'react'
import { Calendar, MessageCircle, Heart, TrendingUp, Bell, ChevronRight, ChevronDown, Flame, Sparkles, FileText, UtensilsCrossed, Brain, Video, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { youtubeToEmbedUrl } from '../utils/youtubeEmbed'
import { useAuth } from '../../contexts/AuthContext'
import type { PatientResource } from '../../services/api'

interface ResourceCategory {
  id: string
  title: string
  iconBg: string
  iconColor: string
  Icon: typeof Video | typeof FileText | typeof Brain | typeof UtensilsCrossed | typeof ExternalLink
  links: { label: string; url: string; type: 'video' | 'pdf' | 'link' }[]
}

const ICON_ROTATION: { Icon: typeof Video | typeof FileText | typeof Brain | typeof UtensilsCrossed | typeof ExternalLink; bg: string; color: string }[] = [
  { Icon: Video, bg: 'linear-gradient(135deg, #dbeafe, #eff6ff)', color: '#2563eb' },
  { Icon: FileText, bg: 'linear-gradient(135deg, #fef3c7, #fffbeb)', color: '#d97706' },
  { Icon: Brain, bg: 'linear-gradient(135deg, #f3e8ff, #faf5ff)', color: '#9333ea' },
  { Icon: UtensilsCrossed, bg: 'linear-gradient(135deg, #dcfce7, #f0fdf4)', color: '#16a34a' },
  { Icon: ExternalLink, bg: 'linear-gradient(135deg, #fce7f3, #fdf2f8)', color: '#db2777' },
]

const FALLBACK_CATEGORIES: ResourceCategory[] = [
  {
    id: 'procedure',
    title: 'Information about procedure',
    iconBg: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
    iconColor: '#2563eb',
    Icon: Video,
    links: [
      { label: 'Information on the procedure (video)', url: 'https://youtu.be/zeMr6XaoTEM?si=KUcwJsQ7WsNBY_cr', type: 'video' as const },
      { label: 'Barts chest wall perforator flap PIF (PDF)', url: 'https://drive.google.com/file/d/1TcJlT72dojrOCe8Z3OIxsfTSga4-tYF_/view?usp=drive_link', type: 'pdf' as const },
    ],
  },
  {
    id: 'exercises',
    title: 'Exercises',
    iconBg: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
    iconColor: '#d97706',
    Icon: FileText,
    links: [
      { label: 'Exercises after breast cancer surgery (PDF)', url: 'https://breastcancernow.org/media-assets/dmbpk1rz/bcc6-excercises-after-breast-cancer-surgery-web-pdf.pdf', type: 'pdf' as const },
      { label: 'Exercise (short video)', url: 'https://www.youtube.com/shorts/haDyGVRpQzo', type: 'video' as const },
    ],
  },
  {
    id: 'mental-health',
    title: 'Mental health',
    iconBg: 'linear-gradient(135deg, #f3e8ff, #faf5ff)',
    iconColor: '#9333ea',
    Icon: Brain,
    links: [
      { label: 'Mental health (video)', url: 'https://www.youtube.com/watch?v=AKCmdHN9JX8', type: 'video' as const },
      { label: 'Body image (Macmillan)', url: 'https://cdn.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/791-source/body-image-mac14192', type: 'link' as const },
    ],
  },
  {
    id: 'diet',
    title: 'Diet',
    iconBg: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
    iconColor: '#16a34a',
    Icon: UtensilsCrossed,
    links: [
      { label: 'Diet (PDF leaflet)', url: 'https://sthk.merseywestlancs.nhs.uk/media/.leaflets/606ec25be26520.16511553.pdf', type: 'pdf' as const },
    ],
  },
]

function patientResourcesToCategories(resources: PatientResource[]): ResourceCategory[] {
  const grouped = new Map<string, PatientResource[]>()
  for (const r of resources) {
    const key = r.description || 'Resources'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(r)
  }
  const categories: ResourceCategory[] = []
  let i = 0
  for (const [desc, items] of grouped) {
    const style = ICON_ROTATION[i % ICON_ROTATION.length]
    categories.push({
      id: `dynamic-${i}`,
      title: desc,
      iconBg: style.bg,
      iconColor: style.color,
      Icon: style.Icon,
      links: items.map((r) => ({ label: r.title, url: r.url, type: r.type })),
    })
    i++
  }
  return categories
}

function getPatientStageIds(): string[] {
  try {
    const raw = localStorage.getItem('patient_stage_path')
    if (raw) return JSON.parse(raw) as string[]
  } catch { /* ignore */ }
  return []
}

// Default mock data for offline / pre-backend usage
const MOCK_DASHBOARD: {
  wellness_score: number;
  streak_days: number;
  avg_mood: number;
  trend_direction: 'up' | 'down' | 'stable';
  trend_percentage: number;
  next_appointment: { id: string; title: string; clinician_name: string; specialty: string; date: string; time: string; location: string; reminder_set: boolean } | null;
  daily_quote: { text: string; author: string } | null;
} = {
  wellness_score: 78,
  streak_days: 7,
  avg_mood: 8.2,
  trend_direction: 'up',
  trend_percentage: 15,
  next_appointment: {
    id: '1',
    title: 'Dr. Thompson - Oncology',
    clinician_name: 'Dr. Thompson',
    specialty: 'Oncology',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '10:30 AM',
    location: 'City Hospital, Room 302',
    reminder_set: true,
  },
  daily_quote: {
    text: 'Every day may not be good, but there is something good in every day.',
    author: 'Alice Morse Earle',
  },
}

export function DashboardPage() {
  const base = useBasePath()
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState(MOCK_DASHBOARD)
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>(FALLBACK_CATEGORIES)
  const [patientStageIds, setPatientStageIds] = useState<string[]>(getPatientStageIds)
  const hasStageSelected = patientStageIds.length > 0

  // Re-read the stage from localStorage whenever the component mounts or the user navigates back
  useEffect(() => {
    setPatientStageIds(getPatientStageIds())
  }, [])

  // Also re-check on window focus (user may have changed stage in another tab or returned from stage selector)
  useEffect(() => {
    function handleFocus() {
      setPatientStageIds(getPatientStageIds())
    }
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleFocus)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { getDashboardSummary } = await import('../../services/api')
        const data = await getDashboardSummary()
        if (!cancelled) setDashboard(data)
      } catch {
        // API not available yet – keep mock data
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const stageKey = patientStageIds.join(',')
  useEffect(() => {
    if (!hasStageSelected) {
      setResourceCategories(FALLBACK_CATEGORIES)
      return
    }
    let cancelled = false
    const leafStageId = patientStageIds[patientStageIds.length - 1]

    // Demo resource data -- used when no backend and no admin-saved resources in localStorage.
    // This mirrors the data a clinician would enter via the admin portal.
    const DEMO_ADMIN_RESOURCES = [
      {
        pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.1.1', '2.1.1.2', '2.1.1.2.1', '2.1.1.2.2', '2.1.2', '2.1.2.1', '2.1.2.2', '2.1.2.2.1', '2.1.2.2.2'],
        description: 'Information about your surgery',
        intents: ['surgery_procedures', 'post_surgery_recovery'],
        resources: [
          { title: 'Information on the procedure (video)', url: 'https://youtu.be/zeMr6XaoTEM?si=KUcwJsQ7WsNBY_cr', type: 'video' as const },
          { title: 'Barts chest wall perforator flap PIF (PDF)', url: 'https://drive.google.com/file/d/1TcJlT72dojrOCe8Z3OIxsfTSga4-tYF_/view?usp=drive_link', type: 'pdf' as const },
        ],
      },
      {
        pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.1.1', '2.1.1.2', '2.1.2', '2.1.2.1', '2.1.2.2', '5', '5.1', '5.2', '6', '7', '8'],
        description: 'Exercises after surgery',
        intents: ['exercise', 'post_surgery_recovery'],
        resources: [
          { title: 'Exercises after breast cancer surgery (PDF)', url: 'https://breastcancernow.org/media-assets/dmbpk1rz/bcc6-excercises-after-breast-cancer-surgery-web-pdf.pdf', type: 'pdf' as const },
          { title: 'Exercise (short video)', url: 'https://www.youtube.com/shorts/haDyGVRpQzo', type: 'video' as const },
        ],
      },
      {
        pathway_stage_ids: ['0', '1', '1.1', '1.2', '1.3', '2', '3', '4', '5', '5.1', '5.2', '6', '7', '8', '9', '10'],
        description: 'Mental health & wellbeing',
        intents: ['emotional_support'],
        resources: [
          { title: 'Mental health (video)', url: 'https://www.youtube.com/watch?v=AKCmdHN9JX8', type: 'video' as const },
          { title: 'Body image (Macmillan)', url: 'https://cdn.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/791-source/body-image-mac14192', type: 'link' as const },
        ],
      },
      {
        pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.2', '3', '5', '5.1', '5.2', '6', '7', '8', '9', '10'],
        description: 'Diet & nutrition',
        intents: ['nutrition'],
        resources: [
          { title: 'Diet (PDF leaflet)', url: 'https://sthk.merseywestlancs.nhs.uk/media/.leaflets/606ec25be26520.16511553.pdf', type: 'pdf' as const },
        ],
      },
    ]

    function matchResources(adminItems: typeof DEMO_ADMIN_RESOURCES): PatientResource[] {
      const matched: PatientResource[] = []
      for (const item of adminItems) {
        if (patientStageIds.some((id) => item.pathway_stage_ids.includes(id))) {
          for (const r of item.resources) {
            matched.push({
              title: r.title,
              description: item.description,
              url: r.url,
              type: r.type,
              intents: item.intents,
            })
          }
        }
      }
      return matched
    }

    async function loadResources() {
      // Try backend first
      try {
        const { getResourcesForStage } = await import('../../services/api')
        const data = await getResourcesForStage(leafStageId)
        if (!cancelled && data.resources.length > 0) {
          setResourceCategories(patientResourcesToCategories(data.resources))
          return
        }
      } catch { /* backend not available */ }

      if (cancelled) return

      // Fall back to locally-stored admin resources (saved from admin portal)
      try {
        const adminDataRaw = localStorage.getItem('admin_pathway_resources')
        if (adminDataRaw) {
          const adminItems = JSON.parse(adminDataRaw)
          const matched = matchResources(adminItems)
          if (matched.length > 0) {
            setResourceCategories(patientResourcesToCategories(matched))
            return
          }
        }
      } catch { /* ignore */ }

      if (cancelled) return

      // Fall back to built-in demo data (stage-aware matching)
      const matched = matchResources(DEMO_ADMIN_RESOURCES)
      if (matched.length > 0) {
        setResourceCategories(patientResourcesToCategories(matched))
      } else {
        setResourceCategories(FALLBACK_CATEGORIES)
      }
    }

    loadResources()
    return () => { cancelled = true }
  }, [stageKey])

  return (
    <WireframeLayout>
      {/* Hero Welcome Section */}
      <WireframeCard className="wf-hero-card">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '8px 0' }}>
          {/* Decorative circles */}
          <div className="wf-decorative-circles">
            <div className="circle circle-1" />
            <div className="circle circle-2" />
            <div className="circle circle-3" />
          </div>
          
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>
            {new Date().getHours() < 12 ? 'Good morning,' : new Date().getHours() < 17 ? 'Good afternoon,' : 'Good evening,'}
          </p>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '4px 0 8px' }}>
            {firstName} 👋
          </h2>
          
          {/* Streak Badge */}
          <div className="wf-streak-badge" style={{ marginBottom: '16px' }}>
            <span className="streak-fire">🔥</span>
            {dashboard.streak_days} day streak!
          </div>
          
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
            How are you feeling today?
          </p>
          
          <Link to={`${base}/health/mood`} className="wf-btn wf-btn-primary">
            <Heart size={18} />
            Log Your Mood
          </Link>
        </div>
      </WireframeCard>

      {/* Wellness Score & Stats */}
      <div className="wf-grid-2">
        <WireframeCard style={{ textAlign: 'center', padding: '20px 12px' }}>
          <div className="wf-score-ring" style={{ '--score': dashboard.wellness_score } as React.CSSProperties}>
            <div className="ring-inner">
              <span className="score-value">{dashboard.wellness_score}</span>
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
              fontSize: '24px'
            }}>
              😊
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--wf-gray-800)' }}>{dashboard.avg_mood.toFixed(1)}</div>
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
              justifyContent: 'center'
            }}>
              <TrendingUp size={22} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>{dashboard.trend_direction === 'down' ? '' : '+'}{dashboard.trend_percentage}%</div>
              <div style={{ fontSize: '12px', color: 'var(--wf-gray-500)' }}>This week</div>
            </div>
          </WireframeCard>
        </div>
      </div>

      {/* Daily Inspiration */}
      {dashboard.daily_quote && (
        <WireframeCard className="wf-quote-card">
          <div className="quote-icon">💜</div>
          <p className="quote-text">
            "{dashboard.daily_quote.text}"
          </p>
          <p className="quote-author">— {dashboard.daily_quote.author}</p>
        </WireframeCard>
      )}

      {/* Upcoming Appointments */}
      <WireframeCard 
        title="Upcoming" 
        action={
          <Link to={`${base}/profile/appointments`} style={{ color: 'var(--wf-rose-500)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ChevronRight size={16} />
          </Link>
        }
      >
        <div className="wf-list-item" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: 'none' }}>
          <div className="wf-avatar-enhanced">
            <div className="avatar-inner" style={{ background: 'white' }}>
              <Calendar size={20} style={{ color: '#2563eb' }} />
            </div>
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Dr. Thompson - Oncology</div>
            <div className="wf-list-subtitle">Tomorrow, 10:30 AM</div>
          </div>
          <div style={{ position: 'relative' }}>
            <Bell size={18} style={{ color: '#2563eb' }} />
            <span className="wf-notification-dot" style={{ background: '#2563eb' }}>!</span>
          </div>
        </div>
        
        <div className="wf-list-item">
          <div className="wf-list-avatar" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
            <Calendar size={20} style={{ color: '#16a34a' }} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Blood Test</div>
            <div className="wf-list-subtitle">Jan 25, 9:00 AM</div>
          </div>
          <Bell size={18} style={{ color: 'var(--wf-gray-400)' }} />
        </div>
      </WireframeCard>

      {/* Associated leaflets and material */}
      <div className="wf-section-header">
        <span className="wf-section-title">Resources for your pathway</span>
        {!hasStageSelected && (
          <Link to={`${base}/profile/stage`} style={{ fontSize: 12, color: 'var(--wf-rose-500)', textDecoration: 'none' }}>
            Set your pathway
          </Link>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--wf-gray-600)', marginBottom: '12px' }}>
        {hasStageSelected
          ? 'Videos play in the app; PDFs and links open in a new tab.'
          : 'Set your treatment pathway to see personalised resources from your clinical team.'}
      </p>
      <WireframeCard>
        {resourceCategories.map((cat) => {
          const isExpanded = expandedCategory === cat.id
          return (
            <div key={cat.id} style={{ borderBottom: '1px solid var(--wf-gray-100)' }}>
              <button
                type="button"
                className="wf-list-item"
                style={{ width: '100%', border: 'none', textAlign: 'left', marginBottom: 0, cursor: 'pointer' }}
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
              >
                <div className="wf-list-avatar" style={{ background: cat.iconBg }}>
                  <cat.Icon size={20} style={{ color: cat.iconColor }} />
                </div>
                <div className="wf-list-content">
                  <div className="wf-list-title">{cat.title}</div>
                  <div className="wf-list-subtitle">{cat.links.length} link{cat.links.length !== 1 ? 's' : ''}</div>
                </div>
                {isExpanded ? (
                  <ChevronDown size={18} style={{ color: 'var(--wf-gray-400)' }} />
                ) : (
                  <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
                )}
              </button>
              {isExpanded && (
                <div style={{ padding: '0 12px 12px 60px' }}>
                  {cat.links.map((link) => {
                    const linkStyle = {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 0',
                      textDecoration: 'none',
                      color: 'inherit',
                      fontSize: '14px',
                      borderBottom: '1px solid var(--wf-gray-50)',
                    } as const
                    if (link.type === 'video') {
                      const embedUrl = youtubeToEmbedUrl(link.url)
                      return (
                        <Link
                          key={link.url}
                          to={`${base}/watch?url=${encodeURIComponent(embedUrl)}`}
                          style={linkStyle}
                        >
                          <Video size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{link.label}</span>
                        </Link>
                      )
                    }
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                      >
                        <FileText size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{link.label}</span>
                        <ExternalLink size={14} style={{ color: 'var(--wf-gray-400)' }} />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </WireframeCard>

      {/* Clinical trials */}
      <div className="wf-section-header">
        <span className="wf-section-title">Clinical trials</span>
      </div>
      <WireframeCard>
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-700)', marginBottom: '12px' }}>
          Find trials that may be relevant to you.
        </p>
        <div className="wf-list-item" style={{ cursor: 'pointer' }}>
          <div className="wf-list-avatar" style={{ background: 'linear-gradient(135deg, #dbeafe, #eff6ff)' }}>
            <FileText size={20} style={{ color: '#2563eb' }} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Browse clinical trials</div>
            <div className="wf-list-subtitle">See trials that may be suitable</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
        </div>
      </WireframeCard>

      {/* Quick Actions */}
      <div className="wf-section-header">
        <span className="wf-section-title">Quick Actions</span>
      </div>
      <div className="wf-grid-2" style={{ marginBottom: '16px' }}>
        <Link to={`${base}/chat`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon rose">
              <Sparkles size={24} />
            </div>
            <div className="feature-title">Ask Tara</div>
            <div className="feature-desc">Get answers</div>
          </div>
        </Link>
        
        <Link to={`${base}/community/chat`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon purple">
              <MessageCircle size={24} />
            </div>
            <div className="feature-title">Community</div>
            <div className="feature-desc">Connect</div>
          </div>
        </Link>
        
        <Link to={`${base}/health/symptoms`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon blue">
              <TrendingUp size={24} />
            </div>
            <div className="feature-title">Symptoms</div>
            <div className="feature-desc">Track health</div>
          </div>
        </Link>
        
        <Link to={`${base}/community/events`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon amber">
              <Calendar size={24} />
            </div>
            <div className="feature-title">Events</div>
            <div className="feature-desc">Join activities</div>
          </div>
        </Link>
      </div>

      {/* Community Activity */}
      <WireframeCard title="Community Activity" className="wf-card-accent">
        <Link to={`${base}/community/chat`} className="wf-list-item" style={{ textDecoration: 'none' }}>
          <div className="wf-avatar-enhanced">
            <div className="avatar-inner">
              <MessageCircle size={20} />
            </div>
            <span className="status-dot" />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Breast Cancer Support</div>
            <div className="wf-list-subtitle">12 new messages</div>
          </div>
          <div style={{ position: 'relative' }}>
            <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
            <span className="wf-notification-dot">12</span>
          </div>
        </Link>
        
        <Link to={`${base}/community/events`} className="wf-list-item" style={{ textDecoration: 'none' }}>
          <div className="wf-list-avatar" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
            <Flame size={20} style={{ color: '#d97706' }} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Yoga for Recovery</div>
            <div className="wf-list-subtitle" style={{ color: '#d97706', fontWeight: '500' }}>Starting in 2 hours</div>
          </div>
          <span className="wf-badge wf-badge-warning">Live Soon</span>
        </Link>
      </WireframeCard>
    </WireframeLayout>
  )
}
