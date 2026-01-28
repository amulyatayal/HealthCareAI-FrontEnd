import { Linkedin, Briefcase, GraduationCap, Award, User } from 'lucide-react'
import { useState } from 'react'

export function FoundersPage() {
  const [amulyaImageError, setAmulyaImageError] = useState(false)
  const [shwetaImageError, setShwetaImageError] = useState(false)
  
  // Try local images first (from public/founders/ folder)
  // If not found, will fallback to User icon
  // To add images: Download from LinkedIn and save to public/founders/
  const amulyaImageSrc = amulyaImageError 
    ? null 
    : '/founders/amulya-tayal.jpg'
  
  const shwetaImageSrc = shwetaImageError 
    ? null 
    : '/founders/shweta-aggarwal.jpg'
  return (
    <div className="founders-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Founders</h1>
          <p className="hero-description">
            Combining deep technical expertise with clinical insight
          </p>
        </div>
      </section>

      <section className="founders-content">
        <div className="container">
          <div className="founders-grid">
            {/* Amulya Tayal */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  {amulyaImageSrc ? (
                    <img 
                      src={amulyaImageSrc}
                      alt="Amulya Tayal"
                      onError={() => setAmulyaImageError(true)}
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className="founder-title">
                  <h2>Amulya Tayal</h2>
                  <p className="founder-role">Founder & Chief Technology Officer</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Amulya brings over 20 years of experience in software engineering, 
                  AI, and data platforms. Previously serving as Director of Engineering 
                  at Amazon, he has led large-scale technology organizations across 
                  multiple continents, building systems that serve millions of users.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Experience</strong>
                      <p>Director of Engineering, Amazon</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Award size={20} />
                    <div>
                      <strong>Expertise</strong>
                      <p>AI & Data Platforms, Global Scale Systems, Engineering Leadership</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <GraduationCap size={20} />
                    <div>
                      <strong>Education</strong>
                      <p>B.Tech, Indian Institute of Technology (BHU), Varanasi</p>
                    </div>
                  </div>
                </div>
                <div className="founder-links">
                  <a
                    href="https://www.linkedin.com/in/amulya-tayal-931976a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-link"
                  >
                    <Linkedin size={20} />
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Ms. Shweta Aggarwal */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  {shwetaImageSrc ? (
                    <img 
                      src={shwetaImageSrc}
                      alt="Ms. Shweta Aggarwal"
                      onError={() => setShwetaImageError(true)}
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className="founder-title">
                  <h2>Ms. Shweta Aggarwal</h2>
                  <p className="founder-role">Founder & Chief Executive Officer</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Ms. Shweta Aggarwal is a Board Certified Plastic Surgeon with 
                  extensive clinical experience and a passion for healthcare innovation. 
                  As an NHS Clinical Entrepreneur and Honorary Senior Lecturer at Queen 
                  Mary University of London, she bridges the gap between clinical 
                  practice and technology innovation.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Experience</strong>
                      <p>
                        Consultant Plastic Surgeon, Barts Health NHS Trust<br />
                        Honorary Senior Lecturer, Queen Mary University of London<br />
                        NHS Clinical Entrepreneur Programme
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Award size={20} />
                    <div>
                      <strong>Specialization</strong>
                      <p>
                        Plastic Surgery, Oncoplastic Breast Surgery,<br />
                        Healthcare Innovation, Clinical Entrepreneurship
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <GraduationCap size={20} />
                    <div>
                      <strong>Credentials</strong>
                      <p>FRCS (Plast), Board Certified Plastic Surgeon</p>
                    </div>
                  </div>
                </div>
                <div className="founder-links">
                  <a
                    href="https://www.linkedin.com/in/shweta-aggarwal-b7198123/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-link"
                  >
                    <Linkedin size={20} />
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="founders-story">
            <h2>Why Healthcare AI? Why Now?</h2>
            <div className="why-section">
              <h3>Why Healthcare AI?</h3>
              <p>
                Patient information gaps are a critical problem in healthcare. Patients need 
                24/7 access to evidence-based guidance, but healthcare systems struggle to scale 
                support operations. Current solutions are either too generic, not clinically 
                validated, or require massive infrastructure rebuilds.
              </p>
            </div>
            <div className="why-section">
              <h3>Why Now?</h3>
              <p>
                The convergence of advanced AI capabilities, growing patient expectations for 
                digital health, and healthcare systems' need to do more with less creates an 
                unprecedented opportunity. We can now build AI that understands healthcare's 
                complexity while maintaining the clinical rigor and safety standards required.
              </p>
            </div>
            <div className="why-section">
              <h3>Why Us?</h3>
              <p>
                <strong>Clinical Credibility:</strong> Ms. Shweta brings real-world clinical 
                experience and understands patient needs from the front lines of care.
              </p>
              <p>
                <strong>Deep AI/Engineering Experience:</strong> Amulya's 20+ years building 
                large-scale AI systems at companies like Amazon means we can deliver enterprise-grade 
                solutions that actually scale.
              </p>
              <p>
                <strong>Vision for Responsible AI:</strong> We're building AI that's not just 
                technologically advanced, but clinically relevant, ethically sound, and designed 
                with healthcare's unique regulatory and safety requirements from day one.
              </p>
            </div>
            <div className="why-section">
              <h3>Our Commitment</h3>
              <p>
                anvega.ai represents our commitment to excellence in both AI innovation and 
                healthcare delivery. We're not building another ChatGPT wrapper—we're creating 
                clinical-grade AI platforms that healthcare systems can trust to support their 
                patients safely and effectively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
