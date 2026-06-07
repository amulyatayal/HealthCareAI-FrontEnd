import { useState, useCallback } from 'react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeWelcome } from '../components/WireframeWelcome'
import { ChatInterface } from '../../components/ChatInterface'
import { ChatInput } from '../../components/ChatInput'
import { sendMessageV2 } from '../../services/api'
import { generateUUID } from '../../utils/uuid'
import { getJurisdiction } from '../../utils/jurisdiction'
import { Info, X } from 'lucide-react'
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
  const [aiDisclosureDismissed, setAiDisclosureDismissed] = useState(() => {
    try { return localStorage.getItem('ai_disclosure_seen') === '1' } catch { return false }
  })
  const jurisdiction = getJurisdiction()

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

  const dismissAiDisclosure = () => {
    setAiDisclosureDismissed(true)
    try { localStorage.setItem('ai_disclosure_seen', '1') } catch { /* ignore */ }
  }

  return (
    <WireframeLayout showBack title="Ask Tara">
      <div
        className="wf-chat-layout"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 120px)',
          overflow: 'hidden',
        }}
      >
        {!aiDisclosureDismissed && (
          <div style={{
            background: jurisdiction === 'india' ? '#eff6ff' : '#f0fdf4',
            border: `1px solid ${jurisdiction === 'india' ? '#bfdbfe' : '#bbf7d0'}`,
            borderRadius: 12,
            padding: '12px 14px',
            margin: '0 0 8px',
            fontSize: 12,
            color: jurisdiction === 'india' ? '#1e40af' : '#166534',
            lineHeight: 1.6,
            position: 'relative',
          }}>
            <button
              onClick={dismissAiDisclosure}
              style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'inherit', opacity: 0.6 }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>
                  AI Transparency Disclosure
                  {jurisdiction === 'india' && <span style={{ fontWeight: 400 }}> (ICMR 2023)</span>}
                </p>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  <li>AI responses are generated by third-party models and are <strong>not medical advice</strong></li>
                  <li>The AI does not make autonomous clinical decisions</li>
                  <li>You can request human review of any AI-generated information</li>
                  <li>Conversations may be reviewed for safety and quality</li>
                </ul>
              </div>
            </div>
          </div>
        )}
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
