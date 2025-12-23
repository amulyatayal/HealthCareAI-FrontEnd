import { MessageCircle, BookOpen, Heart, Sparkles, Users, Activity, MessagesSquare, User } from 'lucide-react'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  currentView: 'chat' | 'topics' | 'forum' | 'profile'
  onViewChange: (view: 'chat' | 'topics' | 'forum' | 'profile') => void
  onNewChat: () => void
}

const recentChats = [
  { id: '1', title: 'Understanding treatment options', time: '2 hours ago' },
  { id: '2', title: 'Managing fatigue symptoms', time: 'Yesterday' },
  { id: '3', title: 'Nutrition during chemotherapy', time: '3 days ago' },
]

const quickTopics = [
  { icon: Heart, label: 'Emotional Support', color: 'rose' },
  { icon: Activity, label: 'Side Effects', color: 'amber' },
  { icon: Sparkles, label: 'Wellness Tips', color: 'sage' },
  { icon: Users, label: 'Support Groups', color: 'lavender' },
]

export function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  if (!isOpen) return null

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => onViewChange('chat')}
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </button>
        <button
          className={`sidebar-nav-item ${currentView === 'topics' ? 'active' : ''}`}
          onClick={() => onViewChange('topics')}
        >
          <BookOpen size={20} />
          <span>Topics</span>
        </button>
        <button
          className={`sidebar-nav-item ${currentView === 'forum' ? 'active' : ''}`}
          onClick={() => onViewChange('forum')}
        >
          <MessagesSquare size={20} />
          <span>Community</span>
        </button>
        <button
          className={`sidebar-nav-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => onViewChange('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Quick Topics</h3>
        <div className="quick-topics">
          {quickTopics.map((topic) => (
            <button
              key={topic.label}
              className={`quick-topic-btn quick-topic-${topic.color}`}
            >
              <topic.icon size={16} />
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Recent Conversations</h3>
        <div className="recent-chats">
          {recentChats.map((chat) => (
            <button key={chat.id} className="recent-chat-item">
              <MessageCircle size={16} />
              <div className="recent-chat-content">
                <span className="recent-chat-title">{chat.title}</span>
                <span className="recent-chat-time">{chat.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-disclaimer">
          <p>
            <strong>Remember:</strong> This AI provides information only and is not a substitute
            for professional medical advice.
          </p>
        </div>
      </div>
    </aside>
  )
}

