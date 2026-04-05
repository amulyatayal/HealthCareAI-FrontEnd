import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, Minus, AlertCircle, AlertTriangle } from 'lucide-react'
import { logSymptom, getSymptomHistory, getSymptomTrends, isConsentError } from '../../services/api'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const SYMPTOM_ICONS: Record<string, string> = {
  'Fatigue': '😴',
  'Nausea': '🤢',
  'Pain': '😣',
  'Appetite Loss': '🍽️',
  'Insomnia': '🌙',
  'Anxiety': '😰',
  'Brain Fog': '🌫️',
  'Joint Pain': '🦴',
}

const commonSymptoms = [
  { id: 1, name: 'Fatigue', icon: '😴' },
  { id: 2, name: 'Nausea', icon: '🤢' },
  { id: 3, name: 'Pain', icon: '😣' },
  { id: 4, name: 'Appetite Loss', icon: '🍽️' },
  { id: 5, name: 'Insomnia', icon: '🌙' },
  { id: 6, name: 'Anxiety', icon: '😰' },
  { id: 7, name: 'Brain Fog', icon: '🌫️' },
  { id: 8, name: 'Joint Pain', icon: '🦴' },
]

const MOCK_RECENT_LOGS = [
  { date: 'Today', symptoms: [{ name: 'Fatigue', severity: 6, notes: 'Felt drained after morning walk' }, { name: 'Nausea', severity: 3, notes: null as string | null }] },
  { date: 'Yesterday', symptoms: [{ name: 'Fatigue', severity: 7, notes: 'Could barely get out of bed' }, { name: 'Pain', severity: 4, notes: null as string | null }] },
  { date: 'Jan 18', symptoms: [{ name: 'Fatigue', severity: 5, notes: null as string | null }, { name: 'Insomnia', severity: 6, notes: 'Woke up multiple times' }] },
]

const MOCK_TRENDS = [
  { name: 'Fatigue', direction: 'down', change: '-12%' },
  { name: 'Nausea', direction: 'stable', change: '0%' },
  { name: 'Pain', direction: 'up', change: '+8%' },
]

export function SymptomsPage() {
  const [showLog, setShowLog] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [severity, setSeverity] = useState(5)
  const [symptomNote, setSymptomNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [consentBlocked, setConsentBlocked] = useState(false)
  const [recentLogs, setRecentLogs] = useState(MOCK_RECENT_LOGS)
  const [trends, setTrends] = useState(MOCK_TRENDS)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function loadHistory() {
      try {
        const data = await getSymptomHistory(30)
        if (cancelled || data.entries.length === 0) return
        const grouped = new Map<string, { name: string; severity: number; notes: string | null }[]>()
        for (const e of data.entries) {
          const dateStr = new Date(e.timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
          if (!grouped.has(dateStr)) grouped.set(dateStr, [])
          grouped.get(dateStr)!.push({ name: e.symptom_name, severity: e.severity, notes: e.notes })
        }
        const logs = Array.from(grouped, ([date, symptoms]) => ({ date, symptoms })).slice(0, 5)
        if (!cancelled) setRecentLogs(logs)
      } catch { /* keep mock data */ }
    }
    async function loadTrends() {
      try {
        const data = await getSymptomTrends()
        if (cancelled || data.trends.length === 0) return
        const mapped = data.trends.map((t) => ({
          name: t.symptom_name,
          direction: t.direction,
          change: `${t.change_percentage >= 0 ? '+' : ''}${t.change_percentage}%`,
        }))
        if (!cancelled) setTrends(mapped)
      } catch { /* keep mock data */ }
    }
    loadHistory()
    loadTrends()
    return () => { cancelled = true }
  }, [refreshKey])

  const handleSaveSymptom = async () => {
    if (!selectedSymptom) return
    setSaving(true)
    setConsentBlocked(false)
    try {
      await logSymptom({ symptom_name: selectedSymptom, severity, notes: symptomNote || undefined })
    } catch (err) {
      if (isConsentError(err)) {
        setConsentBlocked(true)
        setSaving(false)
        return
      }
    }
    setSaving(false)
    setShowLog(false)
    setSelectedSymptom(null)
    setSeverity(5)
    setSymptomNote('')
    setRefreshKey((k) => k + 1)
  }

  const getSeverityColor = (value: number) => {
    if (value <= 3) return '#16a34a'
    if (value <= 6) return '#d97706'
    return '#dc2626'
  }

  return (
    <WireframeLayout title="Symptom Tracker" showBack>
      {consentBlocked && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, marginBottom: 12, fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Data consent is required to log symptoms. Please re-enable <strong>Health Data</strong> consent in <strong>Profile → Privacy & Data Rights → Manage Data Consent</strong>.</span>
        </div>
      )}
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
                  value={symptomNote}
                  onChange={(e) => setSymptomNote(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => { setShowLog(false); setSelectedSymptom(null); setSymptomNote('') }}>
              Cancel
            </button>
            <button className="wf-btn wf-btn-primary" style={{ flex: 1 }} disabled={!selectedSymptom || saving} onClick={handleSaveSymptom}>
              {saving ? 'Saving...' : 'Save'}
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
            <span style={{ fontSize: '15px', color: 'var(--wf-gray-700)' }}>
              {SYMPTOM_ICONS[trend.name] && <span style={{ marginRight: '6px' }}>{SYMPTOM_ICONS[trend.name]}</span>}
              {trend.name}
            </span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {log.symptoms.map((symptom) => (
              <div key={symptom.name}>
                <div 
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'var(--wf-gray-100)',
                    borderRadius: symptom.notes ? '8px 8px 0 0' : '8px',
                  }}
                >
                  <span style={{ fontSize: '14px', flex: 1 }}>
                    {SYMPTOM_ICONS[symptom.name] && <span style={{ marginRight: '6px' }}>{SYMPTOM_ICONS[symptom.name]}</span>}
                    {symptom.name}
                  </span>
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
                {symptom.notes && (
                  <div style={{
                    padding: '6px 12px 8px',
                    background: 'var(--wf-gray-50)',
                    borderRadius: '0 0 8px 8px',
                    borderTop: '1px dashed var(--wf-gray-200)',
                    fontSize: '13px',
                    color: 'var(--wf-gray-500)',
                    fontStyle: 'italic',
                  }}>
                    📝 {symptom.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </WireframeCard>
      ))}

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
