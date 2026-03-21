import { MessageCircle, ChevronRight, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'

interface Props {
  basePath: string
}

export function CommunityActivity({ basePath }: Props) {
  return (
    <WireframeCard title="Community Activity" className="wf-card-accent">
      <Link to={`${basePath}/community/chat`} className="wf-list-item" style={{ textDecoration: 'none' }}>
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

      <Link to={`${basePath}/community/events`} className="wf-list-item" style={{ textDecoration: 'none' }}>
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
  )
}
