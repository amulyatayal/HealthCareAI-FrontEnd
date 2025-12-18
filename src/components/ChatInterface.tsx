import { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ChatInput } from './ChatInput'
import type { Message } from '../types'
import './ChatInterface.css'

interface ChatInterfaceProps {
  messages: Message[]
  onSubmit: (message: string, strictMode: boolean) => Promise<void>
  isLoading: boolean
}

export function ChatInterface({ 
  messages, 
  onSubmit,
  isLoading
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userQuestionRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToUserQuestion = () => {
    userQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        scrollToBottom()
      } else {
        scrollToUserQuestion()
      }
    }
  }, [messages])

  return (
    <div className="chat-interface">
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message, index) => {
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

      <div className="chat-input-container">
        <ChatInput 
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
