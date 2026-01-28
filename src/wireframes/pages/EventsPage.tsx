import { useState } from 'react'
import { MapPin, Users, Plus, Clock } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const upcomingEvents = [
  {
    id: 1,
    title: 'Yoga for Recovery',
    date: 'Jan 22, 2024',
    time: '10:00 AM',
    location: 'Community Center',
    attendees: 18,
    type: 'wellness',
    isVirtual: false
  },
  {
    id: 2,
    title: 'Virtual Support Group',
    date: 'Jan 23, 2024',
    time: '7:00 PM',
    location: 'Zoom',
    attendees: 45,
    type: 'support',
    isVirtual: true
  },
  {
    id: 3,
    title: 'Nutrition Workshop',
    date: 'Jan 25, 2024',
    time: '2:00 PM',
    location: 'Health Hub',
    attendees: 24,
    type: 'education',
    isVirtual: false
  },
  {
    id: 4,
    title: 'Mindfulness Meditation',
    date: 'Jan 27, 2024',
    time: '9:00 AM',
    location: 'Online',
    attendees: 32,
    type: 'wellness',
    isVirtual: true
  },
]

const eventTypeColors: Record<string, { bg: string; text: string }> = {
  wellness: { bg: '#dcfce7', text: '#16a34a' },
  support: { bg: '#dbeafe', text: '#2563eb' },
  education: { bg: '#fef3c7', text: '#d97706' },
}

export function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my'>('upcoming')

  return (
    <WireframeLayout title="Events" showBack>
      {/* Tabs */}
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

      {/* Mini Calendar */}
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
              className={`wf-calendar-day ${day === 20 ? 'today' : ''} ${[22, 23, 25, 27].includes(day) ? 'has-event' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </WireframeCard>

      {/* Event List */}
      <div className="wf-section-header">
        <span className="wf-section-title">
          {activeTab === 'upcoming' ? 'Upcoming Events' : 'Events I\'m Attending'}
        </span>
      </div>

      {upcomingEvents.map((event) => (
        <WireframeCard key={event.id}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div 
              style={{ 
                width: '56px', 
                textAlign: 'center',
                padding: '8px',
                background: 'var(--wf-rose-50)',
                borderRadius: '12px'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--wf-rose-500)' }}>
                {event.date.split(' ')[1].replace(',', '')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--wf-gray-500)', textTransform: 'uppercase' }}>
                {event.date.split(' ')[0]}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
                  {event.title}
                </h3>
                <span 
                  className="wf-badge"
                  style={{ 
                    background: eventTypeColors[event.type].bg, 
                    color: eventTypeColors[event.type].text 
                  }}
                >
                  {event.type}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                  <Clock size={14} />
                  {event.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                  <MapPin size={14} />
                  {event.location}
                  {event.isVirtual && (
                    <span className="wf-badge wf-badge-primary" style={{ marginLeft: '4px' }}>Virtual</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                  <Users size={14} />
                  {event.attendees} attending
                </div>
              </div>
              
              <button className="wf-btn wf-btn-outline wf-btn-sm" style={{ marginTop: '12px' }}>
                {activeTab === 'upcoming' ? 'RSVP' : 'View Details'}
              </button>
            </div>
          </div>
        </WireframeCard>
      ))}

      <button className="wf-fab">
        <Plus size={24} />
      </button>
    </WireframeLayout>
  )
}
