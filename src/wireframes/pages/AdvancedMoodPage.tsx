import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
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

export function AdvancedMoodPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Calm', 'Grateful'])
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Family support'])
  const [currentCard, setCurrentCard] = useState(0)
  const [saved, setSaved] = useState(false)

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

  const handleSave = () => {
    setSaved(true)
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
                  className="wf-btn wf-btn-secondary wf-btn-sm"
                  onClick={() => setCurrentCard(prev => Math.min(prev + 1, swipeCards.length - 1))}
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
