import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Send, Loader2, BookOpen, Sparkles } from 'lucide-react'
import './ChatInput.css'

interface ChatInputProps {
  onSubmit: (message: string, strictMode: boolean) => Promise<void>
  isLoading: boolean
  centered?: boolean
}

export interface ChatInputHandle {
  focus: () => void
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput({ onSubmit, isLoading, centered = false }, ref) {
    const [input, setInput] = useState('')
    const [strictMode, setStrictMode] = useState(true)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus()
    }))

    useEffect(() => {
      if (!isLoading && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isLoading])

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      
      const message = input.trim()
      setInput('')
      await onSubmit(message, strictMode)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    }

    return (
      <div className={`chat-input-section ${centered ? 'centered' : ''}`}>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your care journey..."
              className="chat-input"
              rows={1}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-icon input-submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 size={20} className="spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>

        <div className="mode-toggle-container">
          <button
            type="button"
            className={`mode-switch-option ${strictMode ? 'active' : 'inactive'}`}
            onClick={() => setStrictMode(true)}
            aria-pressed={strictMode}
          >
            <div className="mode-switch-header">
              <BookOpen size={12} className="mode-switch-icon" />
              <span className="mode-switch-label">Knowledge Base Only</span>
            </div>
            <div className={`toggle-switch ${strictMode ? 'on' : 'off'}`}>
              <span className="toggle-slider"></span>
              <span className="toggle-state">{strictMode ? 'ON' : 'OFF'}</span>
            </div>
          </button>
          
          <button
            type="button"
            className={`mode-switch-option ${!strictMode ? 'active' : 'inactive'}`}
            onClick={() => setStrictMode(false)}
            aria-pressed={!strictMode}
          >
            <div className="mode-switch-header">
              <Sparkles size={12} className="mode-switch-icon" />
              <span className="mode-switch-label">AI + Knowledge Base</span>
            </div>
            <div className={`toggle-switch ${!strictMode ? 'on' : 'off'}`}>
              <span className="toggle-slider"></span>
              <span className="toggle-state">{!strictMode ? 'ON' : 'OFF'}</span>
            </div>
          </button>
        </div>
        
        <p className="mode-description">
          {strictMode 
            ? "✓ Answers only from verified medical documents" 
            : "✓ AI provides guidance with knowledge base context"}
        </p>
      </div>
    )
  }
)

