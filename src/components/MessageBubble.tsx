import { User, Heart, BookOpen, ExternalLink, ThumbsUp, ThumbsDown, Copy, Check, Phone, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { SourceModal } from './SourceModal'
import type { Message, Source } from '../types'
import './MessageBubble.css'

interface MessageBubbleProps {
  message: Message
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

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type)
  }

  const handleSourceClick = (source: Source) => {
    setSelectedSource(source)
  }

  return (
    <>
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
              {isUser ? 'You' : 'Healthcare AI'}
            </span>
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
            {/* Evidence Indicator */}
            {!isUser && message.has_sufficient_evidence !== undefined && (
              <span className={`evidence-badge ${message.has_sufficient_evidence ? 'sufficient' : 'limited'}`}>
                {message.has_sufficient_evidence ? (
                  <><CheckCircle size={12} /> Verified</>
                ) : (
                  <><AlertTriangle size={12} /> Limited</>
                )}
              </span>
            )}
          </div>
          
          {/* Main Answer */}
          <div className="message-text markdown-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Sources Section */}
          {message.sources && message.sources.length > 0 && (
            <div className="sources-section">
              <div className="sources-header">
                <BookOpen size={16} />
                <span>Sources consulted</span>
              </div>
              <div className="sources-divider" />
              <div className="sources-list">
                {message.sources.map((source, index) => (
                  <button 
                    key={index} 
                    className="source-item"
                    onClick={() => handleSourceClick(source)}
                  >
                    <div className="source-item-header">
                      <span className="source-bullet">•</span>
                      <span className="source-title">{source.title}</span>
                      <ExternalLink size={12} className="source-icon" />
                    </div>
                    {source.snippet && (
                      <p className="source-snippet">"{source.snippet}"</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {!isUser && message.disclaimer && (
            <div className="disclaimer-section">
              <AlertTriangle size={16} className="disclaimer-icon" />
              <p className="disclaimer-text">{message.disclaimer}</p>
            </div>
          )}

          {/* Support Helpline */}
          {!isUser && message.support_helpline && (
            <div className="helpline-section">
              <a 
                href={`tel:${message.support_helpline}`}
                className="helpline-link"
              >
                <Phone size={16} />
                <span>
                  {message.support_helpline_name || 'Support Helpline'}: <strong>{message.support_helpline}</strong>
                </span>
              </a>
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

      {/* Source Modal */}
      {selectedSource && (
        <SourceModal 
          source={selectedSource} 
          onClose={() => setSelectedSource(null)} 
        />
      )}
    </>
  )
}
