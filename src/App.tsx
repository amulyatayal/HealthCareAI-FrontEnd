import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { Sidebar } from './components/Sidebar'
import { WelcomeScreen } from './components/WelcomeScreen'
import { TopicsBrowser } from './components/TopicsBrowser'
import { generateUUID } from './utils/uuid'
import { getAvailableIndexes } from './services/api'
import type { Message, IndexInfo } from './types'
import './styles/App.css'

type View = 'chat' | 'topics'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<View>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
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

  const handleSendMessage = (message: Message, newSessionId?: string) => {
    setMessages(prev => [...prev, message])
    if (newSessionId) {
      setSessionId(newSessionId)
    }
  }

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
              {showWelcome && <WelcomeScreen />}
              <ChatInterface 
                messages={messages}
                sessionId={sessionId}
                onSendMessage={handleSendMessage}
                showWelcome={showWelcome}
                selectedIndex={selectedIndex}
              />
            </div>
          )}
          
          {currentView === 'topics' && (
            <TopicsBrowser onSelectTopic={handleTopicSelect} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

