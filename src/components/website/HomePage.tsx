import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Shield, Sparkles, Users, TrendingUp, MessageSquare, Building2, Stethoscope, Rocket } from 'lucide-react'
import { getDomainQueryParam } from '../../utils/domainDetector'
import { useState, useEffect, useRef } from 'react'

export function HomePage() {
  const domainQuery = getDomainQueryParam()
  const getLinkPath = (path: string) => `${path}${domainQuery}`
  const [isVisible, setIsVisible] = useState(false)
  const [taraInView, setTaraInView] = useState(false)
  const taraSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const el = taraSectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTaraInView(true)
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
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
              <span>Enterprise-Grade AI for Healthcare</span>
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
              AI-powered patient support platforms built specifically for hospitals & health systems.
              Deploy compliant, customizable AI faster—without rebuilding infrastructure.
            </p>
            <div className="hero-cta-modern">
              <Link to={getLinkPath('/contact')} className="btn btn-primary btn-hero">
                Request a Demo
                <ArrowRight size={20} />
              </Link>
              <Link to={getLinkPath('/contact')} className="btn btn-secondary btn-hero">
                Talk to Our Clinical AI Team
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

      {/* Who We Serve Section */}
      <section className="who-we-serve-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Who We Serve</h2>
            <p className="section-description">
              Trusted by healthcare organizations delivering better patient outcomes
            </p>
          </div>
          <div className="who-we-serve-grid">
            <div className="serve-card">
              <div className="serve-card-header">
                <div className="serve-icon-wrapper">
                  <Building2 size={40} className="serve-icon" />
                </div>
                <div className="serve-card-badge">Enterprise</div>
              </div>
              <h3>Hospitals & Health Systems</h3>
              <p>
                Reduce patient support burden while improving access to evidence-based guidance.
                Scale support operations without proportional cost increases.
              </p>
              <div className="serve-features">
                <div className="serve-feature-item">
                  <Shield size={16} />
                  <span>HIPAA/GDPR Compliant</span>
                </div>
                <div className="serve-feature-item">
                  <TrendingUp size={16} />
                  <span>Scalable Infrastructure</span>
                </div>
              </div>
            </div>
            <div className="serve-card">
              <div className="serve-card-header">
                <div className="serve-icon-wrapper">
                  <Stethoscope size={40} className="serve-icon" />
                </div>
                <div className="serve-card-badge">Specialized</div>
              </div>
              <h3>Specialty Clinics</h3>
              <p>
                Cancer, Chronic Care, Women's Health. Provide 24/7, stage-aware patient education 
                and support tailored to specific care pathways.
              </p>
              <div className="serve-features">
                <div className="serve-feature-item">
                  <Brain size={16} />
                  <span>Stage-Aware AI</span>
                </div>
                <div className="serve-feature-item">
                  <MessageSquare size={16} />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="serve-card">
              <div className="serve-card-header">
                <div className="serve-icon-wrapper">
                  <Rocket size={40} className="serve-icon" />
                </div>
                <div className="serve-card-badge">Innovation</div>
              </div>
              <h3>Digital Health & Innovation Teams</h3>
              <p>
                Deploy compliant, customizable AI faster—without rebuilding infrastructure. 
                Built for healthcare's unique regulatory and clinical requirements.
              </p>
              <div className="serve-features">
                <div className="serve-feature-item">
                  <Sparkles size={16} />
                  <span>Fast Deployment</span>
                </div>
                <div className="serve-feature-item">
                  <Shield size={16} />
                  <span>Customizable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <section className="credibility-section">
        <div className="container">
          <div className="credibility-grid">
            <div className="credibility-item">
              <Shield size={24} />
              <span>Designed by clinicians & healthcare technologists</span>
            </div>
            <div className="credibility-item">
              <Brain size={24} />
              <span>Built with evidence-based medical sources</span>
            </div>
            <div className="credibility-item">
              <TrendingUp size={24} />
              <span>Pilots with large hospital systems (UK & India)</span>
            </div>
            <div className="credibility-item">
              <Shield size={24} />
              <span>Privacy & security first (HIPAA/GDPR-ready architecture)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Giga-inspired */}
      <section className="features-section-modern">
        <div className="container">
          <div className="features-modern-grid">
            <div className="feature-modern-card feature-clinical-ai">
              <div className="feature-modern-header">
                <h3>Clinical-grade AI</h3>
              </div>
              <p>
                Trained on curated medical knowledge—not general internet data. Policy-aware 
                responses aligned with hospital guidelines. Stage-aware conversations that adapt over time.
              </p>
            </div>
            <div className="feature-modern-card feature-human-loop">
              <div className="feature-modern-header">
                <h3>Human-in-the-loop ready</h3>
              </div>
              <p>
                Built for clinician oversight and validation. Fine-tune every aspect to match 
                your organization's policies and clinical guidelines. Extremely customizable.
              </p>
            </div>
            <div className="feature-modern-card feature-enterprise">
              <div className="feature-modern-header">
                <h3>Enterprise-ready architecture</h3>
              </div>
              <p>
                Privacy, security, and compliance at the core. Ready for healthcare's strictest 
                regulatory requirements. HIPAA/GDPR-ready from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tara Product Section - Repositioned as Platform */}
      <section ref={taraSectionRef} className="tara-product-section">
        <div className="container">
          <div className="tara-product-header">
            <div className="tara-title-with-icon">
              <Brain size={48} className={`tara-icon ${taraInView ? 'tara-icon-visible' : ''}`} />
              <h2 className={`tara-product-title tara-name-reveal ${taraInView ? 'tara-name-visible' : ''}`}>
                <span className="tara-name-chars" aria-label="Tara">
                  {'Tara'.split('').map((char, i) => (
                    <span key={i} className="tara-char" style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
                  ))}
                </span>
              </h2>
            </div>
            <p className={`tara-product-subtitle ${taraInView ? 'tara-subtitle-visible' : ''}`}>An AI Patient Support Platform</p>
            <p className="tara-product-description">
              A configurable, enterprise-ready AI platform designed to support patients across 
              their care journey. Deploy stage-aware education, treatment guidance, and 
              evidence-based support tailored to your clinical pathways.
            </p>
          </div>
          
          {/* Use Cases */}
          <div className="tara-use-cases">
            <div className="use-case-card">
              <h4>Breast Cancer Care</h4>
              <p>Stage-aware education, treatment explanations, side-effect guidance, and recovery support throughout the care journey.</p>
            </div>
            <div className="use-case-card">
              <h4>Chronic Conditions</h4>
              <p>Ongoing education, medication & lifestyle support, symptom management, and long-term care coordination.</p>
            </div>
            <div className="use-case-card">
              <h4>Pre/Post-Procedure</h4>
              <p>Expectations setting, recovery guidance, FAQs, and follow-up support to reduce anxiety and improve outcomes.</p>
            </div>
          </div>

          <div className="tara-cta">
            <Link to={getLinkPath('/services')} className="btn btn-primary">
              Explore Tara Platform
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Visual */}
      <section className="architecture-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              A secure, policy-aware architecture designed for healthcare
            </p>
          </div>
          <div className="architecture-flow">
            <div className="flow-step">
              <div className="flow-icon">
                <Users size={32} />
              </div>
              <h4>Patient</h4>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">
                <Brain size={32} />
              </div>
              <h4>Tara AI</h4>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">
                <Shield size={32} />
              </div>
              <h4>Curated Medical Knowledge</h4>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">
                <Shield size={32} />
              </div>
              <h4>Guardrails & Policies</h4>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">
                <MessageSquare size={32} />
              </div>
              <h4>Safe Response</h4>
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
              <div className="stat-value">Agentic</div>
              <div className="stat-label">AI Systems</div>
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
          <h2>Ready to Deploy Enterprise AI for Patient Support?</h2>
          <p>Speak with our Healthcare AI Team to see how Tara can scale your patient support operations</p>
          <div className="cta-buttons">
            <Link to={getLinkPath('/contact')} className="btn btn-primary btn-large">
              Request a Demo
              <ArrowRight size={20} />
            </Link>
            <Link to={getLinkPath('/contact')} className="btn btn-secondary btn-large">
              Talk to Our Clinical AI Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
