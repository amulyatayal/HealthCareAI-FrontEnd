import { Calendar, ChefHat, ClipboardList, TrendingUp, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  basePath: string
}

const ACTIONS = [
  { to: 'search', icon: Search, label: 'Search' },
  { to: 'health/prom/breast-satisfaction', icon: ClipboardList, label: 'PROM' },
  { to: 'health/symptoms', icon: TrendingUp, label: 'Symptoms' },
  { to: 'community/events', icon: Calendar, label: 'Events' },
  { to: 'recipes', icon: ChefHat, label: 'Recipes' },
] as const

export function QuickActions({ basePath }: Props) {
  return (
    <div className="wf-quick-strip-section">
      <div className="wf-section-header">
        <span className="wf-section-label">Quick actions</span>
      </div>
      <div className="wf-quick-strip">
        {ACTIONS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={`${basePath}/${to}`} className="wf-quick-strip-item">
            <span className="wf-quick-strip-icon">
              <Icon size={20} />
            </span>
            <span className="wf-quick-strip-label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
