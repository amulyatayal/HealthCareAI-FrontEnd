import { useState } from 'react'
import { Mail, Send, MessageSquare } from 'lucide-react'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send to a backend API
    // For now, we'll use mailto as a fallback
    const mailtoLink = `mailto:sales@anvega.ai?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`
    window.location.href = mailtoLink
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-description">
            Get in touch to learn more about our AI solutions
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Let's Connect</h2>
              <p>
                Whether you're interested in our AI solutions, have questions about 
                our services, or want to explore partnership opportunities, we'd 
                love to hear from you.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3>Sales Inquiries</h3>
                    <a href="mailto:sales@anvega.ai">sales@anvega.ai</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3>Support</h3>
                    <a href="mailto:support@anvega.ai">support@anvega.ai</a>
                  </div>
                </div>
              </div>

              <div className="contact-note">
                <p>
                  <strong>Response Time:</strong> We typically respond within 24-48 hours 
                  during business days.
                </p>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              {submitted ? (
                <div className="form-success">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
