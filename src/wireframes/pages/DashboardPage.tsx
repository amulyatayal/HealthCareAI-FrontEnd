import { Calendar, MessageCircle, Heart, TrendingUp, Bell, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

export function DashboardPage() {
  return (
    <WireframeLayout>
      {/* Welcome Section */}
      <WireframeCard>
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>Good morning,</p>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '4px 0' }}>
            Sarah
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>
            How are you feeling today?
          </p>
          <Link to="/demo/health/mood" className="wf-btn wf-btn-primary" style={{ marginTop: '16px' }}>
            <Heart size={18} />
            Log Your Mood
          </Link>
        </div>
      </WireframeCard>

      {/* Quick Stats */}
      <div className="wf-grid-2">
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value">7</div>
          <div className="wf-stat-label">Day Streak</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value">8.2</div>
          <div className="wf-stat-label">Avg Mood</div>
        </WireframeCard>
      </div>

      {/* Upcoming Appointments */}
      <WireframeCard 
        title="Upcoming" 
        action={
          <Link to="/demo/profile/appointments" style={{ color: 'var(--wf-rose-500)', fontSize: '14px' }}>
            View All
          </Link>
        }
      >
        <div className="wf-list-item">
          <div className="wf-list-avatar" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
            <Calendar size={20} style={{ color: '#2563eb' }} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Dr. Thompson - Oncology</div>
            <div className="wf-list-subtitle">Tomorrow, 10:30 AM</div>
          </div>
          <Bell size={18} style={{ color: 'var(--wf-gray-400)' }} />
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

      {/* Recent Activity */}
      <WireframeCard title="Community Activity">
        <Link to="/demo/community/chat" className="wf-list-item" style={{ textDecoration: 'none' }}>
          <div className="wf-list-avatar">
            <MessageCircle size={20} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Breast Cancer Support</div>
            <div className="wf-list-subtitle">12 new messages</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
        </Link>
        
        <Link to="/demo/community/events" className="wf-list-item" style={{ textDecoration: 'none' }}>
          <div className="wf-list-avatar" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
            <Calendar size={20} style={{ color: '#d97706' }} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Yoga for Recovery</div>
            <div className="wf-list-subtitle">Event starting in 2 hours</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
        </Link>
      </WireframeCard>

      {/* Health Insights */}
      <WireframeCard 
        title="Your Progress" 
        action={
          <Link to="/demo/health" style={{ color: 'var(--wf-rose-500)', fontSize: '14px' }}>
            Details
          </Link>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <TrendingUp size={20} style={{ color: '#16a34a' }} />
          <span style={{ fontSize: '14px', color: 'var(--wf-gray-600)' }}>
            Your mood has improved 15% this week
          </span>
        </div>
        <div className="wf-progress">
          <div className="wf-progress-bar" style={{ width: '72%' }} />
        </div>
        <p style={{ fontSize: '12px', color: 'var(--wf-gray-500)', marginTop: '8px' }}>
          72% towards your weekly wellness goal
        </p>
      </WireframeCard>
    </WireframeLayout>
  )
}
