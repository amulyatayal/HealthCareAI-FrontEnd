import { useState } from 'react'

interface MoodSliderProps {
  value?: number
  onChange?: (value: number) => void
}

const moodEmojis = ['😢', '😔', '😕', '😐', '🙂', '😊', '😄', '😁', '🥰', '🤩', '🎉']

export function MoodSlider({ value: controlledValue, onChange }: MoodSliderProps) {
  const [internalValue, setInternalValue] = useState(5)
  const value = controlledValue ?? internalValue

  const handleChange = (newValue: number) => {
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="wf-mood-slider">
      <div className="wf-mood-emoji">{moodEmojis[value]}</div>
      <div className="wf-mood-value">{value}</div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        className="wf-slider"
      />
      <div className="wf-mood-labels">
        <span>Very Low</span>
        <span>Neutral</span>
        <span>Excellent</span>
      </div>
    </div>
  )
}
