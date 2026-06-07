import { HeartHandshake } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import { ComingSoonBadge } from './ComingSoonBadge'

export function DonateCard() {
  return (
    <WireframeCard className="wf-donate-card wf-donate-card-compact">
      <div className="wf-donate-compact-row">
        <div className="wf-donate-compact-text">
          <span className="wf-donate-compact-label">Tap for donations</span>
          <ComingSoonBadge />
        </div>
        <button
          type="button"
          disabled
          className="wf-btn wf-btn-sm wf-btn-secondary wf-btn-disabled wf-donate-compact-btn"
          aria-label="Donate now (coming soon)"
        >
          <span className="wf-donate-btn-icon" aria-hidden>
            <HeartHandshake
              size={20}
              fill="#fda4af"
              color="#e11d48"
              strokeWidth={1.75}
            />
          </span>
          Donate
        </button>
      </div>
    </WireframeCard>
  )
}
