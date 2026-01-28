import { Heart, Phone, Globe } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const charities = [
  {
    id: 1,
    name: 'Macmillan Cancer Support',
    description: 'Providing physical, financial, and emotional support for cancer patients and families.',
    website: 'https://www.macmillan.org.uk',
    phone: '0808 808 00 00',
    category: 'Support',
    logo: '🎗️'
  },
  {
    id: 2,
    name: 'Cancer Research UK',
    description: 'Pioneering life-saving research to bring forward the day when all cancers are cured.',
    website: 'https://www.cancerresearchuk.org',
    phone: '0808 800 4040',
    category: 'Research',
    logo: '🔬'
  },
  {
    id: 3,
    name: 'Breast Cancer Now',
    description: 'Research and care for anyone affected by breast cancer.',
    website: 'https://breastcancernow.org',
    phone: '0808 800 6000',
    category: 'Breast Cancer',
    logo: '💗'
  },
  {
    id: 4,
    name: 'Maggie\'s Centres',
    description: 'Free practical, emotional and social support for people with cancer.',
    website: 'https://www.maggies.org',
    phone: '0300 123 1801',
    category: 'Support',
    logo: '🏠'
  },
  {
    id: 5,
    name: 'Marie Curie',
    description: 'Care and support for people living with terminal illness.',
    website: 'https://www.mariecurie.org.uk',
    phone: '0800 090 2309',
    category: 'Palliative Care',
    logo: '💜'
  },
]

const categories = ['All', 'Support', 'Research', 'Breast Cancer', 'Palliative Care']

export function CharitiesPage() {
  return (
    <WireframeLayout title="Charities & Resources" showBack>
      <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
        Connect with organizations that can help
      </p>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {categories.map((cat, i) => (
          <button 
            key={cat}
            className={`wf-btn wf-btn-sm ${i === 0 ? 'wf-btn-primary' : 'wf-btn-secondary'}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Charity List */}
      {charities.map((charity) => (
        <WireframeCard key={charity.id}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'var(--wf-rose-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
              }}
            >
              {charity.logo}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
                  {charity.name}
                </h3>
              </div>
              <span className="wf-badge wf-badge-primary" style={{ marginBottom: '8px', display: 'inline-block' }}>
                {charity.category}
              </span>
              <p style={{ fontSize: '13px', color: 'var(--wf-gray-600)', lineHeight: '1.5', marginBottom: '12px' }}>
                {charity.description}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a 
                  href={charity.website}
                  className="wf-btn wf-btn-secondary wf-btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <Globe size={14} />
                  Website
                </a>
                <a 
                  href={`tel:${charity.phone}`}
                  className="wf-btn wf-btn-secondary wf-btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={14} />
                  Call
                </a>
              </div>
            </div>
          </div>
        </WireframeCard>
      ))}

      {/* Support note */}
      <div 
        style={{ 
          textAlign: 'center', 
          padding: '20px',
          background: 'var(--wf-rose-50)',
          borderRadius: '16px',
          marginTop: '16px'
        }}
      >
        <Heart size={24} style={{ color: 'var(--wf-rose-500)', marginBottom: '8px' }} />
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-600)' }}>
          Need immediate support? <br />
          <strong style={{ color: 'var(--wf-rose-500)' }}>Call Macmillan: 0808 808 00 00</strong>
        </p>
      </div>
    </WireframeLayout>
  )
}
