import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Heart, Shield, Sparkles, Users, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react'
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Transforming Healthcare with AI</span>
          </div>
          <h1 className="hero-title">
            Intelligent Solutions for
            <span className="highlight"> Better Health</span>
          </h1>
          <p className="hero-subtitle">
            We combine cutting-edge artificial intelligence with deep healthcare expertise
            to deliver personalized support and evidence-based guidance that empowers patients
            and supports clinical decision-making.
          </p>
          <div className="hero-cta">
            <Link to={getLinkPath('/services')} className="btn btn-primary">
              Explore Our Solutions
              <ArrowRight size={20} />
            </Link>
            <Link to={getLinkPath('/contact')} className="btn btn-secondary">
              Get in Touch
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Years Combined Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Always Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Evidence-Based</div>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-placeholder">
            <Brain size={120} className="hero-icon" />
            <div className="floating-elements">
              <div className="floating-icon floating-1"><Heart size={24} /></div>
              <div className="floating-icon floating-2"><Shield size={24} /></div>
              <div className="floating-icon floating-3"><Sparkles size={24} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Anvega.Ai?</h2>
            <p className="section-description">
              We bring together world-class engineering expertise and clinical insight
              to create AI solutions that truly understand healthcare
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={32} />
              </div>
              <h3>State-of-the-Art AI</h3>
              <p>
                Leveraging the latest in large language models and machine learning
                to deliver accurate, contextually-aware healthcare insights
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={32} />
              </div>
              <h3>Clinical Expertise</h3>
              <p>
                Built by healthcare professionals who understand the real-world challenges
                of patient care and clinical workflows
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Privacy First</h3>
              <p>
                Enterprise-grade security and compliance with healthcare regulations,
                ensuring your data is always protected
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={32} />
              </div>
              <h3>Continuous Learning</h3>
              <p>
                Our systems evolve with the latest medical research and clinical guidelines,
                ensuring you always have access to current best practices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <div className="container">
          <div className="showcase-content">
            <div className="showcase-text">
              <h2>Introducing Tara</h2>
              <p className="showcase-subtitle">Your Personal Health Companion</p>
              <p>
                Tara represents the future of patient support—an intelligent companion that
                understands your health journey. Whether you're seeking information, managing
                symptoms, or navigating treatment options, Tara provides personalized guidance
                backed by verified medical sources.
              </p>
              <ul className="showcase-features">
                <li>
                  <CheckCircle size={20} />
                  <span>Natural language conversations about health</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Evidence-based responses from verified sources</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Personalized guidance based on your profile</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Community support and peer connections</span>
                </li>
              </ul>
              <Link to={getLinkPath('/services')} className="btn btn-primary">
                Learn More About Tara
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="showcase-visual">
              <div className="showcase-image-placeholder">
                <div className="showcase-card showcase-card-1">
                  <MessageSquare size={32} />
                  <span>AI Chat</span>
                </div>
                <div className="showcase-card showcase-card-2">
                  <Users size={32} />
                  <span>Community</span>
                </div>
                <div className="showcase-card showcase-card-3">
                  <Heart size={32} />
                  <span>Support</span>
                </div>
              </div>
            </div>
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
