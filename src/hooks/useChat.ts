import { useState, useCallback } from 'react'
import { sendMessage as sendMessageApi, clearChatHistory } from '../services/api'
import { generateUUID } from '../utils/uuid'
import type { Message, ChatRequest } from '../types'

interface UseChatOptions {
  onError?: (error: Error) => void
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const request: ChatRequest = {
        message: content,
        session_id: sessionId || undefined,
      }

      const response = await sendMessageApi(request)

      const assistantMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(response.timestamp),
        sources: response.sources,
        suggested_questions: response.suggested_questions,
      }

      setMessages(prev => [...prev, assistantMessage])
      setSessionId(response.session_id)

      return assistantMessage
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      options.onError?.(err)

      const errorMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
      return errorMessage
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, options])

  const clearChat = useCallback(async () => {
    if (sessionId) {
      try {
        await clearChatHistory(sessionId)
      } catch (error) {
        console.error('Failed to clear chat history:', error)
      }
    }
    setMessages([])
    setSessionId(null)
  }, [sessionId])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  return {
    messages,
    sessionId,
    isLoading,
    sendMessage,
    clearChat,
    addMessage,
    setSessionId,
  }
}

