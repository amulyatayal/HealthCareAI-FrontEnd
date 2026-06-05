import { Calendar, ClipboardList, TrendingUp, Search } from 'lucide-react'
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
        <Link to={`${basePath}/search`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon rose">
              <Search size={24} />
            </div>
            <div className="feature-title">Search Resources</div>
            <div className="feature-desc">Find care resources</div>
          </div>
        </Link>

        <Link to={`${basePath}/health/prom/breast-satisfaction`} style={{ textDecoration: 'none' }}>
          <div className="wf-feature-card">
            <div className="feature-icon purple">
              <ClipboardList size={24} />
            </div>
            <div className="feature-title">PROM Questionnaire</div>
            <div className="feature-desc">Complete survey</div>
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
