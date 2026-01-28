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
                      <strong>Last Role</strong>
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

            {/* Dr. Shweta Aggarwal */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  {shwetaImageSrc ? (
                    <img 
                      src={shwetaImageSrc}
                      alt="Dr. Shweta Aggarwal"
                      onError={() => setShwetaImageError(true)}
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className="founder-title">
                  <h2>Dr. Shweta Aggarwal</h2>
                  <p className="founder-role">Founder & Chief Executive Officer</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Dr. Shweta Aggarwal is a Board Certified Plastic Surgeon with 
                  extensive clinical experience and a passion for healthcare innovation. 
                  As an NHS Clinical Entrepreneur and Honorary Senior Lecturer at Queen 
                  Mary University of London, she bridges the gap between clinical 
                  practice and technology innovation.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Current Roles</strong>
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
            <h2>Our Story</h2>
            <p>
              Anvega.Ai was founded with a vision to combine cutting-edge AI technology 
              with deep healthcare expertise. Amulya's extensive experience in building 
              large-scale AI and data platforms, combined with Dr. Shweta's clinical 
              insights and understanding of real-world healthcare challenges, creates a 
              unique foundation for developing AI solutions that truly serve patients 
              and healthcare providers.
            </p>
            <p>
              Together, they recognized the transformative potential of AI in healthcare 
              and set out to build solutions that are not just technologically advanced, 
              but also clinically relevant, ethically sound, and patient-centered. 
              Anvega.Ai represents this commitment to excellence in both AI innovation 
              and healthcare delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
