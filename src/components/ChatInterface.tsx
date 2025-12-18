import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, BookOpen, Sparkles } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { sendMessage as sendMessageApi } from '../services/api'
import { generateUUID } from '../utils/uuid'
import type { Message } from '../types'
import './ChatInterface.css'

interface ChatInterfaceProps {
  messages: Message[]
  sessionId: string | null
  onSendMessage: (message: Message, sessionId?: string) => void
  showWelcome: boolean
  selectedIndex: string
}

export function ChatInterface({ 
  messages, 
  sessionId, 
  onSendMessage, 
  showWelcome,
  selectedIndex
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [strictMode, setStrictMode] = useState(true) // Knowledge base only mode
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userQuestionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const processedMessageRef = useRef<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToUserQuestion = () => {
    // Scroll to the user's question so they see what they asked + the answer below
    userQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      // For user messages, scroll to bottom (so they see typing indicator)
      // For assistant messages, scroll to the user's question above it
      if (lastMessage.role === 'user') {
        scrollToBottom()
      } else {
        scrollToUserQuestion()
      }
    }
  }, [messages])

  useEffect(() => {
    // Auto-focus input when welcome screen is hidden
    if (!showWelcome && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showWelcome])

  // Handle initial message from quick questions - with deduplication
  useEffect(() => {
    if (
      messages.length === 1 && 
      messages[0].role === 'user' && 
      !isLoading &&
      processedMessageRef.current !== messages[0].id
    ) {
      processedMessageRef.current = messages[0].id
      handleSendToApi(messages[0].content)
    }
  }, [messages, isLoading])

  const handleSendToApi = useCallback(async (messageText: string) => {
    setIsLoading(true)

    try {
      console.log('Sending message to API:', messageText, 'Index:', selectedIndex, 'Strict:', strictMode)
      const response = await sendMessageApi({
        message: messageText,
        session_id: sessionId || undefined,
        index_name: selectedIndex,
        strict_mode: strictMode,
        include_sources: true,
      })
      console.log('API response:', response)

      const assistantMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(response.timestamp),
        sources: response.sources,
        disclaimer: response.disclaimer,
        has_sufficient_evidence: response.has_sufficient_evidence,
        support_helpline: response.support_helpline,
        support_helpline_name: response.support_helpline_name,
      }

      onSendMessage(assistantMessage, response.session_id)
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Determine error type for better user feedback
      let errorContent = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorContent = "Unable to connect to the server. Please make sure the backend is running on port 8000."
      } else if (error instanceof Error) {
        errorContent = `Error: ${error.message}`
      }
      
      const errorMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      }
      onSendMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, onSendMessage, selectedIndex, strictMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    onSendMessage(userMessage)
    setInput('')
    
    await handleSendToApi(userMessage.content)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={`chat-interface ${showWelcome ? 'with-welcome' : ''}`}>
      {!showWelcome && (
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message, index) => {
              // Set ref on the user question (second to last when assistant responds)
              const isUserQuestionBeforeAnswer = 
                message.role === 'user' && 
                index === messages.length - 2 &&
                messages[messages.length - 1]?.role === 'assistant'
              
              return (
                <div 
                  key={message.id}
                  ref={isUserQuestionBeforeAnswer ? userQuestionRef : null}
                >
                  <MessageBubble message={message} />
                </div>
              )
            })}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div className="chat-input-container">
        <div className="mode-toggle-container">
          <button
            type="button"
            className={`mode-switch-option ${strictMode ? 'active' : 'inactive'}`}
            onClick={() => setStrictMode(true)}
            aria-pressed={strictMode}
          >
            <div className="mode-switch-header">
              <BookOpen size={16} className="mode-switch-icon" />
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
              <Sparkles size={16} className="mode-switch-icon" />
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
      </div>
    </div>
  )
}

