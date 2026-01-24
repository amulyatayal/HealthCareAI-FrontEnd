import { useState, useCallback } from 'react'
import { sendMessageV2, clearChatHistory } from '../services/api'
import { generateUUID } from '../utils/uuid'
import type { Message, ChatRequestV2, ConversationTurn } from '../types'

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
      // Build conversation history for V2 API
      const conversationHistory: ConversationTurn[] = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const request: ChatRequestV2 = {
        message: content,
        session_id: sessionId || undefined,
        conversation_history: conversationHistory,
      }

      const response = await sendMessageV2(request)

      // Convert V2 citations to sources format for display
      const sources = response.citations?.map(c => ({
        title: c.source_file,
        snippet: c.section || '',
        relevance_score: c.relevance_score,
      })) || []

      const assistantMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        sources: sources,
        suggested_videos: response.suggested_videos,
        disclaimer: response.disclaimer_included ? 'This information is educational and not a substitute for medical advice.' : undefined,
        has_sufficient_evidence: !response.abstained,
      }

      setMessages(prev => [...prev, assistantMessage])
      // Use request_id as session_id for V2
      if (!sessionId) {
        setSessionId(response.request_id)
      }

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
  }, [sessionId, messages, options])

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

