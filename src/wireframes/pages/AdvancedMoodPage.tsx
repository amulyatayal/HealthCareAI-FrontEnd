import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react'
import { logMood, getMoodHistory } from '../../services/api'
import type { MoodEntry } from '../../services/api'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const emotions = [
  { emoji: '😊', label: 'Happy', category: 'positive' },
  { emoji: '😌', label: 'Calm', category: 'positive' },
  { emoji: '🥰', label: 'Loved', category: 'positive' },
  { emoji: '💪', label: 'Strong', category: 'positive' },
  { emoji: '🙏', label: 'Grateful', category: 'positive' },
  { emoji: '😔', label: 'Sad', category: 'negative' },
  { emoji: '😰', label: 'Anxious', category: 'negative' },
  { emoji: '😤', label: 'Frustrated', category: 'negative' },
  { emoji: '😴', label: 'Tired', category: 'negative' },
  { emoji: '😢', label: 'Overwhelmed', category: 'negative' },
  { emoji: '🤔', label: 'Uncertain', category: 'neutral' },
  { emoji: '😐', label: 'Neutral', category: 'neutral' },
]

const triggers = [
  'Treatment side effects',
  'Doctor appointment',
  'Family support',
  'Exercise',
  'Medication',
  'Sleep quality',
  'Work stress',
  'Social activity',
  'News/Media',
  'Physical pain',
]

const swipeCards = [
  { question: 'Did you sleep well last night?', options: ['Yes 😴', 'Somewhat', 'No 😫'] },
  { question: 'Any physical discomfort today?', options: ['None', 'Mild', 'Moderate', 'Severe'] },
  { question: 'Energy level?', options: ['High ⚡', 'Normal', 'Low 🔋'] },
]

const SLEEP_SCORES: Record<string, number> = { 'Yes 😴': 8, 'Somewhat': 5, 'No 😫': 2 }
const DISCOMFORT_SCORES: Record<string, number> = { 'None': 0, 'Mild': 3, 'Moderate': 6, 'Severe': 9 }
const ENERGY_SCORES: Record<string, number> = { 'High ⚡': 8, 'Normal': 5, 'Low 🔋': 2 }

