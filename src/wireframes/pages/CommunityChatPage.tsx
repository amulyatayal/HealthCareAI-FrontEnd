import { useState } from 'react'
import { Send, Users, Plus } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'

const chatRooms = [
  { id: 'breast-cancer', name: 'Breast Cancer Support', members: 234, unread: 12 },
  { id: 'caregivers', name: 'Caregivers Corner', members: 156, unread: 5 },
  { id: 'nutrition', name: 'Nutrition & Diet', members: 189, unread: 0 },
  { id: 'mental-health', name: 'Mental Wellness', members: 312, unread: 8 },
  { id: 'new-diagnosis', name: 'Newly Diagnosed', members: 98, unread: 3 },
]

const sampleMessages = [
  { id: 1, sender: 'Emma T.', content: 'Has anyone tried the new meditation app Dr. Smith recommended?', time: '10:32 AM', isMine: false },
  { id: 2, sender: 'You', content: 'Yes! I\'ve been using it for a week now. Really helps with the anxiety before appointments.', time: '10:35 AM', isMine: true },
  { id: 3, sender: 'Michael R.', content: 'Thanks for sharing! I\'ll give it a try. What\'s it called?', time: '10:38 AM', isMine: false },
  { id: 4, sender: 'Emma T.', content: 'It\'s called Calm. There\'s a special section for cancer patients.', time: '10:40 AM', isMine: false },
  { id: 5, sender: 'You', content: 'The sleep stories are great too! 🌙', time: '10:42 AM', isMine: true },
]

export function CommunityChatPage() {
  const base = useBasePath()
  const { roomId } = useParams()
  const [message, setMessage] = useState('')
  
  // If no room selected, show room list
  if (!roomId) {
    return (
      <WireframeLayout title="Community Chats" showBack>
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
          Join conversations with others who understand your journey
        </p>

        {chatRooms.map((room) => (
          <Link 
            key={room.id} 
            to={`${base}/community/chat/${room.id}`}
            style={{ textDecoration: 'none' }}
          >
            <WireframeCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="wf-list-avatar">
                  <Users size={20} />
                </div>
                <div className="wf-list-content">
                  <div className="wf-list-title">{room.name}</div>
                  <div className="wf-list-subtitle">{room.members} members</div>
                </div>
                {room.unread > 0 && (
                  <span className="wf-badge wf-badge-primary">{room.unread}</span>
                )}
              </div>
            </WireframeCard>
          </Link>
        ))}

        <button className="wf-fab">
          <Plus size={24} />
        </button>
      </WireframeLayout>
    )
  }

  // Chat room view
  const room = chatRooms.find(r => r.id === roomId)

  return (
    <WireframeLayout title={room?.name || 'Chat'} showBack hideNav>
      <div className="wf-chat-container">
        {/* Room info bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 0',
          borderBottom: '1px solid var(--wf-gray-200)',
          marginBottom: '16px'
        }}>
          <Users size={16} style={{ color: 'var(--wf-gray-500)' }} />
          <span style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>
            {room?.members} members online
          </span>
        </div>

        {/* Messages */}
        <div className="wf-chat-messages">
          {sampleMessages.map((msg) => (
            <div key={msg.id}>
              {!msg.isMine && (
                <div style={{ fontSize: '12px', color: 'var(--wf-gray-500)', marginBottom: '4px', marginLeft: '4px' }}>
                  {msg.sender}
                </div>
              )}
              <div className={`wf-message ${msg.isMine ? 'wf-message-sent' : 'wf-message-received'}`}>
                {msg.content}
                <div className="wf-message-time" style={{ textAlign: msg.isMine ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="wf-chat-input-bar">
          <input
            type="text"
            className="wf-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="wf-btn wf-btn-primary" style={{ padding: '12px' }}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </WireframeLayout>
  )
}
