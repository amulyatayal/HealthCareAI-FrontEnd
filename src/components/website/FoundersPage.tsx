import { Linkedin, Briefcase, GraduationCap, Award, User } from 'lucide-react'
import { useState } from 'react'

interface TeamMemberImage {
  src: string
  alt: string
  errored: boolean
}

function useImageFallback(path: string, alt: string): TeamMemberImage & { onError: () => void } {
  const [errored, setErrored] = useState(false)
  return { src: path, alt, errored, onError: () => setErrored(true) }
}

function AvatarImage({ image }: { image: TeamMemberImage & { onError: () => void } }) {
  if (image.errored) return <User size={40} />
  return <img src={image.src} alt={image.alt} onError={image.onError} />
}

export function FoundersPage() {
  const amulya = useImageFallback('/founders/amulya-tayal.jpg', 'Amulya Tayal')
  const shweta = useImageFallback('/founders/shweta-aggarwal.jpg', 'Dr. Shweta Aggarwal')
  const sekhar = useImageFallback('/founders/sekhar-marla.jpg', 'Dr. Sekhar Marla')
  const joyeta = useImageFallback('/founders/joyeta-ghosh.jpg', 'Dr. Joyeta Ghosh')
  const sandeep = useImageFallback('/founders/sandeep-gupta.jpg', 'Dr. Sandeep Gupta')
  const sanjay = useImageFallback('/founders/sanjay-kinra.jpg', 'Prof. Sanjay Kinra')

  return (
    <div className="founders-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Team</h1>
          <p className="hero-description">
            Combining deep technical expertise with clinical insight
          </p>
        </div>
      </section>

      {/* ─── Founders ─── */}
      <section className="founders-content">
        <div className="container">
          <h2 className="section-heading">Founders</h2>
          <div className="founders-grid">
            {/* Amulya Tayal */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  <AvatarImage image={amulya} />
                </div>
                <div className="founder-title">
                  <h2>Amulya Tayal</h2>
                  <p className="founder-role">Founder &amp; Chief Technology Officer</p>
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
                      <p>AI &amp; Data Platforms, Global Scale Systems, Engineering Leadership</p>
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
                  <AvatarImage image={shweta} />
                </div>
                <div className="founder-title">
                  <h2>Dr. Shweta Aggarwal</h2>
                  <p className="founder-role">Founder &amp; Chief Executive Officer</p>
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
        </div>
      </section>

      {/* ─── Clinical & Advisory Team ─── */}
      <section className="founders-content" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-heading">Clinical &amp; Advisory Team</h2>
          <div className="founders-grid">

            {/* Prof. Sanjay Kinra — first */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  <AvatarImage image={sanjay} />
                </div>
                <div className="founder-title">
                  <h2>Prof. Sanjay Kinra</h2>
                  <p className="founder-role">Advisor — AI in Global Health &amp; Clinical Epidemiology</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Prof. Sanjay Kinra is Professor of Clinical Epidemiology at the London School
                  of Hygiene &amp; Tropical Medicine (LSHTM) with over 27 years of experience.
                  He heads a group on AI in Global Health and Health Care, developing novel methods
                  for geographical and cultural alignment of AI for primary and preventive healthcare.
                  He is also an Honorary Consultant in Public Health Medicine at the Department of
                  Health and Social Care, and a former Visiting Scholar at Microsoft Research.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Experience</strong>
                      <p>
                        Professor of Clinical Epidemiology, LSHTM<br />
                        Honorary Consultant, Dept. of Health &amp; Social Care<br />
                        Former Visiting Scholar, Microsoft Research<br />
                        Former Committee Member, NICE
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <GraduationCap size={20} />
                    <div>
                      <strong>Credentials</strong>
                      <p>
                        PhD Epidemiology, University of Bristol<br />
                        MD Paediatrics, Maulana Azad Medical College<br />
                        MSc Epidemiology, LSHTM
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Award size={20} />
                    <div>
                      <strong>Expertise</strong>
                      <p>AI in Global Health, Clinical Epidemiology, Public Health, Chronic Disease Prevention</p>
                    </div>
                  </div>
                </div>
                <div className="founder-links">
                  <a
                    href="https://www.linkedin.com/in/sanjaykinra/"
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

            {/* Dr. Sekhar Marla */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  <AvatarImage image={sekhar} />
                </div>
                <div className="founder-title">
                  <h2>Dr. Sekhar Marla</h2>
                  <p className="founder-role">Clinical Advisor — Oncoplastic Breast Surgery</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Dr. Sekhar Marla is a Consultant Oncoplastic Breast Surgeon at University
                  Hospital of North Midlands (NHS) with over 15 years of clinical experience.
                  He brings deep surgical expertise and a commitment to advancing breast
                  cancer care through innovation and education.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Experience</strong>
                      <p>Consultant Oncoplastic Breast Surgeon, University Hospital of North Midlands (NHS)</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <GraduationCap size={20} />
                    <div>
                      <strong>Credentials</strong>
                      <p>
                        FRCS (General &amp; Breast Surgery)<br />
                        MSc Medical Sciences, University of Glasgow<br />
                        MBBS &amp; MS General Surgery, Maulana Azad Medical College
                      </p>
                    </div>
                  </div>
                </div>
                <div className="founder-links">
                  <a
                    href="https://www.linkedin.com/in/sekhar-marla-2615a790/"
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

            {/* Dr. Joyeta Ghosh */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  <AvatarImage image={joyeta} />
                </div>
                <div className="founder-title">
                  <h2>Dr. Joyeta Ghosh</h2>
                  <p className="founder-role">Assistant Professor — Public Health Nutrition &amp; AI</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Dr. Joyeta Ghosh is a public health nutrition scientist and data-driven 
                  researcher with expertise spanning AI, epidemiology, and clinical nutrition.
                  A former Space Health &amp; Nutrition Data Scientist at NASA, she brings a 
                  unique interdisciplinary perspective to healthcare AI.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Experience</strong>
                      <p>
                        Assistant Professor, Amity University<br />
                        Former Space Health &amp; Nutrition Data Scientist, NASA
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <GraduationCap size={20} />
                    <div>
                      <strong>Credentials</strong>
                      <p>
                        MSc Data Science, Liverpool John Moores University<br />
                        Executive PG in Data Science, IIIT Bangalore<br />
                        PG in Public Health Nutrition, PHFI
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Award size={20} />
                    <div>
                      <strong>Expertise</strong>
                      <p>Public Health Nutrition, Data Science, AI in Healthcare, Clinical Research</p>
                    </div>
                  </div>
                </div>
                <div className="founder-links">
                  <a
                    href="https://www.linkedin.com/in/dr-joyeta-ghosh-476ab0a9/"
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

            {/* Dr. Sandeep Gupta */}
            <div className="founder-card">
              <div className="founder-header">
                <div className="founder-avatar">
                  <AvatarImage image={sandeep} />
                </div>
                <div className="founder-title">
                  <h2>Dr. Sandeep Gupta</h2>
                  <p className="founder-role">Advisor — AI, Cybersecurity &amp; Privacy</p>
                </div>
              </div>
              <div className="founder-content">
                <p className="founder-bio">
                  Dr. Sandeep Gupta is a researcher and software architect with 20+ years of 
                  experience in AI/ML, biometrics, cybersecurity, and IoT. He has contributed 
                  to multiple EU H2020 research projects and held senior roles at Samsung and 
                  Accenture, bringing deep expertise in privacy-preserving AI systems.
                </p>
                <div className="founder-highlights">
                  <div className="highlight-item">
                    <Briefcase size={20} />
                    <div>
                      <strong>Experience</strong>
                      <p>
                        Researcher — EU H2020 Projects (CyberSec4Europe, E-Corridor, Collabs)<br />
                        Former Samsung Certified Architect<br />
                        Former Accenture Certified Technical Architect (top 1%)
                      </p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Award size={20} />
                    <div>
                      <strong>Expertise</strong>
                      <p>AI/ML, Behavioral Biometrics, Cybersecurity, Edge Computing, Privacy Engineering</p>
                    </div>
                  </div>
                </div>
                <div className="founder-links">
                  <a
                    href="https://www.linkedin.com/in/sandeepgupta26/"
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
        </div>
      </section>

      {/* ─── Why Healthcare AI ─── */}
      <section className="founders-content" style={{ paddingTop: 0 }}>
        <div className="container">
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
                <strong>Clinical Credibility:</strong> Dr. Shweta brings real-world clinical 
                experience and understands patient needs from the front lines of care.
              </p>
              <p>
                <strong>Deep AI/Engineering Experience:</strong> Amulya's 20+ years building 
                large-scale AI systems at companies like Amazon means we can deliver enterprise-grade 
                solutions that actually scale.
              </p>
              <p>
                <strong>Multidisciplinary Advisory Team:</strong> From oncoplastic surgery and 
                public health nutrition to cybersecurity and privacy engineering, our advisors 
                ensure every dimension of patient care and data safety is covered.
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
