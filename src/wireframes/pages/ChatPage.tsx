import { useState, useCallback } from 'react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeWelcome } from '../components/WireframeWelcome'
import { ChatInterface } from '../../components/ChatInterface'
import { ChatInput } from '../../components/ChatInput'
import { sendMessageV2 } from '../../services/api'
import { generateUUID } from '../../utils/uuid'
import type { Message, ChatResponseV2, Citation } from '../../types'

// Helper function to map v2 API response to Message type
const mapV2ResponseToMessage = (response: ChatResponseV2): Message => {
  const citationsAsSources =
    response.citations?.map((citation: Citation) => {
      // Check if this is a video citation
      if (citation.timestamped_url || citation.video_id) {
        // Video citation
        return {
          title: citation.video_title || citation.source_file || 'Video Citation',
          url: citation.timestamped_url || citation.video_url,
          snippet: citation.start_timestamp ? `At ${citation.start_timestamp}` : citation.channel,
          source_text: citation.source_file || citation.video_title,
          relevance_score: citation.relevance_score,
          // Video-specific fields
          video_id: citation.video_id,
          video_url: citation.video_url,
          timestamped_url: citation.timestamped_url,
          video_title: citation.video_title,
          channel: citation.channel,
          start_timestamp: citation.start_timestamp,
        }
      } else {
        // Document citation
        return {
          title: citation.section || citation.source_file || 'Citation',
          url: citation.url,
          snippet:
            citation.page_start !== undefined
              ? `Pages ${citation.page_start}${citation.page_end !== undefined ? `-${citation.page_end}` : ''}`
              : undefined,
          source_text: citation.source_file,
          relevance_score: citation.relevance_score,
        }
      }
    }) || []

  return {
    id: generateUUID(),
    role: 'assistant',
    content: response.response,
    timestamp: new Date(),
    sources: citationsAsSources,
    suggested_videos: response.suggested_videos,
    has_sufficient_evidence:
      response.confidence !== undefined ? response.confidence >= 0.65 && !response.abstained : undefined,
    disclaimer: response.disclaimer_included
      ? 'This response is auto-generated for test use only. Consult a clinician before acting on it.'
      : undefined,
    conversation_id: response.intent || undefined,
    feedbackGiven: null,
    show_sources: response.show_sources ?? true,
  }
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (message: Message, newSessionId?: string) => {
    setMessages(prev => [...prev, message])
    if (newSessionId) {
      setSessionId(newSessionId)
    }
  }

  const handleChatSubmit = useCallback(async (messageText: string, _strictMode: boolean) => {
    // Add user message
    const userMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await sendMessageV2({
        message: messageText,
        session_id: sessionId || undefined,
        conversation_history: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        include_trace: false,
      })

      const assistantMessage = mapV2ResponseToMessage(response)
      handleSendMessage(assistantMessage, response.session_id)
    } catch (error) {
      console.error('Failed to send message:', error)

      let errorContent = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorContent = "Unable to connect to the server. Please check your connection."
      } else if (error instanceof Error) {
        errorContent = `Error: ${error.message}`
      }

      const errorMessage: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      }
      handleSendMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, messages])

  const showWelcome = messages.length === 0

  return (
    <WireframeLayout showBack title="Ask Tara">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 120px)', // Account for header and bottom nav
        overflow: 'hidden'
      }}>
        {showWelcome ? (
            <WireframeWelcome
              onSuggestionClick={(text) => handleChatSubmit(`Tell me about ${text}`, false)}
            >
              <ChatInput
                onSubmit={handleChatSubmit}
                isLoading={isLoading}
                centered
                showStrictToggle={false}
              />
            </WireframeWelcome>
          ) : (
            <ChatInterface
              messages={messages}
              onSubmit={handleChatSubmit}
              isLoading={isLoading}
              showStrictToggle={false}
            />
          )}
      </div>
    </WireframeLayout>
  )
}
