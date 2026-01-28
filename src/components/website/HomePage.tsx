import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Heart, Shield, Sparkles, Users, TrendingUp, MessageSquare } from 'lucide-react'
import { getDomainQueryParam } from '../../utils/domainDetector'
import { useState, useEffect } from 'react'

export function HomePage() {
  const domainQuery = getDomainQueryParam()
  const getLinkPath = (path: string) => `${path}${domainQuery}`
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  return (
    <div className="home-page">
      {/* Hero Section - Giga-inspired */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-background-image"></div>
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className={`hero-content-modern ${isVisible ? 'fade-in' : ''}`}>
            <div className="hero-badge-modern">
              <Sparkles size={16} />
              <span>AI-Powered Healthcare Solutions</span>
            </div>
            <h1 className="hero-title-modern">
              AI that understands
              <br />
              <span className="highlight"> healthcare.</span>
            </h1>
            <h2 className="hero-subtitle-modern">
              Empowering patients with intelligent support.
            </h2>
            <p className="hero-description-modern">
              We combine cutting-edge AI with deep clinical expertise to deliver
              personalized healthcare guidance that's always available, evidence-based, and secure.
            </p>
            <div className="hero-cta-modern">
              <Link to={getLinkPath('/contact')} className="btn btn-primary btn-hero">
                Talk to us
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hero-metrics">
              <div className="metric-item">
                <div className="metric-value">20+</div>
                <div className="metric-label">Years Experience</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">24/7</div>
                <div className="metric-label">Available</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">100%</div>
                <div className="metric-label">Evidence-Based</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section - Giga-inspired */}
      <section className="value-prop-section">
        <div className="container">
          <div className="value-prop-content">
            <p className="value-prop-text">
              Solve your most complex healthcare challenges with AI, 
              delivering personalized support that scales.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Giga-inspired */}
      <section className="features-section-modern">
        <div className="container">
          <div className="features-modern-grid">
            <div className="feature-modern-card">
              <div className="feature-modern-header">
                <h3>Built to handle complexity</h3>
              </div>
              <p>
                Our AI understands medical terminology, clinical workflows, and patient needs.
                Designed specifically for healthcare's unique challenges.
              </p>
            </div>
            <div className="feature-modern-card">
              <div className="feature-modern-header">
                <h3>Extremely customizable</h3>
              </div>
              <p>
                Fine-tune every aspect to match your healthcare organization's needs,
                policies, and clinical guidelines.
              </p>
            </div>
            <div className="feature-modern-card">
              <div className="feature-modern-header">
                <h3>Enterprise-ready</h3>
              </div>
              <p>
                Built with privacy, security, and compliance at the core.
                Ready for healthcare's strictest regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tara Product Section - Giga-inspired */}
      <section className="tara-product-section">
        <div className="container">
          <div className="tara-product-header">
            <h2 className="tara-product-title">Tara</h2>
            <p className="tara-product-subtitle">Your Personal Health Companion</p>
            <p className="tara-product-description">
              An intelligent AI platform designed to provide personalized healthcare support
              and information. Built with advanced AI and trained on curated medical knowledge,
              Tara offers 24/7 access to evidence-based health guidance.
            </p>
          </div>
          <div className="tara-features-grid">
            <div className="tara-feature-item">
              <MessageSquare size={32} />
              <h4>Natural Conversations</h4>
              <p>Talk about health in natural language</p>
            </div>
            <div className="tara-feature-item">
              <Shield size={32} />
              <h4>Evidence-Based</h4>
              <p>Searches from verified medical sources</p>
            </div>
            <div className="tara-feature-item">
              <Heart size={32} />
              <h4>Personalized</h4>
              <p>Guidance tailored to your profile</p>
            </div>
            <div className="tara-feature-item">
              <Users size={32} />
              <h4>Community</h4>
              <p>Support and peer connections</p>
            </div>
          </div>
          <div className="tara-cta">
            <Link to={getLinkPath('/services')} className="btn btn-primary">
              Learn More About Tara
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={40} />
              </div>
              <div className="stat-value">24/7</div>
              <div className="stat-label">Available Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Brain size={40} />
              </div>
              <div className="stat-value">LLM</div>
              <div className="stat-label">Advanced Models</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={40} />
              </div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Evidence-Based</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Shield size={40} />
              </div>
              <div className="stat-value">Secure</div>
              <div className="stat-label">Patient Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience the Future of Healthcare?</h2>
          <p>Join us in revolutionizing how patients access health information and support</p>
          <div className="cta-buttons">
            <Link to={getLinkPath('/services')} className="btn btn-secondary btn-large">
              View Our Solutions
            </Link>
            <Link to={getLinkPath('/contact')} className="btn btn-primary btn-large">
              Get Started
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
