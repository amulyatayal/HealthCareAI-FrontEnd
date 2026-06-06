import { useState, useEffect } from 'react'
import { Info, AlertTriangle, AlertCircle, Check } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
import { DashboardCompactEmpty } from './DashboardCompactEmpty'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type PatientNotification,
} from '../../../services/api'

type Priority = 'info' | 'warning' | 'urgent'

const PRIORITY_STYLES: Record<Priority, { color: string; bg: string; icon: typeof Info }> = {
  info: { color: '#3b82f6', bg: '#eff6ff', icon: Info },
  warning: { color: '#f59e0b', bg: '#fffbeb', icon: AlertTriangle },
  urgent: { color: '#ef4444', bg: '#fef2f2', icon: AlertCircle },
}

const MAX_VISIBLE = 2

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

export function Notifications() {
  const [notifications, setNotifications] = useState<PatientNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getNotifications()
        if (!cancelled) setNotifications(data.notifications ?? [])
      } catch {
        if (!cancelled) setNotifications([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const visibleNotifications = notifications.slice(0, MAX_VISIBLE)
  const hasMore = notifications.length > MAX_VISIBLE

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
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Notifications
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
        ) : undefined
      }
    >
      {loading ? (
        <div className="wf-compact-skeleton">
          <div className="wf-compact-skeleton-line" />
        </div>
      ) : notifications.length === 0 ? (
        <DashboardCompactEmpty message="You're all caught up — updates from your care team appear here." />
      ) : (
        <>
          {visibleNotifications.map((n) => {
            const style = PRIORITY_STYLES[n.priority]
            const PriorityIcon = style.icon
            return (
              <button
                key={getNotifId(n) || n.title}
                className={`wf-notif-item ${n.read ? 'read' : ''}`}
                onClick={() => handleMarkRead(getNotifId(n))}
              >
                <div className="wf-notif-icon" style={{ background: style.bg }}>
                  <PriorityIcon size={18} style={{ color: style.color }} />
                </div>
                <div className="wf-notif-content">
                  <div className="wf-notif-title-row">
                    <span className="wf-notif-title">{n.title}</span>
                    <span className="wf-notif-time">{timeAgo(n.created_at)}</span>
                  </div>
                  <div className="wf-notif-message">{n.message}</div>
                </div>
                {!n.read && <div className="wf-notif-dot" />}
              </button>
            )
          })}
          {hasMore && (
            <p className="wf-view-all-hint">+{notifications.length - MAX_VISIBLE} more notification{notifications.length - MAX_VISIBLE !== 1 ? 's' : ''}</p>
          )}
        </>
      )}
    </WireframeCard>
  )
}
