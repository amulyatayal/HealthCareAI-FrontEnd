import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, Clock, AlertTriangle } from 'lucide-react'
import { logMood, getMoodHistory, ApiError } from '../../services/api'
import type { MoodEntry, MoodLogRequest } from '../../services/api'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import {
  isAdvancedMoodEntry,
  mergeAdvancedHistory,
} from '../utils/moodEntries'

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

const QUICK_CHECK_DISPLAY: Record<number, string> = {
  8: 'Yes',
  5: 'Somewhat',
  2: 'No',
  0: 'None',
  3: 'Mild',
  6: 'Moderate',
  9: 'Severe',
}

function formatQuickCheck(value: string | number): string {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isNaN(num) && num in QUICK_CHECK_DISPLAY) {
    return QUICK_CHECK_DISPLAY[num]
  }
  return String(value)
}

function buildQuickCheckPayload(answers: (string | null)[]) {
  const quick_check: NonNullable<MoodLogRequest['quick_check']> = {}
  if (answers[0]) quick_check.sleep_quality = SLEEP_SCORES[answers[0]]
  if (answers[1]) quick_check.physical_discomfort = DISCOMFORT_SCORES[answers[1]]
  if (answers[2]) quick_check.energy_level = ENERGY_SCORES[answers[2]]
  return Object.keys(quick_check).length > 0 ? quick_check : null
}

function buildAdvancedPayload(
  note: string,
  selectedEmotions: string[],
  selectedTriggers: string[],
  quickCheckAnswers: (string | null)[],
): MoodLogRequest {
  const payload: MoodLogRequest = { entry_type: 'advanced' }
  const trimmed = note.trim()
  if (trimmed) payload.note = trimmed
  if (selectedEmotions.length > 0) payload.emotions = [...selectedEmotions]
  if (selectedTriggers.length > 0) payload.triggers = [...selectedTriggers]
  const quickCheck = buildQuickCheckPayload(quickCheckAnswers)
  if (quickCheck) payload.quick_check = quickCheck
  return payload
}

function formatSaveError(err: unknown): string {
  if (err instanceof ApiError && err.message) return err.message
  return 'Could not save entry. Please try again.'
}

export function AdvancedMoodPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<(string | null)[]>([null, null, null])
  const [note, setNote] = useState('')
  const [historyEntries, setHistoryEntries] = useState<MoodEntry[]>([])

  const canSave =
    note.trim().length > 0 ||
    selectedEmotions.length > 0 ||
    selectedTriggers.length > 0 ||
    quickCheckAnswers.some(Boolean)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getMoodHistory(10)
        if (!cancelled) {
          setHistoryEntries((prev) =>
            mergeAdvancedHistory(prev, data.entries as Parameters<typeof mergeAdvancedHistory>[1]),
          )
        }
      } catch { /* keep current history */ }
    }
    load()
    return () => { cancelled = true }
  }, [])

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
    if (!canSave || saving) return

    setSaveError(null)
    setSaving(true)

    const payload = buildAdvancedPayload(note, selectedEmotions, selectedTriggers, quickCheckAnswers)
    const entry: MoodEntry = {
      entry_id: `adv-${Date.now()}`,
      entry_type: 'advanced',
      note: payload.note ?? null,
      emotions: payload.emotions ?? null,
      triggers: payload.triggers ?? null,
      quick_check: payload.quick_check ?? null,
      timestamp: new Date().toISOString(),
    }

    try {
      const result = await logMood(payload)
      if (result.id) entry.entry_id = result.id
      setHistoryEntries((prev) => mergeAdvancedHistory([entry, ...prev], []))
      setSelectedEmotions([])
      setSelectedTriggers([])
      setQuickCheckAnswers([null, null, null])
      setNote('')
      setCurrentCard(0)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setSaveError(formatSaveError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <WireframeLayout title="Advanced Mood Diary" showBack>
      {saveError && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, marginBottom: 12, fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Emotion Bubbles */}
      <WireframeCard title="How are you feeling?" subtitle="Select all that apply">
        <div className="wf-bubbles">
          {emotions.map((emotion) => (
            <button
              type="button"
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
                  type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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
        type="button"
        className="wf-btn wf-btn-primary wf-btn-full"
        onClick={handleSave}
        disabled={!canSave || saving}
        style={{ opacity: !canSave || saving ? 0.6 : 1 }}
      >
        {saved ? (
          <>
            <Check size={18} />
            Saved!
          </>
        ) : saving ? (
          'Saving...'
        ) : (
          'Save Entry'
        )}
      </button>

      {/* Recent Entries */}
      <div className="wf-section-header" style={{ marginTop: '16px' }}>
        <span className="wf-section-title">Recent Entries</span>
      </div>

      {historyEntries.length === 0 ? (
        <WireframeCard>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', margin: 0, textAlign: 'center' }}>
            No advanced entries yet. Save your first check-in above.
          </p>
        </WireframeCard>
      ) : (
        historyEntries.filter(isAdvancedMoodEntry).slice(0, 5).map((entry) => {
        const entryDate = new Date(entry.timestamp)
        const dateStr = entryDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
        const timeStr = entryDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        const primaryEmotion = entry.emotions?.[0]
        const headlineEmoji = primaryEmotion
          ? emotions.find((e) => e.label === primaryEmotion)?.emoji ?? '📝'
          : '📝'
        const headline = primaryEmotion
          ? (entry.emotions!.length <= 2 ? entry.emotions!.join(', ') : `${primaryEmotion} +${entry.emotions!.length - 1} more`)
          : entry.note
            ? 'Journal entry'
            : 'Check-in'

        return (
          <WireframeCard key={entry.entry_id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{headlineEmoji}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
                    {headline}
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
                  <span>😴 Sleep: {formatQuickCheck(entry.quick_check.sleep_quality)}</span>
                )}
                {entry.quick_check.physical_discomfort != null && (
                  <span>🩹 Pain: {formatQuickCheck(entry.quick_check.physical_discomfort)}</span>
                )}
                {entry.quick_check.energy_level != null && (
                  <span>⚡ Energy: {formatQuickCheck(entry.quick_check.energy_level)}</span>
                )}
              </div>
            )}
          </WireframeCard>
        )
      })
      )}

    </WireframeLayout>
  )
}
