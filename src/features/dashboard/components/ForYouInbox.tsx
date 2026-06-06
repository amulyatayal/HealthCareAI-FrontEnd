import { useState, useEffect } from 'react'
import { Calendar, Info, AlertTriangle, AlertCircle, Check, Bell, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'
import { DashboardCompactEmpty } from './DashboardCompactEmpty'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getAppointments,
  type PatientNotification,
  type Appointment,
} from '../../../services/api'

interface Props {
  basePath: string
}

type Priority = 'info' | 'warning' | 'urgent'

const PRIORITY_STYLES: Record<Priority, { color: string; bg: string; icon: typeof Info }> = {
  info: { color: '#3b82f6', bg: '#eff6ff', icon: Info },
  warning: { color: '#f59e0b', bg: '#fffbeb', icon: AlertTriangle },
  urgent: { color: '#ef4444', bg: '#fef2f2', icon: AlertCircle },
}

const MAX_TOTAL = 3
const MAX_NOTIFICATIONS = 2

function getNotifId(n: PatientNotification): string {
  return n.notification_id || n.id || ''
}

function timeAgo(value: string): string {
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return ''
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

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

export function ForYouInbox({ basePath }: Props) {
  const [notifications, setNotifications] = useState<PatientNotification[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const appointmentsPath = `${basePath}/profile/appointments`

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [notifResult, apptResult] = await Promise.allSettled([
          getNotifications(),
          getAppointments('upcoming'),
        ])
        if (cancelled) return
        setNotifications(
          notifResult.status === 'fulfilled' ? (notifResult.value.notifications ?? []) : []
        )
        setAppointments(
          apptResult.status === 'fulfilled' ? (apptResult.value.appointments ?? []) : []
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const visibleNotifications = notifications.slice(0, MAX_NOTIFICATIONS)
  const remainingSlots = Math.max(0, MAX_TOTAL - visibleNotifications.length)
  const visibleAppointments = appointments.slice(0, remainingSlots)
  const totalCount = notifications.length + appointments.length
  const visibleCount = visibleNotifications.length + visibleAppointments.length
  const hasMore = totalCount > visibleCount
  const isEmpty = !loading && totalCount === 0

  async function handleMarkRead(id: string) {
    if (!id) return
    setNotifications((prev) =>
      prev.map((n) => (getNotifId(n) === id ? { ...n, read: true } : n))
    )
    try {
      await markNotificationRead(id)
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead()
    } catch (err) {
      console.error('Failed to mark all notifications read:', err)
    }
  }

  return (
    <WireframeCard
      title={
        <span className="wf-inbox-title">
          For you
          {!loading && unreadCount > 0 && (
            <span className="wf-notif-unread-badge">{unreadCount}</span>
          )}
        </span>
      }
      action={
        !loading && unreadCount > 0 ? (
          <button onClick={handleMarkAllRead} className="wf-notif-mark-all">
            <Check size={14} /> Mark all read
          </button>
        ) : !loading && appointments.length > 0 ? (
          <Link to={appointmentsPath} className="wf-card-action-link">
            Manage <ChevronRight size={16} />
          </Link>
        ) : undefined
      }
    >
      {loading ? (
        <div className="wf-compact-skeleton">
          <div className="wf-compact-skeleton-line" />
        </div>
      ) : isEmpty ? (
        <DashboardCompactEmpty
          message="You're all caught up — updates and reminders appear here."
          link={{ label: 'Manage appointments', to: appointmentsPath }}
        />
      ) : (
        <div className="wf-inbox-list">
          {visibleNotifications.map((n) => {
            const style = PRIORITY_STYLES[n.priority]
            const PriorityIcon = style.icon
            return (
              <button
                key={`notif-${getNotifId(n) || n.title}`}
                type="button"
                className={`wf-inbox-row ${n.read ? 'read' : ''}`}
                onClick={() => handleMarkRead(getNotifId(n))}
              >
                <div className="wf-inbox-icon" style={{ background: style.bg }}>
                  <PriorityIcon size={16} style={{ color: style.color }} />
                </div>
                <div className="wf-inbox-content">
                  <div className="wf-inbox-title-row">
                    <span className="wf-inbox-label">{n.title}</span>
                    <span className="wf-inbox-meta">{timeAgo(n.created_at)}</span>
                  </div>
                  {n.message && <span className="wf-inbox-sub">{n.message}</span>}
                </div>
                {!n.read && <div className="wf-notif-dot" />}
              </button>
            )
          })}

          {visibleAppointments.map((appt) => (
            <Link
              key={`appt-${appt.id}`}
              to={appointmentsPath}
              className="wf-inbox-row wf-inbox-row-link"
            >
              <div className="wf-inbox-icon appointment">
                <Calendar size={16} />
              </div>
              <div className="wf-inbox-content">
                <div className="wf-inbox-title-row">
                  <span className="wf-inbox-label">{appt.title}</span>
                  <span className="wf-inbox-meta">{formatAppointmentDate(appt.date, appt.time)}</span>
                </div>
                <span className="wf-inbox-sub">Upcoming reminder</span>
              </div>
              {appt.reminder ? (
                <div className="wf-inbox-reminder">
                  <Bell size={16} />
                </div>
              ) : (
                <ChevronRight size={16} className="wf-inbox-chevron" />
              )}
            </Link>
          ))}

          {hasMore && (
            <p className="wf-view-all-hint">
              +{totalCount - visibleCount} more
            </p>
          )}
        </div>
      )}
    </WireframeCard>
  )
}
