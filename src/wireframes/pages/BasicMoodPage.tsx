import { useState, useEffect } from 'react'
import { Check, TrendingUp } from 'lucide-react'
import { logMood, getMoodHistory } from '../../services/api'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard, MoodSlider } from '../components'

export function BasicMoodPage() {
  const [mood, setMood] = useState(5)
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')

  const [history, setHistory] = useState([
    { date: 'Today', value: null as number | null, note: null as string | null },
    { date: 'Yesterday', value: 8, note: 'Feeling positive after a good walk' },
    { date: 'Jan 18', value: 7, note: null as string | null },
    { date: 'Jan 17', value: 6, note: 'A bit tired from treatment' },
    { date: 'Jan 16', value: 8, note: null as string | null },
    { date: 'Jan 15', value: 9, note: 'Great day with family' },
    { date: 'Jan 14', value: 7, note: null as string | null },
  ])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getMoodHistory(7)
        if (!cancelled && data.entries.length > 0) {
          setHistory(data.entries.map((e) => ({
            date: new Date(e.timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            value: e.mood_score,
            note: e.note,
          })))
        }
      } catch {
        // API not available yet – keep mock data
      }
    }
    load()
    return () => { cancelled = true }
  }, [saved])

  const handleSave = async () => {
    try {
      await logMood({ mood_score: mood, note: note || undefined })
    } catch {
      // API not available yet – still show saved state
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <WireframeLayout title="Mood Diary" showBack>
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
        {history.map((entry, i) => (
          <div 
            key={entry.date}
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
        ))}
      </WireframeCard>
    </WireframeLayout>
  )
}
