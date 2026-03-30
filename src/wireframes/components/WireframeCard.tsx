import { ReactNode, CSSProperties } from 'react'

interface WireframeCardProps {
  title?: ReactNode
  subtitle?: string
  children: ReactNode
  action?: ReactNode
  className?: string
  style?: CSSProperties
}

export function WireframeCard({ title, subtitle, children, action, className = '', style }: WireframeCardProps) {
  return (
    <div className={`wf-card ${className}`} style={style}>
      {(title || action) && (
        <div className="wf-card-header">
          <div>
            {title && <h3 className="wf-card-title">{title}</h3>}
            {subtitle && <p className="wf-card-subtitle">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
