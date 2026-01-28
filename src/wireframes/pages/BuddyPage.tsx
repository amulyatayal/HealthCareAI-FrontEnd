import { useState } from 'react'
import { MessageCircle, UserPlus, Check, X, Search } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const myBuddies = [
  { id: 1, name: 'Emma T.', status: 'online', lastMessage: 'Thanks for the support yesterday!' },
  { id: 2, name: 'Michael C.', status: 'offline', lastMessage: 'See you at the support group!' },
  { id: 3, name: 'Lisa A.', status: 'online', lastMessage: 'How was your appointment?' },
]

const pendingRequests = [
  { id: 4, name: 'David W.', zipcode: 'SW1A 1AA' },
  { id: 5, name: 'Sarah M.', zipcode: 'M1 1AE' },
]

const suggestedBuddies = [
  { id: 6, name: 'Jennifer B.', zipcode: 'B1 1AA', match: '92%' },
  { id: 7, name: 'Robert T.', zipcode: 'L1 8JQ', match: '87%' },
  { id: 8, name: 'Amanda W.', zipcode: 'G1 1XQ', match: '85%' },
]

export function BuddyPage() {
  const [activeTab, setActiveTab] = useState<'buddies' | 'find'>('buddies')

  return (
    <WireframeLayout title="Buddy System" showBack>
      {/* Tabs */}
      <div className="wf-tabs">
        <button 
          className={`wf-tab ${activeTab === 'buddies' ? 'active' : ''}`}
          onClick={() => setActiveTab('buddies')}
        >
          My Buddies
        </button>
        <button 
          className={`wf-tab ${activeTab === 'find' ? 'active' : ''}`}
          onClick={() => setActiveTab('find')}
        >
          Find Buddies
        </button>
      </div>

      {activeTab === 'buddies' ? (
        <>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <>
              <div className="wf-section-header">
                <span className="wf-section-title">Pending Requests</span>
                <span className="wf-badge wf-badge-warning">{pendingRequests.length}</span>
              </div>

              {pendingRequests.map((request) => (
                <WireframeCard key={request.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="wf-list-avatar">
                      {request.name.charAt(0)}
                    </div>
                    <div className="wf-list-content">
                      <div className="wf-list-title">{request.name}</div>
                      <div className="wf-list-subtitle">Near {request.zipcode}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="wf-icon-btn" style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <Check size={18} />
                      </button>
                      <button className="wf-icon-btn" style={{ background: '#fee2e2', color: '#dc2626' }}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </WireframeCard>
              ))}
            </>
          )}

          {/* My Buddies */}
          <div className="wf-section-header">
            <span className="wf-section-title">My Buddies</span>
          </div>

          {myBuddies.map((buddy) => (
            <WireframeCard key={buddy.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="wf-list-avatar" style={{ position: 'relative' }}>
                  {buddy.name.charAt(0)}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '2px', 
                      right: '2px', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%',
                      background: buddy.status === 'online' ? '#16a34a' : 'var(--wf-gray-400)',
                      border: '2px solid white'
                    }} 
                  />
                </div>
                <div className="wf-list-content">
                  <div className="wf-list-title">{buddy.name}</div>
                  <div className="wf-list-subtitle">{buddy.lastMessage}</div>
                </div>
                <button className="wf-icon-btn">
                  <MessageCircle size={18} />
                </button>
              </div>
            </WireframeCard>
          ))}
        </>
      ) : (
        <>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--wf-gray-400)'
              }} 
            />
            <input
              type="text"
              className="wf-input"
              placeholder="Search by name, zipcode..."
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Suggested Matches */}
          <div className="wf-section-header">
            <span className="wf-section-title">Suggested Matches</span>
          </div>

          {suggestedBuddies.map((buddy) => (
            <WireframeCard key={buddy.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="wf-list-avatar">
                  {buddy.name.charAt(0)}
                </div>
                <div className="wf-list-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="wf-list-title">{buddy.name}</span>
                    <span className="wf-badge wf-badge-success">{buddy.match} match</span>
                  </div>
                  <div className="wf-list-subtitle">Near {buddy.zipcode}</div>
                </div>
                <button className="wf-btn wf-btn-outline wf-btn-sm">
                  <UserPlus size={16} />
                  Connect
                </button>
              </div>
            </WireframeCard>
          ))}

          <p style={{ 
            fontSize: '12px', 
            color: 'var(--wf-gray-500)', 
            textAlign: 'center',
            marginTop: '16px'
          }}>
            Matches are based on location, treatment journey, and shared interests
          </p>
        </>
      )}
    </WireframeLayout>
  )
}
