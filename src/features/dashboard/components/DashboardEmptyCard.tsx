import { ReactNode, CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'

interface Props {
  title: ReactNode
  action?: ReactNode
  icon: ReactNode
  iconStyle?: CSSProperties
  headline: string
  subtext: string
  cta?: { label: string; to: string }
}

export function DashboardEmptyCard({ title, action, icon, iconStyle, headline, subtext, cta }: Props) {
  return (
    <WireframeCard title={title} action={action}>
      <div className="wf-card-empty">
        <div className="wf-card-empty-icon" style={iconStyle}>
          {icon}
        </div>
        <p className="wf-card-empty-title">{headline}</p>
        <p className="wf-card-empty-text">{subtext}</p>
        {cta && (
          <Link to={cta.to} className="wf-card-empty-action">
            {cta.label}
          </Link>
        )}
      </div>
    </WireframeCard>
  )
}
