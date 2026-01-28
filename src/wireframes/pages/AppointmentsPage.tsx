import { useState } from 'react'
import { Plus, Bell, Clock, MapPin, Calendar, Check, BellRing } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const appointments = [
  {
    id: 1,
    title: 'Dr. Thompson - Oncology',
    date: 'Jan 21, 2024',
    time: '10:30 AM',
    location: 'City Hospital, Room 302',
    reminder: '1 day before',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Blood Test',
    date: 'Jan 25, 2024',
    time: '9:00 AM',
    location: 'Lab Corp',
    reminder: '2 hours before',
    status: 'upcoming'
  },
  {
    id: 3,
    title: 'Radiation Therapy',
    date: 'Jan 28, 2024',
    time: '2:00 PM',
    location: 'Cancer Treatment Center',
    reminder: '1 day before',
    status: 'upcoming'
  },
  {
    id: 4,
    title: 'Dr. Smith - General',
    date: 'Jan 15, 2024',
    time: '11:00 AM',
    location: 'Medical Center',
    reminder: null,
    status: 'completed'
  },
]

export function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [showAdd, setShowAdd] = useState(false)

  const filteredAppointments = appointments.filter(
    apt => activeTab === 'upcoming' ? apt.status === 'upcoming' : apt.status === 'completed'
  )

  return (
    <WireframeLayout title="Appointments" showBack>
      {/* Tabs */}
      <div className="wf-tabs">
        <button 
          className={`wf-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`wf-tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      {/* Add Appointment Form */}
      {showAdd && (
        <WireframeCard title="New Appointment">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="wf-label">Title</label>
              <input className="wf-input" placeholder="e.g., Doctor's appointment" />
            </div>
            <div className="wf-grid-2">
              <div>
                <label className="wf-label">Date</label>
                <input className="wf-input" type="date" />
              </div>
              <div>
                <label className="wf-label">Time</label>
                <input className="wf-input" type="time" />
              </div>
            </div>
            <div>
              <label className="wf-label">Location</label>
              <input className="wf-input" placeholder="Hospital/Clinic name" />
            </div>
            <div>
              <label className="wf-label">Reminder</label>
              <select className="wf-input">
                <option>1 hour before</option>
                <option>2 hours before</option>
                <option>1 day before</option>
                <option>2 days before</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="wf-btn wf-btn-primary" style={{ flex: 1 }}>
                Save
              </button>
            </div>
          </div>
        </WireframeCard>
      )}

      {/* Next Appointment Highlight */}
      {activeTab === 'upcoming' && filteredAppointments.length > 0 && (
        <WireframeCard>
          <div 
            style={{ 
              background: 'linear-gradient(135deg, var(--wf-rose-400), var(--wf-rose-500))',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              marginBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calendar size={18} />
              <span style={{ fontSize: '13px', opacity: 0.9 }}>NEXT APPOINTMENT</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              {filteredAppointments[0].title}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', opacity: 0.9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {filteredAppointments[0].date} at {filteredAppointments[0].time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} />
                {filteredAppointments[0].location}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wf-gray-600)' }}>
            <BellRing size={16} />
            <span style={{ fontSize: '13px' }}>Reminder set: {filteredAppointments[0].reminder}</span>
          </div>
        </WireframeCard>
      )}

      {/* Appointment List */}
      <div className="wf-section-header">
        <span className="wf-section-title">
          {activeTab === 'upcoming' ? 'All Upcoming' : 'Past Appointments'}
        </span>
      </div>

      {filteredAppointments.map((apt) => (
        <WireframeCard key={apt.id}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div 
              style={{ 
                width: '48px', 
                textAlign: 'center',
                padding: '6px',
                background: apt.status === 'completed' ? 'var(--wf-gray-100)' : 'var(--wf-rose-50)',
                borderRadius: '10px'
              }}
            >
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: apt.status === 'completed' ? 'var(--wf-gray-500)' : 'var(--wf-rose-500)' 
              }}>
                {apt.date.split(' ')[1].replace(',', '')}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--wf-gray-500)', textTransform: 'uppercase' }}>
                {apt.date.split(' ')[0]}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--wf-gray-800)' }}>
                  {apt.title}
                </h3>
                {apt.status === 'completed' && (
                  <Check size={16} style={{ color: '#16a34a' }} />
                )}
              </div>
              
              <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)', marginBottom: '4px' }}>
                <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {apt.time}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {apt.location}
              </div>
              
              {apt.reminder && apt.status === 'upcoming' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'var(--wf-rose-500)'
                }}>
                  <Bell size={12} />
                  {apt.reminder}
                </div>
              )}
            </div>
          </div>
        </WireframeCard>
      ))}

      {!showAdd && (
        <button className="wf-fab" onClick={() => setShowAdd(true)}>
          <Plus size={24} />
        </button>
      )}
    </WireframeLayout>
  )
}
