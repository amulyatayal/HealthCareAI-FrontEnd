import { useState } from 'react'
import { Calendar, MessageCircle, Heart, TrendingUp, Bell, ChevronRight, ChevronDown, Flame, Sparkles, FileText, UtensilsCrossed, Brain, Video, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const RESOURCE_CATEGORIES = [
  {
    id: 'procedure',
    title: 'Information about procedure',
    iconBg: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
    iconColor: '#2563eb',
    Icon: Video,
    links: [
      { label: 'Information on the procedure (video)', url: 'https://youtu.be/zeMr6XaoTEM?si=KUcwJsQ7WsNBY_cr', type: 'video' as const },
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
] as const

export function DashboardPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

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
          
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>Good morning,</p>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '4px 0 8px' }}>
            Sarah 👋
          </h2>
          
          {/* Streak Badge */}
          <div className="wf-streak-badge" style={{ marginBottom: '16px' }}>
            <span className="streak-fire">🔥</span>
            7 day streak!
          </div>
          
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
            How are you feeling today?
          </p>
          
          <Link to="/demo/health/mood" className="wf-btn wf-btn-primary">
            <Heart size={18} />
            Log Your Mood
          </Link>
        </div>
      </WireframeCard>

      {/* Wellness Score & Stats */}
      <div className="wf-grid-2">
        <WireframeCard style={{ textAlign: 'center', padding: '20px 12px' }}>
          <div className="wf-score-ring" style={{ '--score': 78 } as React.CSSProperties}>
            <div className="ring-inner">
              <span className="score-value">78</span>
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
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--wf-gray-800)' }}>8.2</div>
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
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>+15%</div>
              <div style={{ fontSize: '12px', color: 'var(--wf-gray-500)' }}>This week</div>
            </div>
          </WireframeCard>
        </div>
      </div>

      {/* Daily Inspiration */}
      <WireframeCard className="wf-quote-card">
        <div className="quote-icon">💜</div>
        <p className="quote-text">
          "Every day may not be good, but there is something good in every day."
        </p>
        <p className="quote-author">— Alice Morse Earle</p>
      </WireframeCard>

      {/* Upcoming Appointments */}
      <WireframeCard 
        title="Upcoming" 
        action={
          <Link to="/demo/profile/appointments" style={{ color: 'var(--wf-rose-500)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
      </div>
      <p style={{ fontSize: '13px', color: 'var(--wf-gray-600)', marginBottom: '12px' }}>
        Click a category to see videos and leaflets (opens in new tab).
      </p>
      <WireframeCard>
        {RESOURCE_CATEGORIES.map((cat) => {
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
                  {cat.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 0',
                        textDecoration: 'none',
                        color: 'inherit',
                        fontSize: '14px',
                        borderBottom: '1px solid var(--wf-gray-50)',
                      }}
                    >
                      {link.type === 'video' ? (
                        <Video size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                      ) : (
                        <FileText size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                      )}
                      <span style={{ flex: 1 }}>{link.label}</span>
                      <ExternalLink size={14} style={{ color: 'var(--wf-gray-400)' }} />
                    </a>
                  ))}
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
        <Link to="/demo/chat" style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon rose">
              <Sparkles size={24} />
            </div>
            <div className="feature-title">Ask Tara</div>
            <div className="feature-desc">Get answers</div>
          </div>
        </Link>
        
        <Link to="/demo/community/chat" style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon purple">
              <MessageCircle size={24} />
            </div>
            <div className="feature-title">Community</div>
            <div className="feature-desc">Connect</div>
          </div>
        </Link>
        
        <Link to="/demo/health/symptoms" style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon blue">
              <TrendingUp size={24} />
            </div>
            <div className="feature-title">Symptoms</div>
            <div className="feature-desc">Track health</div>
          </div>
        </Link>
        
        <Link to="/demo/community/events" style={{ textDecoration: 'none' }}>
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
        <Link to="/demo/community/chat" className="wf-list-item" style={{ textDecoration: 'none' }}>
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
        
        <Link to="/demo/community/events" className="wf-list-item" style={{ textDecoration: 'none' }}>
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
