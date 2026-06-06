import { FileText, ChevronRight } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import { ComingSoonBadge } from './ComingSoonBadge'

export function ClinicalTrials() {
  return (
    <>
      <div className="wf-section-header">
        <span className="wf-section-title">Clinical trials</span>
        <ComingSoonBadge />
      </div>
      <WireframeCard className="wf-card-coming-soon">
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-700)', marginBottom: '12px' }}>
          Find trials that may be relevant to you.
        </p>
        <div className="wf-list-item">
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
    </>
  )
}
