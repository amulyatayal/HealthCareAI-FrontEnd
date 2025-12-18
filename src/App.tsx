import { useState, useEffect, useRef, useCallback } from 'react'
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { Sidebar } from './components/Sidebar'
import { WelcomeScreen } from './components/WelcomeScreen'
import { TopicsBrowser } from './components/TopicsBrowser'
import { ChatInput, ChatInputHandle } from './components/ChatInput'
import { generateUUID } from './utils/uuid'
import { getAvailableIndexes, sendMessage as sendMessageApi } from './services/api'
import type { Message, IndexInfo } from './types'
import './styles/App.css'

type View = 'chat' | 'topics'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<View>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Index management
  const [availableIndexes, setAvailableIndexes] = useState<IndexInfo[]>([])
  const [selectedIndex, setSelectedIndex] = useState<string>('')
  const [indexesLoading, setIndexesLoading] = useState(true)

  // Fetch available indexes on mount
  useEffect(() => {
    async function fetchIndexes() {
      try {
        const response = await getAvailableIndexes()
        setAvailableIndexes(response.indexes)
        // Set first index as default
        if (response.indexes.length > 0) {
          setSelectedIndex(response.indexes[0].index_name)
        }
      } catch (error) {
        console.error('Failed to fetch indexes:', error)
        // Fallback to a default
        setAvailableIndexes([{ index_name: 'default', display_name: 'Default', document_count: 0 }])
        setSelectedIndex('default')
      } finally {
        setIndexesLoading(false)
      }
    }
    fetchIndexes()
  }, [])

  const handleNewChat = () => {
    setMessages([])
    setSessionId(null)
  }

  const handleSelectIndex = (index: string) => {
    setSelectedIndex(index)
    // Clear chat when switching indexes
    setMessages([])
    setSessionId(null)
  }

  const [isLoading, setIsLoading] = useState(false)
  const chatInputRef = useRef<ChatInputHandle>(null)

  const handleSendMessage = (message: Message, newSessionId?: string) => {
    setMessages(prev => [...prev, message])
    if (newSessionId) {
      setSessionId(newSessionId)
    }
  }

  const handleChatSubmit = useCallback(async (messageText: string, strictMode: boolean) => {
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
      const response = await sendMessageApi({
        message: messageText,
        session_id: sessionId || undefined,
        index_name: selectedIndex,
        strict_mode: strictMode,
        include_sources: true,
      })

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

      handleSendMessage(assistantMessage, response.session_id)
    } catch (error) {
      console.error('Failed to send message:', error)
      
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
      handleSendMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, selectedIndex])

  const handleTopicSelect = (topic: string, subtopic?: string) => {
    const question = subtopic 
      ? `Tell me about ${subtopic} in the context of ${topic}`
      : `Tell me about ${topic}`
    const syntheticMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: question,
      timestamp: new Date()
    }
    setMessages([syntheticMessage])
    setCurrentView('chat')
  }

  const showWelcome = messages.length === 0

  return (
    <div className="app">
      <Header 
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
        availableIndexes={availableIndexes}
        indexesLoading={indexesLoading}
      />
      
      <div className="app-content">
        <Sidebar 
          isOpen={sidebarOpen}
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewChat={handleNewChat}
        />
        
        <main className="main-content">
          {currentView === 'chat' && (
            <div className="chat-view">
              {showWelcome ? (
                <WelcomeScreen>
                  <ChatInput 
                    ref={chatInputRef}
                    onSubmit={handleChatSubmit}
                    isLoading={isLoading}
                    centered
                  />
                </WelcomeScreen>
              ) : (
                <ChatInterface 
                  messages={messages}
                  onSubmit={handleChatSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
          
          {currentView === 'topics' && (
            <TopicsBrowser onSelectTopic={handleTopicSelect} />
          )}
        </main>
      </div>
      
      <footer className="app-footer">
        <p className="footer-disclaimer">
          <strong>Remember:</strong> This AI provides information only and is not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  )
}

export default App

