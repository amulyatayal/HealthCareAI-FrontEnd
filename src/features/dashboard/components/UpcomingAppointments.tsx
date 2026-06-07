import { useState, useEffect } from 'react'
import { Calendar, Bell, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'
import { DashboardCompactEmpty } from './DashboardCompactEmpty'
import { getAppointments, type Appointment } from '../../../services/api'

interface Props {
  basePath: string
}

const MAX_VISIBLE = 2

const ACCENT_COLORS = [
  { bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', icon: '#2563eb' },
  { bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', icon: '#16a34a' },
]

function formatAppointmentDate(date: string, time: string): string {
  try {
    const apptDate = new Date(`${date}T${time}`)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const isToday = apptDate.toDateString() === now.toDateString()
    const isTomorrow = apptDate.toDateString() === tomorrow.toDateString()

    const timeStr = apptDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    if (isToday) return `Today, ${timeStr}`
    if (isTomorrow) return `Tomorrow, ${timeStr}`
    return apptDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + `, ${timeStr}`
  } catch {
    return `${date} ${time}`
  }
}

export function UpcomingAppointments({ basePath }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getAppointments('upcoming')
        if (!cancelled) {
          setAppointments(data.appointments ?? [])
        }
      } catch {
        if (!cancelled) setAppointments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const visibleAppointments = appointments.slice(0, MAX_VISIBLE)
  const appointmentsPath = `${basePath}/profile/appointments`

  return (
    <WireframeCard
      title="Upcoming"
      action={
        <Link to={appointmentsPath} className="wf-card-action-link">
          View all <ChevronRight size={16} />
        </Link>
      }
    >
      {loading ? (
        <div className="wf-compact-skeleton">
          <div className="wf-compact-skeleton-line" />
        </div>
      ) : appointments.length === 0 ? (
        <DashboardCompactEmpty
          message="No upcoming reminders"
          link={{ label: 'Manage appointments', to: appointmentsPath }}
        />
      ) : (
        visibleAppointments.map((appt, idx) => {
          const color = ACCENT_COLORS[idx % ACCENT_COLORS.length]
          return (
            <div key={appt.id} className="wf-list-item" style={idx === 0 ? { background: color.bg, border: 'none' } : undefined}>
              <div className={idx === 0 ? 'wf-avatar-enhanced' : 'wf-list-avatar'} style={idx !== 0 ? { background: color.bg } : undefined}>
                {idx === 0 ? (
                  <div className="avatar-inner" style={{ background: 'white' }}>
                    <Calendar size={20} style={{ color: color.icon }} />
                  </div>
                ) : (
                  <Calendar size={20} style={{ color: color.icon }} />
                )}
              </div>
              <div className="wf-list-content">
                <div className="wf-list-title">{appt.title}</div>
                <div className="wf-list-subtitle">{formatAppointmentDate(appt.date, appt.time)}</div>
              </div>
              {appt.reminder ? (
                <div style={{ position: 'relative' }}>
                  <Bell size={18} style={{ color: color.icon }} />
                  <span className="wf-notification-dot" style={{ background: color.icon }}>!</span>
                </div>
              ) : (
                <Bell size={18} style={{ color: 'var(--wf-gray-400)' }} />
              )}
            </div>
          )
        })
      )}
    </WireframeCard>
  )
}
