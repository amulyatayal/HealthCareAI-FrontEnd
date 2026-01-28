import { MessageCircle, Users, Calendar, Heart, ShoppingBag, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

export function CommunityHub() {
  const features = [
    {
      icon: MessageCircle,
      title: 'Community Chats',
      subtitle: 'Connect with others on similar journeys',
      to: '/demo/community/chat',
      badge: '12 new',
      priority: 'P0'
    },
    {
      icon: Users,
      title: 'Buddy System',
      subtitle: 'Find a support buddy',
      to: '/demo/community/buddy',
      badge: '3 requests',
      priority: 'P1'
    },
    {
      icon: Calendar,
      title: 'Events',
      subtitle: 'Community events and meetups',
      to: '/demo/community/events',
      badge: '2 upcoming',
      priority: 'P1'
    },
    {
      icon: Heart,
      title: 'Charities & Resources',
      subtitle: 'Support organizations and helpful links',
      to: '/demo/community/charities',
      priority: 'P1'
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      subtitle: 'Buy, sell, or donate items',
      to: '/demo/community/marketplace',
      badge: '5 new listings',
      priority: 'P1'
    },
  ]

  return (
    <WireframeLayout>
      <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
        Connect, share, and support each other
      </p>

      {features.map((feature) => (
        <Link 
          key={feature.title} 
          to={feature.to} 
          style={{ textDecoration: 'none' }}
        >
          <WireframeCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="wf-list-avatar">
                <feature.icon size={22} />
              </div>
              <div className="wf-list-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="wf-list-title">{feature.title}</span>
                  {feature.priority === 'P0' && (
                    <span className="wf-badge wf-badge-primary">Core</span>
                  )}
                </div>
                <div className="wf-list-subtitle">{feature.subtitle}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {feature.badge && (
                  <span className="wf-badge wf-badge-success">{feature.badge}</span>
                )}
                <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
              </div>
            </div>
          </WireframeCard>
        </Link>
      ))}
    </WireframeLayout>
  )
}
