import { MessageCircle, Users, Calendar, Heart, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { ComingSoonBadge } from '../../features/dashboard/components/ComingSoonBadge'

interface CommunityFeature {
  icon: typeof MessageCircle
  title: string
  subtitle: string
  to: string
  badge?: string
  iconColor: string
  priority?: 'P0'
  comingSoon?: boolean
}

export function CommunityHub() {
  const base = useBasePath()
  const features: CommunityFeature[] = [
    {
      icon: Calendar,
      title: 'Events',
      subtitle: 'Community events and meetups',
      to: `${base}/community/events`,
      badge: '2 upcoming',
      iconColor: 'amber',
    },
    {
      icon: Heart,
      title: 'Charities & Resources',
      subtitle: 'Support organizations and helpful links',
      to: `${base}/community/charities`,
      iconColor: 'green',
    },
    {
      icon: MessageCircle,
      title: 'Community Chats',
      subtitle: 'Connect with others on similar journeys',
      to: `${base}/community/chat`,
      iconColor: 'purple',
      comingSoon: true,
    },
    {
      icon: Users,
      title: 'Buddy System',
      subtitle: 'Find a support buddy near you',
      to: `${base}/community/buddy`,
      iconColor: 'rose',
      comingSoon: true,
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      subtitle: 'Buy, sell, or donate items',
      to: `${base}/community/marketplace`,
      iconColor: 'blue',
      comingSoon: true,
    },
  ]

  const iconStyles: Record<string, React.CSSProperties> = {
    purple: { background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)', color: '#a855f7' },
    rose: { background: 'linear-gradient(135deg, #ffe4e6, #fecdd3)', color: '#f43f5e' },
    amber: { background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#f59e0b' },
    green: { background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', color: '#22c55e' },
    blue: { background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#3b82f6' },
  }

  return (
    <WireframeLayout>
      <WireframeCard className="wf-hero-card" style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '8px 0' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 16px rgba(168, 85, 247, 0.3)',
          }}>
            <Users size={26} color="white" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--wf-gray-800)', margin: '0 0 4px' }}>
            You're Not Alone
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', margin: 0 }}>
            Connect, share, and support each other
          </p>
        </div>
      </WireframeCard>

      <div
        className="wf-card-coming-soon"
        style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '20px',
        padding: '10px 16px',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: '20px',
        fontSize: '13px',
        color: '#16a34a',
        fontWeight: 500,
      }}>
        <Sparkles size={16} />
        <span>247 members online now</span>
        <span style={{
          width: '8px',
          height: '8px',
          background: '#22c55e',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
        }} />
      </div>

      {features.map((feature, index) => {
        const card = (
          <WireframeCard
            className={index === 0 ? 'wf-card-accent' : ''}
            style={feature.comingSoon ? undefined : { transition: 'all 0.2s ease', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                className={feature.comingSoon ? 'wf-card-coming-soon' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  ...iconStyles[feature.iconColor],
                }}>
                  <feature.icon size={24} />
                </div>
                <div className="wf-list-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--wf-gray-800)',
                    }}>
                      {feature.title}
                    </span>
                    {feature.priority === 'P0' && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                        color: 'white',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Popular
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>
                    {feature.subtitle}
                  </div>
                </div>
              </div>
              {feature.comingSoon ? (
                <ComingSoonBadge />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {feature.badge && (
                    <span className="wf-badge wf-badge-success" style={{
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                    }}>
                      {feature.badge}
                    </span>
                  )}
                  <ChevronRight size={20} style={{ color: 'var(--wf-gray-300)' }} />
                </div>
              )}
            </div>
          </WireframeCard>
        )

        if (feature.comingSoon) {
          return <div key={feature.title}>{card}</div>
        }

        return (
          <Link key={feature.title} to={feature.to} style={{ textDecoration: 'none' }}>
            {card}
          </Link>
        )
      })}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </WireframeLayout>
  )
}
