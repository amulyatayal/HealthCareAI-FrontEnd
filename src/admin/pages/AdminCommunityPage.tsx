import { useState } from 'react'
import { Send, Users, Plus, Pin, Trash2, VolumeX, Shield } from 'lucide-react'

interface ChatRoom {
  id: string
  name: string
  description: string
  members: number
  unread: number
}

interface ChatMessage {
  id: number
  sender: string
  content: string
  time: string
  isModerator: boolean
  isPinned: boolean
}

const INITIAL_ROOMS: ChatRoom[] = [
  { id: 'breast-cancer', name: 'Breast Cancer Support', description: 'A safe space for breast cancer patients and survivors', members: 234, unread: 12 },
  { id: 'caregivers', name: 'Caregivers Corner', description: 'Support group for caregivers and family members', members: 156, unread: 5 },
  { id: 'nutrition', name: 'Nutrition & Diet', description: 'Discuss diet plans and nutrition tips during treatment', members: 189, unread: 0 },
  { id: 'mental-health', name: 'Mental Wellness', description: 'Mental health support and coping strategies', members: 312, unread: 8 },
  { id: 'new-diagnosis', name: 'Newly Diagnosed', description: 'Guidance for those recently diagnosed', members: 98, unread: 3 },
]

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'breast-cancer': [
    { id: 1, sender: 'Emma T.', content: 'Has anyone tried the new meditation app Dr. Smith recommended?', time: '10:32 AM', isModerator: false, isPinned: false },
    { id: 2, sender: 'Michael R.', content: 'Yes! I\'ve been using it for a week now. Really helps with the anxiety before appointments.', time: '10:35 AM', isModerator: false, isPinned: false },
    { id: 3, sender: 'Dr. Demo Clinician', content: 'Welcome everyone! Please remember this is a moderated space. Be kind and supportive.', time: '10:38 AM', isModerator: true, isPinned: true },
    { id: 4, sender: 'Emma T.', content: 'Thanks for sharing! I\'ll give it a try.', time: '10:40 AM', isModerator: false, isPinned: false },
    { id: 5, sender: 'Sarah L.', content: 'The sleep stories are great too! Really helped me through chemo weeks.', time: '10:42 AM', isModerator: false, isPinned: false },
  ],
  'caregivers': [
    { id: 1, sender: 'James K.', content: 'Any tips for managing caregiver burnout?', time: '9:15 AM', isModerator: false, isPinned: false },
    { id: 2, sender: 'Dr. Demo Clinician', content: 'Great question James. Self-care is crucial. We\'ve pinned some resources at the top of this group.', time: '9:20 AM', isModerator: true, isPinned: false },
  ],
}

