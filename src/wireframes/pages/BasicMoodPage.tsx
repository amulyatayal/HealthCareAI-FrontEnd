import { useState } from 'react'
import { Check, TrendingUp } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard, MoodSlider } from '../components'

export function BasicMoodPage() {
  const [mood, setMood] = useState(5)
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Sample history data
  const history = [
    { date: 'Today', value: null },
    { date: 'Yesterday', value: 8 },
    { date: 'Jan 18', value: 7 },
    { date: 'Jan 17', value: 6 },
    { date: 'Jan 16', value: 8 },
    { date: 'Jan 15', value: 9 },
    { date: 'Jan 14', value: 7 },
  ]

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
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < history.length - 1 ? '1px solid var(--wf-gray-100)' : 'none'
            }}
          >
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
        ))}
      </WireframeCard>
    </WireframeLayout>
  )
}
