import { Heart, Sparkles, Shield, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import './WelcomeScreen.css'

const features = [
  {
    icon: Heart,
    title: 'Personal Support',
    description: 'Understanding and empathetic responses tailored to your journey',
    color: 'rose'
  },
  {
    icon: Shield,
    title: 'Trusted Information',
    description: 'Evidence-based content reviewed by healthcare professionals',
    color: 'sage'
  },
  {
    icon: Users,
    title: 'Always Here',
    description: 'Available 24/7 to answer your questions and provide guidance',
    color: 'lavender'
  },
]

interface WelcomeScreenProps {
  children?: ReactNode
}

export function WelcomeScreen({ children }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        {/* Beta Notice Banner */}
        <div className="beta-notice">
          <span className="beta-notice-badge">Beta</span>
          <span className="beta-notice-text">
            This is a test deployment only. Not for production use.
          </span>
        </div>

        <div className="welcome-hero">
          <div className="welcome-icon">
            <Sparkles size={32} />
          </div>
          <h1 className="welcome-title">
            Hello, I'm here to help
          </h1>
          <p className="welcome-subtitle">
            Your personal AI companion for breast cancer support
          </p>
        </div>

        {/* Chat input renders here when passed as children */}
        {children && (
          <div className="welcome-input-section">
            {children}
          </div>
        )}

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className={`feature-card feature-${feature.color}`}>
              <div className="feature-icon">
                <feature.icon size={16} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

