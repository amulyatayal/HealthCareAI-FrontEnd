import { useState, useEffect } from 'react'
import { Send, Bell, AlertCircle, AlertTriangle, Info, Trash2, X } from 'lucide-react'
import { getAdminNotifications, createNotification, deleteNotification } from '../../services/adminApi'
import type { AdminNotification, NotificationPriority } from '../../types/admin'

const PRIORITY_CONFIG: Record<NotificationPriority, { label: string; color: string; icon: typeof Info }> = {
  info: { label: 'Info', color: '#3b82f6', icon: Info },
  warning: { label: 'Warning', color: '#f59e0b', icon: AlertTriangle },
  urgent: { label: 'Urgent', color: '#ef4444', icon: AlertCircle },
}

function getNotifId(n: AdminNotification): string {
  return n.notification_id || n.id || ''
}

function formatSentDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<NotificationPriority>('info')
  const [sending, setSending] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminNotifications()
      setNotifications(data.notifications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!title.trim() || !message.trim()) return
    setSending(true)
    setError('')
    try {
      const created = await createNotification({ title: title.trim(), message: message.trim(), priority })
      setNotifications((prev) => [created, ...prev])
      setTitle('')
      setMessage('')
      setPriority('info')
      setShowCompose(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  async function handleDelete(id: string) {
    if (!id) {
      setError('Cannot delete: notification ID is missing')
      return
    }
    setError('')
    try {
      await deleteNotification(id)
      setNotifications((prev) => prev.filter((n) => getNotifId(n) !== id))
      setConfirmDelete(null)
    } catch (err) {
      console.error('Delete failed for notification id:', id, err)
      setError(err instanceof Error ? err.message : 'Failed to delete notification')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Notifications</h1>
        <p>Send announcements and alerts to all patients.</p>
      </div>

      {error && (
        <div className="admin-ac-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="admin-notif-toolbar">
        <button className="admin-notif-btn-compose" onClick={() => setShowCompose(true)}>
          <Send size={16} /> Compose Notification
        </button>
        <span className="admin-notif-count">{notifications.length} sent</span>
      </div>

      {showCompose && (
        <div className="admin-notif-compose">
          <div className="admin-notif-compose-header">
            <h3>New Notification</h3>
            <button className="admin-notif-compose-close" onClick={() => setShowCompose(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="admin-notif-compose-form">
            <label>
              Title *
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
              />
            </label>
            <label>
              Message *
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification message..."
                rows={4}
              />
            </label>
            <div className="admin-notif-priority-row">
              <span className="admin-notif-priority-label">Priority</span>
              <div className="admin-notif-priority-options">
                {(Object.entries(PRIORITY_CONFIG) as [NotificationPriority, typeof PRIORITY_CONFIG['info']][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    className={`admin-notif-priority-btn ${priority === key ? 'active' : ''}`}
                    style={priority === key ? { borderColor: cfg.color, background: `${cfg.color}10` } : undefined}
                    onClick={() => setPriority(key)}
                  >
                    <cfg.icon size={14} style={{ color: cfg.color }} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-notif-compose-actions">
              <button
                className="admin-notif-btn-send"
                onClick={handleSend}
                disabled={!title.trim() || !message.trim() || sending}
              >
                <Send size={14} /> {sending ? 'Sending...' : 'Send to All Patients'}
              </button>
              <button className="admin-notif-btn-cancel" onClick={() => setShowCompose(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-ac-loading">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="admin-notif-empty">
          <Bell size={40} strokeWidth={1.2} />
          <h3>No notifications sent</h3>
          <p>Compose your first notification to reach all patients.</p>
        </div>
      ) : (
        <div className="admin-notif-list">
          {notifications.map((n) => {
            const cfg = PRIORITY_CONFIG[n.priority]
            const PriorityIcon = cfg.icon
            return (
              <div key={getNotifId(n)} className="admin-notif-item">
                <div className="admin-notif-item-accent" style={{ background: cfg.color }} />
                <div className="admin-notif-item-body">
                  <div className="admin-notif-item-header">
                    <div className="admin-notif-item-title-row">
                      <span className="admin-notif-item-priority" style={{ color: cfg.color, background: `${cfg.color}15` }}>
                        <PriorityIcon size={12} /> {cfg.label}
                      </span>
                      <h4>{n.title}</h4>
                    </div>
                    <span className="admin-notif-item-meta">{formatSentDate(n.created_at)}</span>
                  </div>
                  <p className="admin-notif-item-message">{n.message}</p>
                  <div className="admin-notif-item-footer">
                    <span className="admin-notif-item-recipients">Sent to {n.recipient_count} patients</span>
                    {confirmDelete === getNotifId(n) ? (
                      <span className="admin-notif-confirm-delete">
                        <span>Delete?</span>
                        <button className="admin-notif-btn-yes" onClick={() => handleDelete(getNotifId(n))}>Yes</button>
                        <button className="admin-notif-btn-no" onClick={() => setConfirmDelete(null)}>No</button>
                      </span>
                    ) : (
                      <button className="admin-notif-btn-delete" onClick={() => setConfirmDelete(getNotifId(n))} disabled={!getNotifId(n)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
