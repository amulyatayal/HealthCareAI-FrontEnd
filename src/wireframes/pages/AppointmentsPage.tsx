import { useState, useEffect } from 'react'
import { Plus, Bell, Clock, MapPin, Calendar, Check, BellRing, AlertTriangle } from 'lucide-react'
import { getAppointments, createAppointment, isConsentError } from '../../services/api'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const appointments = [
  {
    id: 1,
    title: 'Dr. Thompson - Oncology',
    date: 'Jan 21, 2024',
    time: '10:30 AM',
    location: 'City Hospital, Room 302',
    reminder: true,
    status: 'upcoming' as const,
  },
  {
    id: 2,
    title: 'Blood Test',
    date: 'Jan 25, 2024',
    time: '9:00 AM',
    location: 'Lab Corp',
    reminder: true,
    status: 'upcoming' as const,
  },
  {
    id: 3,
    title: 'Radiation Therapy',
    date: 'Jan 28, 2024',
    time: '2:00 PM',
    location: 'Cancer Treatment Center',
    reminder: true,
    status: 'upcoming' as const,
  },
  {
    id: 4,
    title: 'Dr. Smith - General',
    date: 'Jan 15, 2024',
    time: '11:00 AM',
    location: 'Medical Center',
    reminder: false,
    status: 'past' as const,
  },
]

export function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [showAdd, setShowAdd] = useState(false)
  const [appointmentList, setAppointmentList] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    reminder: boolean;
    status: 'upcoming' | 'past' | 'cancelled';
  }[]>(appointments)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newReminder, setNewReminder] = useState(true)
  const [saving, setSaving] = useState(false)
  const [consentBlocked, setConsentBlocked] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getAppointments()
        if (!cancelled && data.appointments.length > 0) {
          setAppointmentList(data.appointments.map((a, i) => ({
            id: i + 100,
            title: a.title,
            date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: a.time,
            location: a.location,
            reminder: a.reminder,
            status: a.status,
          })))
        }
      } catch {
        // API not available
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleCreateAppointment = async () => {
    if (!newTitle || !newDate || !newTime) return
    setSaving(true)
    setConsentBlocked(false)
    try {
      await createAppointment({ title: newTitle, date: newDate, time: newTime, location: newLocation, reminder: newReminder })
    } catch (err) {
      if (isConsentError(err)) {
        setConsentBlocked(true)
        setSaving(false)
        return
      }
    }
    const newApt = {
      id: Date.now(),
      title: newTitle,
      date: new Date(newDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: newTime,
      location: newLocation,
      reminder: newReminder,
      status: 'upcoming' as const,
    }
    setAppointmentList((prev) => [newApt, ...prev])
    setShowAdd(false)
    setNewTitle('')
    setNewDate('')
    setNewTime('')
    setNewLocation('')
    setSaving(false)
  }

  const filteredAppointments = appointmentList.filter(
    apt => activeTab === 'upcoming' ? apt.status === 'upcoming' : apt.status === 'past'
  )

  return (
    <WireframeLayout title="Appointments" showBack>
      {consentBlocked && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, marginBottom: 12, fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Data consent is required to create appointments. Please re-enable <strong>Health Data</strong> consent in <strong>Profile → Privacy & Data Rights → Manage Data Consent</strong>.</span>
        </div>
      )}
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
              <input className="wf-input" placeholder="e.g., Doctor's appointment" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="wf-grid-2">
              <div>
                <label className="wf-label">Date</label>
                <input className="wf-input" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <div>
                <label className="wf-label">Time</label>
                <input className="wf-input" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="wf-label">Location</label>
              <input className="wf-input" placeholder="Hospital/Clinic name" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
            </div>
            <div>
              <label className="wf-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={newReminder} onChange={(e) => setNewReminder(e.target.checked)} />
                Set reminder
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="wf-btn wf-btn-primary" style={{ flex: 1 }} disabled={!newTitle || !newDate || !newTime || saving} onClick={handleCreateAppointment}>
                {saving ? 'Saving...' : 'Save'}
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
            <span style={{ fontSize: '13px' }}>{filteredAppointments[0].reminder ? 'Reminder set' : 'No reminder'}</span>
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
                background: apt.status === 'past' ? 'var(--wf-gray-100)' : 'var(--wf-rose-50)',
                borderRadius: '10px'
              }}
            >
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: apt.status === 'past' ? 'var(--wf-gray-500)' : 'var(--wf-rose-500)' 
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
                {apt.status === 'past' && (
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
                  Reminder set
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
