import { User, Heart, BookOpen, ExternalLink, ThumbsUp, ThumbsDown, Copy, Check, Phone, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { SourceModal } from './SourceModal'
import { submitFeedback } from '../services/api'
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
  const [feedback, setFeedback] = useState<'thumbs_up' | 'thumbs_down' | null>(message.feedbackGiven || null)
  const [showFeedbackInput, setShowFeedbackInput] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleThumbsUp = async () => {
    if (feedback) return
    
    setFeedback('thumbs_up')
    setShowThanks(true)
    
    // Try to submit to API if conversation_id is available
    if (message.conversation_id && message.conversation_created_at) {
      try {
        await submitFeedback({
          conversation_id: message.conversation_id,
          created_at: message.conversation_created_at,
          rating: 'thumbs_up',
        })
      } catch (error) {
        console.error('Failed to submit feedback to API:', error)
        // Still show thanks - feedback is recorded locally
      }
    }
  }

  const handleThumbsDown = () => {
    if (feedback) return
    setFeedback('thumbs_down')
    setShowFeedbackInput(true)
  }

  const handleFeedbackSubmit = async () => {
    setIsSubmitting(true)
    setShowFeedbackInput(false)
    setShowThanks(true)
    
    // Try to submit to API if conversation_id is available
    if (message.conversation_id && message.conversation_created_at) {
      try {
        await submitFeedback({
          conversation_id: message.conversation_id,
          created_at: message.conversation_created_at,
          rating: 'thumbs_down',
          feedback_text: feedbackText || undefined,
        })
      } catch (error) {
        console.error('Failed to submit feedback to API:', error)
      }
    }
    setIsSubmitting(false)
  }

  const handleSkipFeedback = async () => {
    setIsSubmitting(true)
    setShowFeedbackInput(false)
    setShowThanks(true)
    
    // Try to submit to API if conversation_id is available
    if (message.conversation_id && message.conversation_created_at) {
      try {
        await submitFeedback({
          conversation_id: message.conversation_id,
          created_at: message.conversation_created_at,
          rating: 'thumbs_down',
        })
      } catch (error) {
        console.error('Failed to submit feedback to API:', error)
      }
    }
    setIsSubmitting(false)
  }

  const handleSourceClick = (source: Source) => {
    setSelectedSource(source)
  }

  // Always show feedback buttons for assistant messages
  const canShowFeedback = !isUser

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

          {/* Disclaimer */}
          {!isUser && message.disclaimer && (
            <div className="disclaimer-section">
              <AlertTriangle size={16} className="disclaimer-icon" />
              <p className="disclaimer-text">{message.disclaimer}</p>
            </div>
          )}

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
              
              {canShowFeedback && (
                <>
                  <div className="action-divider" />
                  <button 
                    className={`action-btn ${feedback === 'thumbs_up' ? 'active' : ''}`}
                    onClick={handleThumbsUp}
                    disabled={feedback !== null || isSubmitting}
                    aria-label="Helpful"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button 
                    className={`action-btn ${feedback === 'thumbs_down' ? 'active' : ''}`}
                    onClick={handleThumbsDown}
                    disabled={feedback !== null || isSubmitting}
                    aria-label="Not helpful"
                  >
                    <ThumbsDown size={14} />
                  </button>
                  
                  {showThanks && (
                    <span className="feedback-thanks">Thanks for your feedback!</span>
                  )}
                </>
              )}
            </div>
          )}

          {/* Feedback text input (shown after thumbs down) */}
          {showFeedbackInput && (
            <div className="feedback-input-container">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us how we can improve..."
                maxLength={2000}
                rows={3}
                className="feedback-textarea"
              />
              <div className="feedback-input-actions">
                <button 
                  className="feedback-skip-btn"
                  onClick={handleSkipFeedback}
                  disabled={isSubmitting}
                >
                  Skip
                </button>
                <button 
                  className="feedback-submit-btn"
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
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
