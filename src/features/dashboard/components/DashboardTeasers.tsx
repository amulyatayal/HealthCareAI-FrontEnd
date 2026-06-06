import { useState, useEffect } from 'react'
import { Calendar, ClipboardList, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getClinicalTeam, getEvents } from '../../../services/api'

interface Props {
  basePath: string
}

function formatClinicianSummary(count: number): string {
  if (count === 0) return 'View care team'
  return `${count} clinician${count !== 1 ? 's' : ''}`
}

function formatEventsSummary(count: number): string {
  if (count === 0) return 'No upcoming events'
  return `${count} upcoming event${count !== 1 ? 's' : ''}`
}

export function DashboardTeasers({ basePath }: Props) {
  const { user } = useAuth()
  const [clinicianCount, setClinicianCount] = useState<number | null>(null)
  const [eventCount, setEventCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTeam() {
      try {
        const data = await getClinicalTeam()
        if (!cancelled) setClinicianCount(data.team_members.length)
      } catch {
        if (!cancelled) setClinicianCount(0)
      }
    }

    async function loadEvents() {
      if (!user || user.isGuest) {
        setEventCount(0)
        return
      }
      try {
        const data = await getEvents({ when: 'upcoming', limit: 1 })
        if (!cancelled) setEventCount(data.total_count)
      } catch {
        if (!cancelled) setEventCount(0)
      }
    }

    loadTeam()
    loadEvents()
    return () => { cancelled = true }
  }, [user])

  const tiles = [
    {
      key: 'team',
      to: `${basePath}/team`,
      icon: Stethoscope,
      label: 'Team',
      summary: clinicianCount === null ? '…' : formatClinicianSummary(clinicianCount),
      iconClass: 'team',
    },
    {
      key: 'events',
      to: `${basePath}/community/events`,
      icon: Calendar,
      label: 'Events',
      summary: eventCount === null ? '…' : formatEventsSummary(eventCount),
      iconClass: 'events',
    },
    {
      key: 'prom',
      to: `${basePath}/health/prom/breast-satisfaction`,
      icon: ClipboardList,
      label: 'PROM',
      summary: 'Complete survey',
      iconClass: 'prom',
    },
  ] as const

  return (
    <div className="wf-quick-strip-section">
      <div className="wf-quick-strip">
        {tiles.map(({ key, to, icon: Icon, label, summary, iconClass }) => (
          <Link key={key} to={to} className="wf-quick-strip-item">
            <span className={`wf-quick-strip-icon ${iconClass}`}>
              <Icon size={20} />
            </span>
            <span className="wf-quick-strip-label">{label}</span>
            <span className="wf-quick-strip-summary">{summary}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
