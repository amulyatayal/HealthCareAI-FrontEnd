import { useState, useEffect } from 'react'
import { Check, TrendingUp, AlertTriangle } from 'lucide-react'
import { logMood, getMoodHistory, isConsentError } from '../../services/api'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard, MoodSlider } from '../components'
import { isBasicMoodEntry, normalizeMoodEntry } from '../utils/moodEntries'

type HistoryRow = { id: string; date: string; value: number | null; note: string | null }

export function BasicMoodPage() {
  const [mood, setMood] = useState(5)
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')
  const [consentBlocked, setConsentBlocked] = useState(false)

  const [history, setHistory] = useState<HistoryRow[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getMoodHistory(7)
        if (!cancelled) {
          const basicEntries = data.entries
            .map((e) => normalizeMoodEntry(e as Parameters<typeof normalizeMoodEntry>[0]))
            .filter(isBasicMoodEntry)
          setHistory(basicEntries.map((e) => ({
            id: e.entry_id,
            date: new Date(e.timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            value: e.mood_score ?? null,
            note: e.note,
          })))
        }
      } catch {
        // API not available yet – keep empty history
      }
    }
    load()
    return () => { cancelled = true }
  }, [saved])

  const handleSave = async () => {
    setConsentBlocked(false)
    try {
      await logMood({ entry_type: 'basic', mood_score: mood, note: note || undefined })
    } catch (err) {
      if (isConsentError(err)) {
        setConsentBlocked(true)
        return
      }
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <WireframeLayout title="Mood Diary" showBack>
      {consentBlocked && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, marginBottom: 12, fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Data consent is required to log moods. Please re-enable <strong>Health Data</strong> consent in <strong>Profile → Privacy & Data Rights → Manage Data Consent</strong>.</span>
        </div>
      )}
      {/* Main Mood Input */}
      <WireframeCard title="How are you feeling?">
        <MoodSlider value={mood} onChange={setMood} />
        
        <div style={{ marginTop: '24px' }}>
          <label className="wf-label">Add a note (optional)</label>
          <textarea
            className="wf-input wf-textarea"
            placeholder="What's on your mind today?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <button 
          className="wf-btn wf-btn-primary wf-btn-full"
          style={{ marginTop: '16px' }}
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check size={18} />
              Saved!
            </>
          ) : (
            'Save Today\'s Mood'
          )}
        </button>
      </WireframeCard>

      {/* Quick Mood Buttons */}
      <WireframeCard title="Quick Log">
        <div className="wf-grid-3">
          {[
            { emoji: '😢', label: 'Low', value: 2 },
            { emoji: '😐', label: 'Okay', value: 5 },
            { emoji: '😊', label: 'Good', value: 7 },
            { emoji: '😄', label: 'Great', value: 9 },
            { emoji: '🤩', label: 'Amazing', value: 10 },
            { emoji: '😔', label: 'Sad', value: 3 },
          ].map((item) => (
            <button
              key={item.label}
              className="wf-btn wf-btn-secondary"
              style={{ flexDirection: 'column', padding: '12px 8px' }}
              onClick={() => setMood(item.value)}
            >
              <span style={{ fontSize: '24px' }}>{item.emoji}</span>
              <span style={{ fontSize: '12px', marginTop: '4px' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </WireframeCard>

      {/* History */}
      <WireframeCard 
        title="Recent History"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a' }}>
            <TrendingUp size={16} />
            <span style={{ fontSize: '13px' }}>+12%</span>
          </div>
        }
      >
        {history.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', margin: 0, textAlign: 'center' }}>
            No basic mood entries yet.
          </p>
        ) : (
          history.map((entry, i) => (
          <div 
            key={entry.id}
            style={{ 
              padding: '10px 0',
              borderBottom: i < history.length - 1 ? '1px solid var(--wf-gray-100)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: 'var(--wf-gray-600)' }}>
                {entry.date}
              </span>
              {entry.value ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{ 
                      width: `${entry.value * 10}px`, 
                      height: '8px', 
                      borderRadius: '4px',
                      background: `linear-gradient(90deg, var(--wf-rose-300), var(--wf-rose-${Math.min(500, 300 + entry.value * 20)}))`
                    }} 
                  />
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: 'var(--wf-rose-500)',
                    width: '24px'
                  }}>
                    {entry.value}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '14px', color: 'var(--wf-gray-400)' }}>
                  Not logged yet
                </span>
              )}
            </div>
            {entry.note && (
              <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)', fontStyle: 'italic', marginTop: '4px', paddingLeft: '2px' }}>
                📝 {entry.note}
              </div>
            )}
          </div>
        ))
        )}
      </WireframeCard>
    </WireframeLayout>
  )
}
