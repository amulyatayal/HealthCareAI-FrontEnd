import { FileText, Calendar, Settings, Bell, Shield, LogOut, ChevronRight, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

export function ProfilePage() {
  const menuItems = [
    {
      icon: FileText,
      title: 'My Documents',
      subtitle: 'Upload and manage medical records',
      to: '/demo/profile/documents',
    },
    {
      icon: Calendar,
      title: 'Appointments',
      subtitle: 'Manage reminders and schedule',
      to: '/demo/profile/appointments',
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      to: '/demo/profile',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Data protection settings',
      to: '/demo/profile',
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences',
      to: '/demo/profile',
    },
  ]

  return (
    <WireframeLayout>
      {/* Profile Header */}
      <WireframeCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--wf-rose-300), var(--wf-rose-400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: '600'
            }}
          >
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
              Sarah Johnson
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>
              sarah.johnson@email.com
            </p>
            <span className="wf-badge wf-badge-success" style={{ marginTop: '4px' }}>
              Verified Member
            </span>
          </div>
        </div>
      </WireframeCard>

      {/* Quick Stats */}
      <div className="wf-grid-3">
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>45</div>
          <div className="wf-stat-label">Days Active</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>12</div>
          <div className="wf-stat-label">Documents</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>3</div>
          <div className="wf-stat-label">Buddies</div>
        </WireframeCard>
      </div>

      {/* Menu Items */}
      <div className="wf-section-header">
        <span className="wf-section-title">Account</span>
      </div>

      {menuItems.map((item) => (
        <Link 
          key={item.title} 
          to={item.to} 
          style={{ textDecoration: 'none' }}
        >
          <div className="wf-list-item" style={{ background: 'white', borderRadius: '12px', marginBottom: '8px' }}>
            <div 
              className="wf-icon-btn" 
              style={{ background: 'var(--wf-rose-50)', color: 'var(--wf-rose-500)' }}
            >
              <item.icon size={20} />
            </div>
            <div className="wf-list-content">
              <div className="wf-list-title">{item.title}</div>
              <div className="wf-list-subtitle">{item.subtitle}</div>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
          </div>
        </Link>
      ))}

      {/* Logout */}
      <button 
        className="wf-list-item" 
        style={{ 
          background: 'white', 
          borderRadius: '12px', 
          width: '100%', 
          border: 'none',
          marginTop: '16px'
        }}
      >
        <div 
          className="wf-icon-btn" 
          style={{ background: '#fee2e2', color: '#dc2626' }}
        >
          <LogOut size={20} />
        </div>
        <div className="wf-list-content">
          <div className="wf-list-title" style={{ color: '#dc2626' }}>Log Out</div>
        </div>
      </button>

      <p style={{ 
        textAlign: 'center', 
        fontSize: '12px', 
        color: 'var(--wf-gray-400)', 
        marginTop: '24px' 
      }}>
        Tara v2.0.0 • Made with ❤️
      </p>
    </WireframeLayout>
  )
}
