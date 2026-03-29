import { useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, MapPin, Video, Users, X } from 'lucide-react'

interface AdminEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: 'wellness' | 'support' | 'education'
  isVirtual: boolean
  attendees: number
  description: string
}

const TYPE_LABELS: Record<AdminEvent['type'], string> = {
  wellness: 'Wellness',
  support: 'Support Group',
  education: 'Education',
}

const TYPE_COLORS: Record<AdminEvent['type'], string> = {
  wellness: '#2ecc71',
  support: '#9b59b6',
  education: '#3498db',
}

const INITIAL_EVENTS: AdminEvent[] = [
  {
    id: '1', title: 'Yoga & Meditation Session', date: '2025-04-05', time: '10:00',
    location: 'Community Hall A', type: 'wellness', isVirtual: false, attendees: 24,
    description: 'Gentle yoga and guided meditation session for patients and caregivers.',
  },
  {
    id: '2', title: 'Nutrition During Chemo', date: '2025-04-08', time: '14:00',
    location: 'Online (Zoom)', type: 'education', isVirtual: true, attendees: 56,
    description: 'Expert talk on maintaining nutrition during chemotherapy treatment.',
  },
  {
    id: '3', title: 'Breast Cancer Survivors Meet', date: '2025-04-12', time: '16:00',
    location: 'Support Centre Room 3', type: 'support', isVirtual: false, attendees: 18,
    description: 'Monthly meetup for breast cancer survivors to share experiences.',
  },
  {
    id: '4', title: 'Managing Treatment Side Effects', date: '2025-04-15', time: '11:00',
    location: 'Online (Teams)', type: 'education', isVirtual: true, attendees: 42,
    description: 'Webinar on coping with common side effects of cancer treatment.',
  },
  {
    id: '5', title: 'Art Therapy Workshop', date: '2025-04-20', time: '13:00',
    location: 'Activity Room B', type: 'wellness', isVirtual: false, attendees: 12,
    description: 'Creative art therapy session to promote emotional well-being.',
  },
]

const EMPTY_FORM: Omit<AdminEvent, 'id' | 'attendees'> = {
  title: '', date: '', time: '', location: '', type: 'wellness', isVirtual: false, description: '',
}

export function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>(INITIAL_EVENTS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(ev: AdminEvent) {
    setForm({
      title: ev.title, date: ev.date, time: ev.time, location: ev.location,
      type: ev.type, isVirtual: ev.isVirtual, description: ev.description,
    })
    setEditingId(ev.id)
    setShowForm(true)
  }

  function handleSave() {
    if (!form.title.trim() || !form.date || !form.time) return
    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingId ? { ...ev, ...form } : ev))
      )
    } else {
      setEvents((prev) => [
        { ...form, id: Date.now().toString(), attendees: 0 },
        ...prev,
      ])
    }
    setShowForm(false)
    setEditingId(null)
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
    setConfirmDelete(null)
  }

  function formatEventDate(date: string, time: string): string {
    try {
      const d = new Date(`${date}T${time}`)
      return d.toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } catch { return `${date} ${time}` }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Events</h1>
        <p>Create and manage wellness events, support groups, and educational sessions.</p>
      </div>

      <div className="admin-ev-toolbar">
        <button className="admin-ev-btn-create" onClick={openCreate}>
          <Plus size={16} /> Create Event
        </button>
        <span className="admin-ev-count">{events.length} event{events.length !== 1 && 's'}</span>
      </div>

      {/* Create/Edit modal */}
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
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AdminEvent['type'] })}>
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
                <button className="admin-ev-btn-save" onClick={handleSave} disabled={!form.title.trim() || !form.date || !form.time}>
                  {editingId ? 'Save Changes' : 'Create Event'}
                </button>
                <button className="admin-ev-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="admin-ev-empty">
          <Calendar size={40} strokeWidth={1.2} />
          <h3>No events yet</h3>
          <p>Create your first event to get started.</p>
        </div>
      ) : (
        <div className="admin-ev-grid">
          {events.map((ev) => (
            <div key={ev.id} className="admin-ev-card">
              <div className="admin-ev-card-type" style={{ background: TYPE_COLORS[ev.type] }}>
                {TYPE_LABELS[ev.type]}
              </div>
              <h3 className="admin-ev-card-title">{ev.title}</h3>
              <div className="admin-ev-card-details">
                <span><Calendar size={14} /> {formatEventDate(ev.date, ev.time)}</span>
                <span>
                  {ev.isVirtual ? <Video size={14} /> : <MapPin size={14} />}
                  {ev.location}
                </span>
                <span><Users size={14} /> {ev.attendees} attendee{ev.attendees !== 1 && 's'}</span>
              </div>
              {ev.description && <p className="admin-ev-card-desc">{ev.description}</p>}
              <div className="admin-ev-card-actions">
                <button onClick={() => openEdit(ev)} title="Edit"><Edit2 size={14} /> Edit</button>
                {confirmDelete === ev.id ? (
                  <span className="admin-ev-confirm">
                    <span>Delete?</span>
                    <button className="admin-ev-btn-yes" onClick={() => handleDelete(ev.id)}>Yes</button>
                    <button className="admin-ev-btn-no" onClick={() => setConfirmDelete(null)}>No</button>
                  </span>
                ) : (
                  <button className="admin-ev-btn-delete" onClick={() => setConfirmDelete(ev.id)} title="Delete">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
