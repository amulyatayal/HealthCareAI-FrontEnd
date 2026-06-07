import { HeartHandshake } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import { ComingSoonBadge } from './ComingSoonBadge'

export function DonateCard() {
  return (
    <WireframeCard
      className="wf-donate-card"
      title="Support breast cancer charities"
      subtitle="Tap for donations"
      action={<ComingSoonBadge />}
    >
      <button
        type="button"
        disabled
        className="wf-btn wf-btn-secondary wf-btn-full wf-btn-disabled"
      >
        <span className="wf-donate-btn-icon" aria-hidden>
          <HeartHandshake
            size={24}
            fill="#fda4af"
            color="#e11d48"
            strokeWidth={1.75}
          />
        </span>
        Donate now
      </button>
    </WireframeCard>
  )
}
