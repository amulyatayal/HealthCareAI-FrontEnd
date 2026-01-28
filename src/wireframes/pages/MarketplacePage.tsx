import { useState } from 'react'
import { Search, Plus, Heart, MessageCircle, MapPin } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const categories = ['All', 'Wigs & Head Covers', 'Mobility Aids', 'Comfort Items', 'Books', 'Free Items']

const listings = [
  {
    id: 1,
    title: 'Bamboo Headscarf Set',
    price: '£15',
    condition: 'Like New',
    location: 'London',
    seller: 'Emma T.',
    image: '🧣',
    likes: 12,
    isFree: false
  },
  {
    id: 2,
    title: 'Folding Walking Cane',
    price: 'Free',
    condition: 'Good',
    location: 'Manchester',
    seller: 'John M.',
    image: '🦯',
    likes: 8,
    isFree: true
  },
  {
    id: 3,
    title: 'Meditation Cushion',
    price: '£20',
    condition: 'New',
    location: 'Birmingham',
    seller: 'Sarah K.',
    image: '🧘',
    likes: 15,
    isFree: false
  },
  {
    id: 4,
    title: 'Cancer Journey Journal',
    price: '£8',
    condition: 'Like New',
    location: 'Leeds',
    seller: 'Lisa R.',
    image: '📔',
    likes: 22,
    isFree: false
  },
  {
    id: 5,
    title: 'Compression Socks (M)',
    price: 'Free',
    condition: 'New - Unused',
    location: 'Bristol',
    seller: 'Mark D.',
    image: '🧦',
    likes: 6,
    isFree: true
  },
  {
    id: 6,
    title: 'Weighted Blanket',
    price: '£35',
    condition: 'Good',
    location: 'Edinburgh',
    seller: 'Anna B.',
    image: '🛏️',
    likes: 18,
    isFree: false
  },
]

export function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showPost, setShowPost] = useState(false)

  const filteredListings = activeCategory === 'All' 
    ? listings 
    : activeCategory === 'Free Items'
      ? listings.filter(l => l.isFree)
      : listings

  return (
    <WireframeLayout title="Marketplace" showBack>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
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
          placeholder="Search marketplace..."
          style={{ paddingLeft: '42px' }}
        />
      </div>

      {/* Categories */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        paddingBottom: '8px', 
        marginBottom: '16px',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => (
          <button 
            key={cat}
            className={`wf-btn wf-btn-sm ${activeCategory === cat ? 'wf-btn-primary' : 'wf-btn-secondary'}`}
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post Listing Form */}
      {showPost && (
        <WireframeCard title="Post a Listing">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="wf-label">Title</label>
              <input className="wf-input" placeholder="What are you selling/giving away?" />
            </div>
            <div className="wf-grid-2">
              <div>
                <label className="wf-label">Price</label>
                <input className="wf-input" placeholder="£0 for free" />
              </div>
              <div>
                <label className="wf-label">Condition</label>
                <select className="wf-input">
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
            </div>
            <div>
              <label className="wf-label">Description</label>
              <textarea className="wf-input wf-textarea" placeholder="Describe your item..." rows={3} />
            </div>
            <div>
              <label className="wf-label">Photo</label>
              <div className="wf-upload-area" style={{ padding: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>Tap to add photos</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => setShowPost(false)}>
                Cancel
              </button>
              <button className="wf-btn wf-btn-primary" style={{ flex: 1 }}>
                Post Listing
              </button>
            </div>
          </div>
        </WireframeCard>
      )}

      {/* Listings Grid */}
      <div className="wf-grid-2">
        {filteredListings.map((listing) => (
          <WireframeCard key={listing.id} style={{ padding: '12px' }}>
            <div 
              style={{ 
                height: '100px',
                background: 'var(--wf-gray-100)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '10px',
                position: 'relative'
              }}
            >
              {listing.image}
              {listing.isFree && (
                <span 
                  style={{ 
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#16a34a',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  FREE
                </span>
              )}
            </div>
            
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'var(--wf-gray-800)',
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {listing.title}
            </h3>
            
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: listing.isFree ? '#16a34a' : 'var(--wf-rose-500)',
              marginBottom: '6px'
            }}>
              {listing.price}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '12px',
              color: 'var(--wf-gray-500)',
              marginBottom: '8px'
            }}>
              <MapPin size={12} />
              {listing.location}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--wf-gray-500)' }}>
                {listing.seller}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: 'var(--wf-gray-500)',
                    fontSize: '12px'
                  }}
                >
                  <Heart size={14} />
                  {listing.likes}
                </button>
                <button 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: 'var(--wf-gray-500)'
                  }}
                >
                  <MessageCircle size={14} />
                </button>
              </div>
            </div>
          </WireframeCard>
        ))}
      </div>

      {!showPost && (
        <button className="wf-fab" onClick={() => setShowPost(true)}>
          <Plus size={24} />
        </button>
      )}
    </WireframeLayout>
  )
}
