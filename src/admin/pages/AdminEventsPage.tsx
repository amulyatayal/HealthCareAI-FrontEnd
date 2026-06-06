import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Calendar, MapPin, Video, Users, X, AlertCircle } from 'lucide-react'
import { getAdminEvents, createEvent, updateEvent, cancelEvent } from '../../services/adminApi'
import type { AdminEventApi, EventType } from '../../types/admin'
import {
  EMPTY_EVENT_FORM,
  apiEventToForm,
  formToCreateRequest,
  formToUpdateRequest,
  formatStartsAt,
  getEventId,
  type EventFormState,
} from '../utils/eventMappers'

const TYPE_LABELS: Record<EventType, string> = {
  wellness: 'Wellness',
  support: 'Support Group',
  education: 'Education',
}

const TYPE_COLORS: Record<EventType, string> = {
  wellness: '#2ecc71',
  support: '#9b59b6',
  education: '#3498db',
}

function EventCard({
  ev,
  confirmCancel,
  onEdit,
  onConfirmCancel,
  onCancelConfirm,
  onRequestCancel,
}: {
  ev: AdminEventApi
  confirmCancel: string | null
  onEdit: (ev: AdminEventApi) => void
  onConfirmCancel: (id: string) => void
  onCancelConfirm: () => void
  onRequestCancel: (id: string) => void
}) {
  const isCancelled = ev.status === 'cancelled'
  const eventId = getEventId(ev)

  return (
    <div className={`admin-ev-card${isCancelled ? ' admin-ev-card--cancelled' : ''}`}>
      <div className="admin-ev-card-type" style={{ background: TYPE_COLORS[ev.type] }}>
        {TYPE_LABELS[ev.type]}
      </div>
      {isCancelled && <span className="admin-ev-status-cancelled">Cancelled</span>}
      <h3 className="admin-ev-card-title">{ev.title}</h3>
      <div className="admin-ev-card-details">
        <span><Calendar size={14} /> {formatStartsAt(ev.starts_at)}</span>
        {ev.location && (
          <span>
            {ev.is_virtual ? <Video size={14} /> : <MapPin size={14} />}
            {ev.location}
          </span>
        )}
        <span><Users size={14} /> {ev.attendee_count} attendee{ev.attendee_count !== 1 && 's'}</span>
      </div>
      {ev.description && <p className="admin-ev-card-desc">{ev.description}</p>}
      {!isCancelled && (
        <div className="admin-ev-card-actions">
          <button onClick={() => onEdit(ev)} title="Edit"><Edit2 size={14} /> Edit</button>
          {confirmCancel === eventId ? (
            <span className="admin-ev-confirm">
              <span>Cancel this event?</span>
              <button className="admin-ev-btn-yes" onClick={() => onConfirmCancel(eventId)}>Yes</button>
              <button className="admin-ev-btn-no" onClick={onCancelConfirm}>No</button>
            </span>
          ) : (
            <button className="admin-ev-btn-delete" onClick={() => onRequestCancel(eventId)} title="Cancel Event">
              <Trash2 size={14} /> Cancel Event
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEventApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EventFormState>(EMPTY_EVENT_FORM)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminEvents({ status: 'all' })
      setEvents(data.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm(EMPTY_EVENT_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(ev: AdminEventApi) {
    const id = getEventId(ev)
    if (!id) {
      setError('Cannot edit: event ID is missing')
      return
    }
    setForm(apiEventToForm(ev))
    setEditingId(id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.date || !form.time) return

    setSaving(true)
    setError('')
    try {
      if (editingId) {
        if (!editingId.trim()) {
          setError('Cannot save: event ID is missing')
          return
        }
        const { event } = await updateEvent(editingId, formToUpdateRequest(form))
        setEvents((prev) => prev.map((ev) => (getEventId(ev) === editingId ? event : ev)))
      } else {
        const { event } = await createEvent(formToCreateRequest(form))
        setEvents((prev) => [event, ...prev])
      }
      setShowForm(false)
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  async function handleCancelEvent(id: string) {
    if (!id?.trim()) {
      setError('Cannot cancel: event ID is missing')
      return
    }
    setError('')
    try {
      await cancelEvent(id)
      setEvents((prev) =>
        prev.map((ev) => (getEventId(ev) === id ? { ...ev, status: 'cancelled' as const } : ev))
      )
      setConfirmCancel(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel event')
    }
  }

  const publishedEvents = events.filter((ev) => ev.status === 'published')
  const cancelledEvents = events.filter((ev) => ev.status === 'cancelled')

  return (
    <>
      <div className="admin-page-header">
        <h1>Events</h1>
        <p>Create and manage wellness events, support groups, and educational sessions.</p>
      </div>

      {error && (
        <div className="admin-ac-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="admin-ev-toolbar">
        <button className="admin-ev-btn-create" onClick={openCreate}>
          <Plus size={16} /> Create Event
        </button>
        <span className="admin-ev-count">
          {publishedEvents.length} active event{publishedEvents.length !== 1 && 's'}
        </span>
      </div>

      {showForm && (
        <div className="admin-ev-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="admin-ev-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-ev-modal-header">
              <h3>{editingId ? 'Edit Event' : 'Create Event'}</h3>
              <button className="admin-ev-modal-close" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <div className="admin-ev-form">
              <label>
                Title *
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
              </label>
              <div className="admin-ev-form-row">
                <label>
                  Date *
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </label>
                <label>
                  Time *
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </label>
              </div>
              <label>
                Location
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Room name or URL" />
              </label>
              <div className="admin-ev-form-row">
                <label>
                  Type
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}>
                    <option value="wellness">Wellness</option>
                    <option value="support">Support Group</option>
                    <option value="education">Education</option>
                  </select>
                </label>
                <label className="admin-ev-virtual-label">
                  <input
                    type="checkbox"
                    checked={form.isVirtual}
                    onChange={(e) => setForm({ ...form, isVirtual: e.target.checked })}
                  />
                  Virtual event
                </label>
              </div>
              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the event"
                  rows={3}
                />
              </label>
              <div className="admin-ev-form-actions">
                <button
                  className="admin-ev-btn-save"
                  onClick={handleSave}
                  disabled={saving || !form.title.trim() || !form.date || !form.time}
                >
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Event'}
                </button>
                <button className="admin-ev-btn-cancel" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-ac-loading">Loading events...</div>
      ) : publishedEvents.length === 0 && cancelledEvents.length === 0 ? (
        <div className="admin-ev-empty">
          <Calendar size={40} strokeWidth={1.2} />
          <h3>No events yet</h3>
          <p>Create your first event to get started.</p>
        </div>
      ) : (
        <>
          {publishedEvents.length > 0 && (
            <div className="admin-ev-grid">
              {publishedEvents.map((ev) => (
                <EventCard
                  key={getEventId(ev) || ev.starts_at}
                  ev={ev}
                  confirmCancel={confirmCancel}
                  onEdit={openEdit}
                  onConfirmCancel={handleCancelEvent}
                  onCancelConfirm={() => setConfirmCancel(null)}
                  onRequestCancel={setConfirmCancel}
                />
              ))}
            </div>
          )}

          {publishedEvents.length === 0 && cancelledEvents.length > 0 && (
            <div className="admin-ev-empty admin-ev-empty--compact">
              <h3>No active events</h3>
              <p>All events have been cancelled.</p>
            </div>
          )}

          {cancelledEvents.length > 0 && (
            <>
              <h2 className="admin-ev-section-title">Cancelled Events</h2>
              <div className="admin-ev-grid">
                {cancelledEvents.map((ev) => (
                  <EventCard
                    key={getEventId(ev) || ev.starts_at}
                    ev={ev}
                    confirmCancel={confirmCancel}
                    onEdit={openEdit}
                    onConfirmCancel={handleCancelEvent}
                    onCancelConfirm={() => setConfirmCancel(null)}
                    onRequestCancel={setConfirmCancel}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
