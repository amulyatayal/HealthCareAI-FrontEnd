import { Target, Eye, Users } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1>About anvega.ai</h1>
          <p className="hero-description">
            Pioneering AI solutions to transform healthcare delivery and patient outcomes
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <div className="about-icon">
              <Target size={48} />
            </div>
            <h2>Our Mission</h2>
            <p>
              To leverage artificial intelligence to make healthcare more accessible, 
              personalized, and effective. We believe that AI can augment clinical 
              expertise and empower patients with the information they need to make 
              informed decisions about their health.
            </p>
          </div>

          <div className="about-section">
            <div className="about-icon">
              <Eye size={48} />
            </div>
            <h2>Our Vision</h2>
            <p>
              A future where AI-powered healthcare tools seamlessly integrate into 
              clinical workflows, supporting healthcare providers while putting 
              patients at the center of their care journey. We envision a world 
              where advanced AI makes quality healthcare guidance available to 
              everyone, regardless of location or resources.
            </p>
          </div>

          <div className="about-section">
            <div className="about-icon">
              <Users size={48} />
            </div>
            <h2>Why Healthcare AI?</h2>
            <p>
              Healthcare is at an inflection point. The volume of medical knowledge 
              is growing exponentially, making it challenging for both patients and 
              providers to stay current. AI can help bridge this gap by:
            </p>
            <ul className="about-list">
              <li>Providing instant access to evidence-based medical information</li>
              <li>Supporting clinical decision-making with relevant context</li>
              <li>Personalizing health guidance based on individual patient needs</li>
              <li>Reducing information overload while maintaining accuracy</li>
              <li>Enabling 24/7 access to healthcare support and resources</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Our Approach</h2>
            <p>
              At anvega.ai, we combine deep technical expertise in AI and machine 
              learning with a profound understanding of healthcare challenges. Our 
              solutions are built in collaboration with healthcare professionals, 
              ensuring they meet real-world clinical needs while maintaining the 
              highest standards of accuracy, safety, and patient privacy.
            </p>
            <p>
              We're committed to responsible AI development, with transparency, 
              explainability, and ethical considerations at the heart of everything 
              we build. Our flagship product, Tara, exemplifies this approach—an AI 
              health companion that provides personalized support while always 
              emphasizing the importance of professional medical consultation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
