import { useState } from 'react'
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { Sidebar } from './components/Sidebar'
import { WelcomeScreen } from './components/WelcomeScreen'
import { TopicsBrowser } from './components/TopicsBrowser'
import { generateUUID } from './utils/uuid'
import type { Message } from './types'
import './styles/App.css'

type View = 'chat' | 'topics'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<View>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleNewChat = () => {
    setMessages([])
    setSessionId(null)
  }

  const handleSendMessage = (message: Message, newSessionId?: string) => {
    setMessages(prev => [...prev, message])
    if (newSessionId) {
      setSessionId(newSessionId)
    }
  }

  const handleQuickQuestion = (question: string) => {
    // Trigger the chat with this question
    const syntheticMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: question,
      timestamp: new Date()
    }
    setMessages([syntheticMessage])
  }

  const handleTopicSelect = (topic: string, subtopic?: string) => {
    const question = subtopic 
      ? `Tell me about ${subtopic} in the context of ${topic}`
      : `Tell me about ${topic}`
    handleQuickQuestion(question)
    setCurrentView('chat')
  }

  const showWelcome = messages.length === 0

  return (
    <div className="app">
      <Header 
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
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
            <>
              {showWelcome ? (
                <WelcomeScreen onQuickQuestion={handleQuickQuestion} />
              ) : null}
              <ChatInterface 
                messages={messages}
                sessionId={sessionId}
                onSendMessage={handleSendMessage}
                showWelcome={showWelcome}
              />
            </>
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

