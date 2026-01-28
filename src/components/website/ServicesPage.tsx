import { Link } from 'react-router-dom'
import { MessageSquare, BookOpen, Search, Users, FileText, Sparkles } from 'lucide-react'
import { getDomainQueryParam } from '../../utils/domainDetector'

export function ServicesPage() {
  const domainQuery = getDomainQueryParam()
  const getLinkPath = (path: string) => `${path}${domainQuery}`
  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our AI Solutions</h1>
          <p className="hero-description">
            Specialized AI platforms designed for healthcare transformation
          </p>
        </div>
      </section>

      <section className="services-content">
        <div className="container">
          <div className="services-intro">
            <h2>Healthcare-Focused AI Platforms</h2>
            <p>
              We develop AI solutions that understand the unique challenges of healthcare.
              Our platforms combine advanced language models with specialized medical 
              knowledge bases to deliver accurate, contextual, and actionable insights.
            </p>
          </div>

          {/* Flagship Product */}
          <div className="service-featured">
            <div className="service-featured-content">
              <div className="service-icon-large">
                <MessageSquare size={48} />
              </div>
              <h2>Tara - AI Health Companion</h2>
              <p className="service-tagline">Our flagship AI platform</p>
              <p>
                Tara is an intelligent health companion that provides personalized 
                support and information to patients navigating their healthcare journey. 
                Built with advanced AI and trained on curated medical knowledge, Tara 
                offers:
              </p>
              <ul className="service-features">
                <li>
                  <strong>Conversational AI Interface</strong> - Natural language 
                  interactions for health-related questions
                </li>
                <li>
                  <strong>Evidence-Based Responses</strong> - Answers grounded in 
                  verified medical sources and research
                </li>
                <li>
                  <strong>Personalized Guidance</strong> - Tailored support based on 
                  individual patient profiles and needs
                </li>
                <li>
                  <strong>Knowledge Base Integration</strong> - Access to curated 
                  medical documents, guidelines, and resources
                </li>
                <li>
                  <strong>Community Support</strong> - Forums and peer connections 
                  for shared experiences
                </li>
                <li>
                  <strong>24/7 Availability</strong> - Round-the-clock access to 
                  health information and support
                </li>
              </ul>
              <p className="service-note">
                <strong>Note:</strong> Tara provides information and support but is 
                not a substitute for professional medical advice. Always consult with 
                qualified healthcare providers for diagnosis and treatment decisions.
              </p>
            </div>
          </div>

          {/* Other Services */}
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <BookOpen size={32} />
              </div>
              <h3>Medical Knowledge Systems</h3>
              <p>
                Custom AI systems that integrate with your medical knowledge bases, 
                providing intelligent search and retrieval of clinical information.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Search size={32} />
              </div>
              <h3>Intelligent Search & Discovery</h3>
              <p>
                Advanced semantic search capabilities that understand medical terminology 
                and context, helping users find relevant information quickly.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Users size={32} />
              </div>
              <h3>Patient Engagement Platforms</h3>
              <p>
                AI-powered platforms that enhance patient engagement, provide educational 
                content, and support care coordination.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FileText size={32} />
              </div>
              <h3>Clinical Decision Support</h3>
              <p>
                AI systems that assist healthcare providers with evidence-based 
                recommendations and clinical decision-making support.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Sparkles size={32} />
              </div>
              <h3>Custom AI Solutions</h3>
              <p>
                Tailored AI platforms designed to meet your specific healthcare 
                organization's needs and workflows.
              </p>
            </div>
          </div>

          <div className="services-cta">
            <h2>Interested in Our Solutions?</h2>
            <p>Let's discuss how we can support your healthcare AI needs</p>
            <Link to={getLinkPath('/contact')} className="btn btn-primary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