export function AdminCommunityPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>(INITIAL_ROOMS)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDesc, setNewRoomDesc] = useState('')

  const room = rooms.find((r) => r.id === selectedRoom)
  const roomMessages = (selectedRoom && messages[selectedRoom]) || []

  function handleSendMessage() {
    if (!newMessage.trim() || !selectedRoom) return
    const msg: ChatMessage = {
      id: Date.now(),
      sender: 'Dr. Demo Clinician',
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isModerator: true,
      isPinned: false,
    }
    setMessages((prev) => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), msg],
    }))
    setNewMessage('')
  }

  function handlePinMessage(roomId: string, msgId: number) {
    setMessages((prev) => ({
      ...prev,
      [roomId]: prev[roomId].map((m) =>
        m.id === msgId ? { ...m, isPinned: !m.isPinned } : m
      ),
    }))
  }

  function handleDeleteMessage(roomId: string, msgId: number) {
    setMessages((prev) => ({
      ...prev,
      [roomId]: prev[roomId].filter((m) => m.id !== msgId),
    }))
  }

  function handleCreateRoom() {
    if (!newRoomName.trim()) return
    const id = newRoomName.toLowerCase().replace(/\s+/g, '-')
    setRooms((prev) => [...prev, {
      id, name: newRoomName.trim(), description: newRoomDesc.trim(), members: 0, unread: 0,
    }])
    setMessages((prev) => ({ ...prev, [id]: [] }))
    setNewRoomName('')
    setNewRoomDesc('')
    setShowCreateRoom(false)
    setSelectedRoom(id)
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Community Chats</h1>
        <p>Moderate chat rooms and engage with patients as a care team member.</p>
      </div>

      <div className="admin-cm-layout">
        {/* Room list */}
        <div className="admin-cm-rooms">
          <div className="admin-cm-rooms-header">
            <h3>Chat Rooms</h3>
            <button className="admin-cm-btn-new" onClick={() => setShowCreateRoom(true)}>
              <Plus size={16} /> New
            </button>
          </div>

          {showCreateRoom && (
            <div className="admin-cm-create-room">
              <input
                type="text"
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="admin-cm-input"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                className="admin-cm-input"
              />
              <div className="admin-cm-create-actions">
                <button className="admin-cm-btn-save" onClick={handleCreateRoom} disabled={!newRoomName.trim()}>Create</button>
                <button className="admin-cm-btn-cancel" onClick={() => setShowCreateRoom(false)}>Cancel</button>
              </div>
            </div>
          )}

          {rooms.map((r) => (
            <button
              key={r.id}
              className={`admin-cm-room-item ${selectedRoom === r.id ? 'active' : ''}`}
              onClick={() => setSelectedRoom(r.id)}
            >
              <div className="admin-cm-room-icon"><Users size={18} /></div>
              <div className="admin-cm-room-info">
                <span className="admin-cm-room-name">{r.name}</span>
                <span className="admin-cm-room-meta">{r.members} members</span>
              </div>
              {r.unread > 0 && <span className="admin-cm-badge">{r.unread}</span>}
            </button>
          ))}
        </div>

        {/* Chat panel */}
        <div className="admin-cm-chat">
          {!selectedRoom ? (
            <div className="admin-cm-empty">
              <Users size={40} strokeWidth={1.2} />
              <h3>Select a chat room</h3>
              <p>Choose a room from the left to start moderating.</p>
            </div>
          ) : (
            <>
              <div className="admin-cm-chat-header">
                <div>
                  <h3>{room?.name}</h3>
                  <span>{room?.description}</span>
                </div>
                <div className="admin-cm-chat-header-meta">
                  <Users size={14} /> {room?.members} members
                </div>
              </div>

              <div className="admin-cm-messages">
                {roomMessages.map((msg) => (
                  <div key={msg.id} className={`admin-cm-msg ${msg.isModerator ? 'moderator' : ''} ${msg.isPinned ? 'pinned' : ''}`}>
                    <div className="admin-cm-msg-header">
                      <span className="admin-cm-msg-sender">
                        {msg.sender}
                        {msg.isModerator && <span className="admin-cm-mod-badge"><Shield size={10} /> Moderator</span>}
                      </span>
                      <span className="admin-cm-msg-time">{msg.time}</span>
                    </div>
                    <div className="admin-cm-msg-content">
                      {msg.isPinned && <Pin size={12} className="admin-cm-pin-icon" />}
                      {msg.content}
                    </div>
                    <div className="admin-cm-msg-actions">
                      <button onClick={() => handlePinMessage(selectedRoom, msg.id)} title={msg.isPinned ? 'Unpin' : 'Pin'}>
                        <Pin size={13} />
                      </button>
                      <button onClick={() => handleDeleteMessage(selectedRoom, msg.id)} title="Delete message">
                        <Trash2 size={13} />
                      </button>
                      {!msg.isModerator && (
                        <button title="Mute user">
                          <VolumeX size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {roomMessages.length === 0 && (
                  <div className="admin-cm-no-msgs">No messages yet. Start the conversation as moderator.</div>
                )}
              </div>

              <div className="admin-cm-input-bar">
                <input
                  type="text"
                  placeholder="Send as moderator..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="admin-cm-msg-input"
                />
                <button
                  className="admin-cm-btn-send"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
