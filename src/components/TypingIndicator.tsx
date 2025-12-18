import { Heart } from 'lucide-react'
import './TypingIndicator.css'

export function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        <Heart size={20} fill="currentColor" />
      </div>
      <div className="typing-content">
        <div className="typing-header">
          <span className="typing-role">Healthcare AI</span>
          <span className="typing-status">is thinking...</span>
        </div>
        <div className="typing-bubble">
          <div className="typing-dots">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  )
}

