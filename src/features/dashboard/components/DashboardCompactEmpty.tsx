import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  message: string
  action?: ReactNode
  link?: { label: string; to: string }
}

export function DashboardCompactEmpty({ message, action, link }: Props) {
  return (
    <div className="wf-compact-empty">
      <p className="wf-compact-empty-text">{message}</p>
      {link && (
        <Link to={link.to} className="wf-compact-empty-link">
          {link.label}
        </Link>
      )}
      {action}
    </div>
  )
}
