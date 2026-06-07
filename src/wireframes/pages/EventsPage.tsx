import { useState, useEffect } from 'react'
import { MapPin, Users, Clock, AlertTriangle, X } from 'lucide-react'
import { getEvents, rsvpEvent, cancelRsvp, isConsentError } from '../../services/api'
import type { PatientEvent } from '../../types'
import {
  formatEventCalendarParts,
  formatEventTime,
  formatStartsAt,
  getEventDaysInMonth,
} from '../../utils/eventDisplay'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const eventTypeColors: Record<string, { bg: string; text: string }> = {
  wellness: { bg: '#dcfce7', text: '#16a34a' },
  support: { bg: '#dbeafe', text: '#2563eb' },
  education: { bg: '#fef3c7', text: '#d97706' },
}

const CALENDAR_YEAR = new Date().getFullYear()
const CALENDAR_MONTH = new Date().getMonth()
const TODAY = new Date().getDate()

function patchEvent(events: PatientEvent[], updated: PatientEvent): PatientEvent[] {
  return events.map((e) => (e.id === updated.id ? updated : e))
}

export function EventsPage() {
  const [events, setEvents] = useState<PatientEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my'>('upcoming')
  const [rsvpLoadingId, setRsvpLoadingId] = useState<string | null>(null)
  const [consentBlocked, setConsentBlocked] = useState(false)
  const [detailEventId, setDetailEventId] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    setError('')
    try {
      const data = await getEvents({ when: 'upcoming' })
      setEvents(data.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  async function handleRsvp(event: PatientEvent) {
    if (!event.id?.trim()) return
    setRsvpLoadingId(event.id)
    setConsentBlocked(false)
    setError('')
    try {
      const { event: updated } = await rsvpEvent(event.id)
      setEvents((prev) => patchEvent(prev, updated))
    } catch (err) {
      if (isConsentError(err) && err.consentType === 'community') {
        setConsentBlocked(true)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to RSVP')
      }
    } finally {
      setRsvpLoadingId(null)
    }
  }

  async function handleCancelRsvp(event: PatientEvent) {
    if (!event.id?.trim()) return
    setRsvpLoadingId(event.id)
    setError('')
    try {
      const { event: updated } = await cancelRsvp(event.id)
      setEvents((prev) => patchEvent(prev, updated))
      if (detailEventId === event.id) {
        setDetailEventId(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel RSVP')
    } finally {
      setRsvpLoadingId(null)
    }
  }

  const displayedEvents =
    activeTab === 'upcoming' ? events : events.filter((e) => e.user_has_rsvp)

  const eventDays = getEventDaysInMonth(events, CALENDAR_YEAR, CALENDAR_MONTH)
  const detailEvent = detailEventId ? events.find((e) => e.id === detailEventId) : null

  return (
    <WireframeLayout title="Events" showBack>
      {consentBlocked && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
          marginBottom: 12, fontSize: 13, color: '#991b1b', lineHeight: 1.5,
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Community consent is required to RSVP to events. Please enable <strong>Community</strong> consent in{' '}
            <strong>Profile → Privacy &amp; Data Rights → Manage Data Consent</strong>.
          </span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
          marginBottom: 12, fontSize: 13, color: '#991b1b', lineHeight: 1.5,
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      <div className="wf-tabs">
        <button
          className={`wf-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`wf-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Events
        </button>
      </div>

      <WireframeCard>
        <div className="wf-calendar-mini">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} style={{ fontWeight: '600', color: 'var(--wf-gray-500)', fontSize: '12px', padding: '8px' }}>
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).slice(0, 28).map((day) => (
            <div
              key={day}
              className={`wf-calendar-day ${day === TODAY ? 'today' : ''} ${eventDays.includes(day) ? 'has-event' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </WireframeCard>

      <div className="wf-section-header">
        <span className="wf-section-title">
          {activeTab === 'upcoming' ? 'Upcoming Events' : "Events I'm Attending"}
        </span>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--wf-gray-500)', padding: '24px 0' }}>Loading events...</p>
      ) : displayedEvents.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--wf-gray-500)', padding: '24px 16px', fontSize: 14 }}>
          {activeTab === 'upcoming'
            ? 'No upcoming events from your care team.'
            : "You haven't RSVP'd to any events yet."}
        </p>
      ) : (
        displayedEvents.map((event) => {
          const cal = formatEventCalendarParts(event.starts_at)
          const colors = eventTypeColors[event.type] ?? eventTypeColors.wellness

          return (
            <WireframeCard key={event.id}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '56px', textAlign: 'center', padding: '8px',
                  background: 'var(--wf-rose-50)', borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--wf-rose-500)' }}>
                    {cal.day}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--wf-gray-500)', textTransform: 'uppercase' }}>
                    {cal.month}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
                      {event.title}
                    </h3>
                    <span className="wf-badge" style={{ background: colors.bg, color: colors.text }}>
                      {event.type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                      <Clock size={14} />
                      {formatEventTime(event.starts_at)}
                    </div>
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                        <MapPin size={14} />
                        {event.location}
                        {event.is_virtual && (
                          <span className="wf-badge wf-badge-primary" style={{ marginLeft: '4px' }}>Virtual</span>
                        )}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                      <Users size={14} />
                      {event.attendee_count} attending
                    </div>
                  </div>

                  {activeTab === 'upcoming' ? (
                    <button
                      className="wf-btn wf-btn-outline wf-btn-sm"
                      style={{ marginTop: '12px' }}
                      disabled={rsvpLoadingId === event.id}
                      onClick={() => event.user_has_rsvp ? handleCancelRsvp(event) : handleRsvp(event)}
                    >
                      {rsvpLoadingId === event.id
                        ? '...'
                        : event.user_has_rsvp
                          ? 'Cancel RSVP'
                          : 'RSVP'}
                    </button>
                  ) : (
                    <button
                      className="wf-btn wf-btn-outline wf-btn-sm"
                      style={{ marginTop: '12px' }}
                      onClick={() => setDetailEventId(event.id)}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </WireframeCard>
          )
        })
      )}

      {detailEvent && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
          }}
          onClick={() => setDetailEventId(null)}
        >
          <div
            style={{
              background: 'white', borderRadius: '16px 16px 0 0', padding: '20px',
              width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--wf-gray-800)', margin: 0 }}>
                {detailEvent.title}
              </h3>
              <button
                onClick={() => setDetailEventId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--wf-gray-500)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: 14, color: 'var(--wf-gray-600)', margin: '0 0 8px' }}>
              {formatStartsAt(detailEvent.starts_at)}
            </p>
            {detailEvent.location && (
              <p style={{ fontSize: 14, color: 'var(--wf-gray-500)', margin: '0 0 8px' }}>
                {detailEvent.location}{detailEvent.is_virtual ? ' (Virtual)' : ''}
              </p>
            )}
            <p style={{ fontSize: 14, color: 'var(--wf-gray-500)', margin: '0 0 12px' }}>
              {detailEvent.attendee_count} attending
            </p>
            {detailEvent.description && (
              <p style={{ fontSize: 14, color: 'var(--wf-gray-700)', lineHeight: 1.5, margin: '0 0 16px' }}>
                {detailEvent.description}
              </p>
            )}
            <button
              className="wf-btn wf-btn-outline wf-btn-sm"
              disabled={rsvpLoadingId === detailEvent.id}
              onClick={() => handleCancelRsvp(detailEvent)}
            >
              {rsvpLoadingId === detailEvent.id ? '...' : 'Cancel RSVP'}
            </button>
          </div>
        </div>
      )}
    </WireframeLayout>
  )
}
