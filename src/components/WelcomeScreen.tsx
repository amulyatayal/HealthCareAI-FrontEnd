import { Heart, Sparkles, Shield, Users } from 'lucide-react'
import './WelcomeScreen.css'

const features = [
  {
    icon: Heart,
    title: 'Compassionate Support',
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

export function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-icon">
            <Sparkles size={32} />
          </div>
          <h1 className="welcome-title">
            Hello, I'm here to help
          </h1>
          <p className="welcome-subtitle">
            Your compassionate AI companion for breast cancer
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className={`feature-card feature-${feature.color}`}>
              <div className="feature-icon">
                <feature.icon size={24} />
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

