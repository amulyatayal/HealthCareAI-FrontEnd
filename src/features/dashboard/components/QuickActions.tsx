import { Calendar, MessageCircle, TrendingUp, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  basePath: string
}

export function QuickActions({ basePath }: Props) {
  return (
    <>
      <div className="wf-section-header">
        <span className="wf-section-title">Quick Actions</span>
      </div>
      <div className="wf-grid-2" style={{ marginBottom: '16px' }}>
        <Link to={`${basePath}/chat`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon rose">
              <Sparkles size={24} />
            </div>
            <div className="feature-title">Ask Tara</div>
            <div className="feature-desc">Get answers</div>
          </div>
        </Link>

        <Link to={`${basePath}/community/chat`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon purple">
              <MessageCircle size={24} />
            </div>
            <div className="feature-title">Community</div>
            <div className="feature-desc">Connect</div>
          </div>
        </Link>

        <Link to={`${basePath}/health/symptoms`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon blue">
              <TrendingUp size={24} />
            </div>
            <div className="feature-title">Symptoms</div>
            <div className="feature-desc">Track health</div>
          </div>
        </Link>

        <Link to={`${basePath}/community/events`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon amber">
              <Calendar size={24} />
            </div>
            <div className="feature-title">Events</div>
            <div className="feature-desc">Join activities</div>
          </div>
        </Link>
      </div>
    </>
  )
}