const MOCK_HISTORY: MoodEntry[] = [
  {
    entry_id: 'mock-1',
    mood_score: 7,
    note: 'Feeling better after a good rest',
    emotions: ['Calm', 'Grateful'],
    triggers: ['Family support', 'Exercise'],
    quick_check: { sleep_quality: 8, physical_discomfort: 0, energy_level: 5 },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    entry_id: 'mock-2',
    mood_score: 4,
    note: 'Tough day with treatment side effects',
    emotions: ['Tired', 'Anxious'],
    triggers: ['Treatment side effects', 'Medication'],
    quick_check: { sleep_quality: 2, physical_discomfort: 6, energy_level: 2 },
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
]

const SLEEP_LABELS: Record<number, string> = { 8: 'Yes', 5: 'Somewhat', 2: 'No' }
const DISCOMFORT_LABELS: Record<number, string> = { 0: 'None', 3: 'Mild', 6: 'Moderate', 9: 'Severe' }
const ENERGY_LABELS: Record<number, string> = { 8: 'High', 5: 'Normal', 2: 'Low' }

export function AdvancedMoodPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [saved, setSaved] = useState(false)
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<(string | null)[]>([null, null, null])
  const [note, setNote] = useState('')
  const [historyEntries, setHistoryEntries] = useState<MoodEntry[]>(MOCK_HISTORY)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getMoodHistory(10)
        if (!cancelled && data.entries.length > 0) {
          setHistoryEntries(data.entries)
        }
      } catch { /* keep mock data */ }
    }
    load()
    return () => { cancelled = true }
  }, [refreshKey])

  const toggleEmotion = (label: string) => {
    setSelectedEmotions(prev => 
      prev.includes(label) ? prev.filter(e => e !== label) : [...prev, label]
    )
  }

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    )
  }

  const handleQuickCheckAnswer = (answer: string) => {
    setQuickCheckAnswers((prev) => {
      const next = [...prev]
      next[currentCard] = answer
      return next
    })
    setCurrentCard((prev) => Math.min(prev + 1, swipeCards.length - 1))
  }

  const handleSave = async () => {
    const positiveCount = selectedEmotions.filter((e) => {
      const em = emotions.find((x) => x.label === e)
      return em?.category === 'positive'
    }).length
    const totalSelected = selectedEmotions.length || 1
    const moodScore = Math.round((positiveCount / totalSelected) * 10)

    try {
      await logMood({
        mood_score: moodScore,
        note: note || undefined,
        emotions: selectedEmotions.length > 0 ? selectedEmotions : undefined,
        triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
        quick_check: {
          sleep_quality: quickCheckAnswers[0] ? SLEEP_SCORES[quickCheckAnswers[0]] : undefined,
          physical_discomfort: quickCheckAnswers[1] ? DISCOMFORT_SCORES[quickCheckAnswers[1]] : undefined,
          energy_level: quickCheckAnswers[2] ? ENERGY_SCORES[quickCheckAnswers[2]] : undefined,
        },
      })
    } catch {
      // API not available yet
    }
    setSaved(true)
    setRefreshKey((k) => k + 1)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <WireframeLayout title="Advanced Mood Diary" showBack>
      {/* Emotion Bubbles */}
      <WireframeCard title="How are you feeling?" subtitle="Select all that apply">
        <div className="wf-bubbles">
          {emotions.map((emotion) => (
            <button
              key={emotion.label}
              className={`wf-bubble ${selectedEmotions.includes(emotion.label) ? 'selected' : ''}`}
              onClick={() => toggleEmotion(emotion.label)}
            >
              <span style={{ marginRight: '6px' }}>{emotion.emoji}</span>
              {emotion.label}
            </button>
          ))}
        </div>
      </WireframeCard>

      {/* Quick Check Cards (Swipeable simulation) */}
      <WireframeCard title="Quick Check" subtitle="Swipe or tap to answer">
        <div 
          style={{ 
            position: 'relative',
            background: 'linear-gradient(135deg, var(--wf-rose-50), var(--wf-rose-100))',
            borderRadius: '16px',
            padding: '24px',
            minHeight: '160px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: 'var(--wf-gray-800)',
              marginBottom: '20px'
            }}>
              {swipeCards[currentCard].question}
            </p>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {swipeCards[currentCard].options.map((option) => (
                <button
                  key={option}
                  className={`wf-btn wf-btn-sm ${quickCheckAnswers[currentCard] === option ? 'wf-btn-primary' : 'wf-btn-secondary'}`}
                  onClick={() => handleQuickCheckAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <button 
              className="wf-icon-btn"
              onClick={() => setCurrentCard(prev => Math.max(prev - 1, 0))}
              disabled={currentCard === 0}
              style={{ opacity: currentCard === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              {swipeCards.map((_, i) => (
                <div 
                  key={i}
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%',
                    background: i === currentCard ? 'var(--wf-rose-500)' : 'var(--wf-gray-300)'
                  }}
                />
              ))}
            </div>
            
            <button 
              className="wf-icon-btn"
              onClick={() => setCurrentCard(prev => Math.min(prev + 1, swipeCards.length - 1))}
              disabled={currentCard === swipeCards.length - 1}
              style={{ opacity: currentCard === swipeCards.length - 1 ? 0.5 : 1 }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </WireframeCard>

      {/* Triggers */}
      <WireframeCard title="What's affecting your mood?" subtitle="Select triggers or contributors">
        <div className="wf-bubbles">
          {triggers.map((trigger) => (
            <button
              key={trigger}
              className={`wf-bubble ${selectedTriggers.includes(trigger) ? 'selected' : ''}`}
              onClick={() => toggleTrigger(trigger)}
            >
              {trigger}
            </button>
          ))}
        </div>
      </WireframeCard>

      {/* Notes */}
      <WireframeCard title="Additional Notes">
        <textarea
          className="wf-input wf-textarea"
          placeholder="Anything else you'd like to note about today?"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </WireframeCard>

      {/* Save Button */}
      <button 
        className="wf-btn wf-btn-primary wf-btn-full"
        onClick={handleSave}
      >
        {saved ? (
          <>
            <Check size={18} />
            Saved!
          </>
        ) : (
          'Save Entry'
        )}
      </button>

      {/* Recent Entries */}
      <div className="wf-section-header" style={{ marginTop: '16px' }}>
        <span className="wf-section-title">Recent Entries</span>
      </div>

      {historyEntries.slice(0, 5).map((entry) => {
        const entryDate = new Date(entry.timestamp)
        const dateStr = entryDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
        const timeStr = entryDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        const moodEmoji = entry.mood_score >= 8 ? '😊' : entry.mood_score >= 6 ? '🙂' : entry.mood_score >= 4 ? '😐' : '😔'

        return (
          <WireframeCard key={entry.entry_id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{moodEmoji}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
                    Mood: {entry.mood_score}/10
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--wf-gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />
                    {dateStr} at {timeStr}
                  </div>
                </div>
              </div>
            </div>

            {entry.note && (
              <div style={{ fontSize: '13px', color: 'var(--wf-gray-600)', fontStyle: 'italic', marginBottom: '8px', padding: '8px 10px', background: 'var(--wf-gray-50)', borderRadius: '8px' }}>
                📝 {entry.note}
              </div>
            )}

            {entry.emotions && entry.emotions.length > 0 && (
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--wf-gray-400)', textTransform: 'uppercase', fontWeight: '600' }}>Emotions</span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {entry.emotions.map((em) => {
                    const found = emotions.find((e) => e.label === em)
                    return (
                      <span key={em} style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', background: 'var(--wf-rose-50)', color: 'var(--wf-rose-600)' }}>
                        {found ? `${found.emoji} ` : ''}{em}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {entry.triggers && entry.triggers.length > 0 && (
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--wf-gray-400)', textTransform: 'uppercase', fontWeight: '600' }}>Triggers</span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {entry.triggers.map((t) => (
                    <span key={t} style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', background: '#fef3c7', color: '#92400e' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.quick_check && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: 'var(--wf-gray-500)' }}>
                {entry.quick_check.sleep_quality != null && (
                  <span>😴 Sleep: {SLEEP_LABELS[entry.quick_check.sleep_quality] ?? entry.quick_check.sleep_quality}</span>
                )}
                {entry.quick_check.physical_discomfort != null && (
                  <span>🩹 Pain: {DISCOMFORT_LABELS[entry.quick_check.physical_discomfort] ?? entry.quick_check.physical_discomfort}</span>
                )}
                {entry.quick_check.energy_level != null && (
                  <span>⚡ Energy: {ENERGY_LABELS[entry.quick_check.energy_level] ?? entry.quick_check.energy_level}</span>
                )}
              </div>
            )}
          </WireframeCard>
        )
      })}

      {/* Weekly Pattern Preview */}
      <WireframeCard title="Your Weekly Patterns" style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div 
                style={{ 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: i < 6 ? `linear-gradient(135deg, var(--wf-rose-${200 + i * 50}), var(--wf-rose-${300 + i * 50}))` : 'var(--wf-gray-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px',
                  fontSize: '14px'
                }}
              >
                {i < 6 ? ['😊', '😌', '😔', '🙂', '😊', '🥰'][i] : '?'}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--wf-gray-500)' }}>{day}</span>
            </div>
          ))}
        </div>
      </WireframeCard>
    </WireframeLayout>
  )
}
