import { useState, useEffect } from 'react'
import { Bell, Info, AlertTriangle, AlertCircle, Check } from 'lucide-react'
import { WireframeCard } from '../../../wireframes/components'
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

  if (loading) return null

  if (notifications.length === 0) {
    return (
      <div className="wf-status-chip-row">
        <span className="wf-status-chip">
          <Bell size={14} />
          Notifications: None
        </span>
      </div>
    )
  }

  return (
    <WireframeCard
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Notifications
          {unreadCount > 0 && (
            <span className="wf-notif-unread-badge">{unreadCount}</span>
          )}
        </span>
      }
      action={
        unreadCount > 0 ? (
          <button onClick={handleMarkAllRead} className="wf-notif-mark-all">
            <Check size={14} /> Mark all read
          </button>
        ) : undefined
      }
    >
      {notifications.map((n) => {
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
    </WireframeCard>
  )
}
