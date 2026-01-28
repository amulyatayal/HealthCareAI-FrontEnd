import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const commonSymptoms = [
  { id: 1, name: 'Fatigue', icon: '😴', tracked: true },
  { id: 2, name: 'Nausea', icon: '🤢', tracked: true },
  { id: 3, name: 'Pain', icon: '😣', tracked: true },
  { id: 4, name: 'Appetite Loss', icon: '🍽️', tracked: false },
  { id: 5, name: 'Insomnia', icon: '🌙', tracked: true },
  { id: 6, name: 'Anxiety', icon: '😰', tracked: false },
  { id: 7, name: 'Brain Fog', icon: '🌫️', tracked: false },
  { id: 8, name: 'Joint Pain', icon: '🦴', tracked: true },
]

const recentLogs = [
  { date: 'Today', symptoms: [{ name: 'Fatigue', severity: 6 }, { name: 'Nausea', severity: 3 }] },
  { date: 'Yesterday', symptoms: [{ name: 'Fatigue', severity: 7 }, { name: 'Pain', severity: 4 }] },
  { date: 'Jan 18', symptoms: [{ name: 'Fatigue', severity: 5 }, { name: 'Insomnia', severity: 6 }] },
]

const trends = [
  { name: 'Fatigue', direction: 'down', change: '-12%' },
  { name: 'Nausea', direction: 'stable', change: '0%' },
  { name: 'Pain', direction: 'up', change: '+8%' },
]

export function SymptomsPage() {
  const [showLog, setShowLog] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [severity, setSeverity] = useState(5)

  const getSeverityColor = (value: number) => {
    if (value <= 3) return '#16a34a'
    if (value <= 6) return '#d97706'
    return '#dc2626'
  }

  return (
    <WireframeLayout title="Symptom Tracker" showBack>
      {/* Quick Log */}
      {showLog ? (
        <WireframeCard title="Log Symptom">
          <div style={{ marginBottom: '16px' }}>
            <label className="wf-label">Select Symptom</label>
            <div className="wf-bubbles">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  className={`wf-bubble ${selectedSymptom === symptom.name ? 'selected' : ''}`}
                  onClick={() => setSelectedSymptom(symptom.name)}
                >
                  <span style={{ marginRight: '4px' }}>{symptom.icon}</span>
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>

          {selectedSymptom && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label className="wf-label">Severity (1-10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className="wf-slider"
                    style={{ flex: 1 }}
                  />
                  <span 
                    style={{ 
                      fontSize: '24px', 
                      fontWeight: '700',
                      color: getSeverityColor(severity),
                      width: '40px',
                      textAlign: 'center'
                    }}
                  >
                    {severity}
                  </span>
                </div>
                <div className="wf-mood-labels">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="wf-label">Notes (optional)</label>
                <textarea
                  className="wf-input wf-textarea"
                  placeholder="When did it start? What helps?"
                  rows={2}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => setShowLog(false)}>
              Cancel
            </button>
            <button className="wf-btn wf-btn-primary" style={{ flex: 1 }} disabled={!selectedSymptom}>
              Save
            </button>
          </div>
        </WireframeCard>
      ) : (
        <button 
          className="wf-btn wf-btn-primary wf-btn-full"
          style={{ marginBottom: '16px' }}
          onClick={() => setShowLog(true)}
        >
          <Plus size={18} />
          Log Symptom
        </button>
      )}

      {/* Trends */}
      <WireframeCard title="Weekly Trends">
        {trends.map((trend) => (
          <div 
            key={trend.name}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid var(--wf-gray-100)'
            }}
          >
            <span style={{ fontSize: '15px', color: 'var(--wf-gray-700)' }}>{trend.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {trend.direction === 'down' && <TrendingDown size={18} style={{ color: '#16a34a' }} />}
              {trend.direction === 'up' && <TrendingUp size={18} style={{ color: '#dc2626' }} />}
              {trend.direction === 'stable' && <Minus size={18} style={{ color: '#d97706' }} />}
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: trend.direction === 'down' ? '#16a34a' : trend.direction === 'up' ? '#dc2626' : '#d97706'
              }}>
                {trend.change}
              </span>
            </div>
          </div>
        ))}
      </WireframeCard>

      {/* Recent Logs */}
      <div className="wf-section-header">
        <span className="wf-section-title">Recent Logs</span>
      </div>

      {recentLogs.map((log) => (
        <WireframeCard key={log.date}>
          <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)', marginBottom: '8px' }}>
            {log.date}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {log.symptoms.map((symptom) => (
              <div 
                key={symptom.name}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'var(--wf-gray-100)',
                  borderRadius: '8px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{symptom.name}</span>
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: getSeverityColor(symptom.severity)
                  }}
                >
                  {symptom.severity}/10
                </span>
              </div>
            ))}
          </div>
        </WireframeCard>
      ))}

      {/* Symptoms being tracked */}
      <WireframeCard title="Tracked Symptoms">
        <p style={{ fontSize: '13px', color: 'var(--wf-gray-500)', marginBottom: '12px' }}>
          Tap to add or remove from quick log
        </p>
        <div className="wf-bubbles">
          {commonSymptoms.map((symptom) => (
            <button
              key={symptom.id}
              className={`wf-bubble ${symptom.tracked ? 'selected' : ''}`}
            >
              <span style={{ marginRight: '4px' }}>{symptom.icon}</span>
              {symptom.name}
            </button>
          ))}
        </div>
      </WireframeCard>

      {/* Alert threshold info */}
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 16px',
          background: '#fef3c7',
          borderRadius: '12px',
          marginTop: '8px'
        }}
      >
        <AlertCircle size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontSize: '13px', color: '#92400e', fontWeight: '500' }}>
            Symptom alerts enabled
          </p>
          <p style={{ fontSize: '12px', color: '#b45309' }}>
            You'll be notified if any symptom reaches severity 8+
          </p>
        </div>
      </div>
    </WireframeLayout>
  )
}
