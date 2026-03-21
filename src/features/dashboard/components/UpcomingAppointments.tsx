import { Calendar, Bell, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'

interface Props {
  basePath: string
}

export function UpcomingAppointments({ basePath }: Props) {
  return (
    <WireframeCard
      title="Upcoming"
      action={
        <Link to={`${basePath}/profile/appointments`} style={{ color: 'var(--wf-rose-500)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
  )
}
