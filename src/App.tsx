import { useState, useEffect, useRef, useCallback } from 'react'
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { Sidebar } from './components/Sidebar'
import { WelcomeScreen } from './components/WelcomeScreen'
import { TopicsBrowser } from './components/TopicsBrowser'
import { ChatInput, ChatInputHandle } from './components/ChatInput'
import { LoginPage } from './components/LoginPage'
import { ForumHome } from './components/forum'
import { OnboardingWizard } from './components/OnboardingWizard'
import { SignInToast } from './components/SignInToast'
import { ProfileReminder } from './components/ProfileReminder'
import { SessionExpiredModal } from './components/SessionExpiredModal'
import { useAuth } from './contexts/AuthContext'
import { generateUUID } from './utils/uuid'
import { getAvailableIndexes, sendMessageV1, sendMessageV2, submitOnboarding, getOnboardingStatus } from './services/api'
import type { Message, IndexInfo, ChatResponseV2 } from './types'
import type { OnboardingData } from './components/OnboardingWizard'
import './styles/App.css'

type View = 'chat' | 'topics' | 'forum'
type ChatApiVersion = 'v1' | 'v2'

// How often to show reminder (every N messages)
const REMINDER_INTERVAL = 3

function App() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false)

  // Listen for session expiration events from API
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionExpiredModal(true)
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired)
    }
  }, [])

  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<View>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiVersion, setApiVersion] = useState<ChatApiVersion>('v2')

  // Index management
  const [availableIndexes, setAvailableIndexes] = useState<IndexInfo[]>([])
  const [selectedIndex, setSelectedIndex] = useState<string>('')
  const [indexesLoading, setIndexesLoading] = useState(true)

  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false)
  const [showSignInToast, setShowSignInToast] = useState(false)
  const [signInToastDismissed, setSignInToastDismissed] = useState(false)
  const [guestMessageCount, setGuestMessageCount] = useState(0)
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false)

  // Proposal card ignore state (session-scoped)
  const [proposalsIgnoredForSession, setProposalsIgnoredForSession] = useState(false)

  // Profile reminder state
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null)
  const [authMessageCount, setAuthMessageCount] = useState(0)
  const [showProfileReminder, setShowProfileReminder] = useState(false)
  const [reminderDismissedUntil, setReminderDismissedUntil] = useState(0)

  // Check onboarding status on mount for authenticated users
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!isAuthenticated || user?.isGuest) return

      try {
        const status = await getOnboardingStatus()
        setProfileComplete(status.onboarding_completed)

        // Show onboarding on first login if not completed
        if (status.needs_onboarding) {
          setShowOnboardingWizard(true)
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error)
      }
    }
    checkOnboardingStatus()
  }, [isAuthenticated, user?.isGuest])

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

  const mapV2ResponseToMessage = (response: ChatResponseV2): Message => {
    const citationsAsSources =
      response.citations?.map((citation) => ({
        title: citation.section || citation.source_file || 'Citation',
        snippet:
          citation.page_start !== undefined
            ? `Pages ${citation.page_start}${citation.page_end !== undefined ? `-${citation.page_end}` : ''}`
            : undefined,
        source_text: citation.source_file,
      })) || []

    return {
      id: generateUUID(),
      role: 'assistant',
      content: response.response,
      timestamp: new Date(),
      sources: citationsAsSources,
      has_sufficient_evidence:
        response.confidence !== undefined ? response.confidence >= 0.65 && !response.abstained : undefined,
      disclaimer: response.disclaimer_included
        ? 'This response is auto-generated for test use only. Consult a clinician before acting on it.'
        : undefined,
      conversation_id: response.intent || undefined,
      feedbackGiven: null,
      modification_proposal: response.modification_proposal
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
      if (apiVersion === 'v1') {
        const response = await sendMessageV1({
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
          conversation_id: response.conversation_id,
          conversation_created_at: response.conversation_created_at,
          feedbackGiven: null,
        }

        handleSendMessage(assistantMessage, response.session_id)
      } else {
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

        // Handle onboarding prompt for authenticated users
        if (response.needs_onboarding && !user?.isGuest) {
          setShowOnboardingWizard(true)
        }

        // Track guest message count for sign-in toast (Option B)
        if (user?.isGuest) {
          const newCount = guestMessageCount + 1
          setGuestMessageCount(newCount)
          // Show toast after 3rd message if not dismissed
          if (newCount === 3 && !signInToastDismissed) {
            setShowSignInToast(true)
          }
        } else {
          // Track authenticated user message count for profile reminder
          const newAuthCount = authMessageCount + 1
          setAuthMessageCount(newAuthCount)

          // Show reminder every N messages if profile incomplete
          if (!profileComplete && newAuthCount >= reminderDismissedUntil && newAuthCount % REMINDER_INTERVAL === 0) {
            setShowProfileReminder(true)
          }
        }
      }
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
  }, [apiVersion, sessionId, selectedIndex, messages, user?.isGuest, guestMessageCount, signInToastDismissed])

  // Handle onboarding submission
  const handleOnboardingComplete = async (data: OnboardingData) => {
    setOnboardingSubmitting(true)
    try {
      await submitOnboarding(data)
      setShowOnboardingWizard(false)
      setProfileComplete(true)  // Mark profile as complete
      setShowProfileReminder(false)  // Hide reminder if showing
    } catch (error) {
      console.error('Failed to save onboarding:', error)
      throw error
    } finally {
      setOnboardingSubmitting(false)
    }
  }

  // Handle profile reminder actions
  const handleReminderComplete = () => {
    setShowProfileReminder(false)
    setShowOnboardingWizard(true)
  }

  const handleReminderDismiss = () => {
    setShowProfileReminder(false)
    // Don't show again for next N messages
    setReminderDismissedUntil(authMessageCount + REMINDER_INTERVAL)
  }

  // Handle sign-in toast dismiss
  const handleSignInToastDismiss = () => {
    setShowSignInToast(false)
    setSignInToastDismissed(true)
  }

  // Navigate to login
  const handleNavigateToLogin = () => {
    // The login page will show if not authenticated
    // For now, just close the toast - user can use the header login
    setShowSignInToast(false)
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

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="app">
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onClose={() => setShowSessionExpiredModal(false)}
      />
      <Header
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
        availableIndexes={availableIndexes}
        indexesLoading={indexesLoading}
        apiVersion={apiVersion}
        onApiVersionChange={setApiVersion}
        onUpdateJourney={() => setShowOnboardingWizard(true)}
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
              {/* Profile reminder banner */}
              {showProfileReminder && (
                <ProfileReminder
                  onComplete={handleReminderComplete}
                  onDismiss={handleReminderDismiss}
                />
              )}

              {showWelcome ? (
                <WelcomeScreen>
                  <ChatInput
                    ref={chatInputRef}
                    onSubmit={handleChatSubmit}
                    isLoading={isLoading}
                    centered
                    showStrictToggle={apiVersion === 'v1'}
                  />
                </WelcomeScreen>
              ) : (
                <ChatInterface
                  messages={messages}
                  onSubmit={handleChatSubmit}
                  isLoading={isLoading}
                  showStrictToggle={apiVersion === 'v1'}
                  proposalsIgnored={proposalsIgnoredForSession}
                  onIgnoreProposals={() => setProposalsIgnoredForSession(true)}
                />
              )}
            </div>
          )}

          {currentView === 'topics' && (
            <TopicsBrowser onSelectTopic={handleTopicSelect} />
          )}

          {currentView === 'forum' && (
            <ForumHome currentUserId={user?.id} />
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p className="footer-disclaimer">
          <strong>Remember:</strong> This AI provides information only and is not a substitute for professional medical advice.
        </p>
      </footer>

      {/* Onboarding Wizard Modal */}
      {showOnboardingWizard && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboardingWizard(false)}
          isSubmitting={onboardingSubmitting}
        />
      )}

      {/* Sign-in Toast for Guests */}
      {showSignInToast && (
        <SignInToast
          onSignIn={handleNavigateToLogin}
          onDismiss={handleSignInToastDismiss}
        />
      )}
    </div>
  )
}

export default App

