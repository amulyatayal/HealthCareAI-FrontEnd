import { User, Heart, ExternalLink, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../types'
import './MessageBubble.css'

interface MessageBubbleProps {
  message: Message
  onSuggestedQuestion?: (question: string) => void
  isLatest?: boolean
}

function formatTime(timestamp: Date | string): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  } catch {
    return ''
  }
}

export function MessageBubble({ message, onSuggestedQuestion, isLatest }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type)
    // Could submit feedback to API here
  }

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? (
          <User size={20} />
        ) : (
          <Heart size={20} fill="currentColor" />
        )}
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-role">
            {isUser ? 'You' : 'HopeAI'}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className="message-text">
          {message.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <h4 className="sources-title">Sources</h4>
            <div className="sources-list">
              {message.sources.map((source, index) => (
                <a 
                  key={index} 
                  href={source.url || '#'} 
                  className="source-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="source-title">{source.title}</span>
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {isLatest && message.suggested_questions && message.suggested_questions.length > 0 && (
          <div className="suggested-questions">
            <h4 className="suggestions-label">You might also want to ask:</h4>
            <div className="suggestions-list">
              {message.suggested_questions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => onSuggestedQuestion?.(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions for assistant messages */}
        {!isUser && (
          <div className="message-actions">
            <button 
              className="action-btn" 
              onClick={handleCopy}
              aria-label="Copy message"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <div className="action-divider" />
            <button 
              className={`action-btn ${feedback === 'up' ? 'active' : ''}`}
              onClick={() => handleFeedback('up')}
              aria-label="Helpful"
            >
              <ThumbsUp size={14} />
            </button>
            <button 
              className={`action-btn ${feedback === 'down' ? 'active' : ''}`}
              onClick={() => handleFeedback('down')}
              aria-label="Not helpful"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

