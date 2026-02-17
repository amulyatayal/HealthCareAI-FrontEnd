import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../../wireframes/components/PhoneFrame'

export function TermsOfService() {
  return (
    <PhoneFrame>
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 64px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <FileText size={28} style={{ color: '#f43f5e' }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 }}>Terms of Service</h1>
      </div>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Last updated: January 2026</p>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using the Tara Health Companion ("<strong>the Service</strong>"), you agree to be bound by these
          Terms of Service ("<strong>Terms</strong>"). If you do not agree to any part of these Terms, you must not access
          or use the Service. These Terms constitute a legally binding agreement between you and the Company (defined below).
        </p>
      </Section>

      <Section title="2. About Us">
        <p>
          The Service is operated by <strong>Anvega Ltd</strong>, a company incorporated in England and Wales
          (Company No. <strong>[XXXXXXXX]</strong>), with its registered office at <strong>[Registered Address]</strong>{' '}
          ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>", or "<strong>the Company</strong>").
        </p>
        <p>
          Tara is an AI-powered health companion that provides lifestyle information, mood tracking, symptom tracking,
          appointment management, document storage, community features, and AI-assisted insights for individuals on a
          health journey.
        </p>
        <p>You can contact us at <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>.</p>
      </Section>

      <Section title="3. Regulatory Status">
        <InfoBox colour="blue">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Important Notice</p>
          <p>
            The Service is <strong>not</strong> a regulated medical device under the UK Medical Devices Regulations 2002 (as amended)
            or the EU Medical Device Regulation (MDR 2017/745). It is not intended to diagnose, treat, cure, or prevent any disease
            or medical condition.
          </p>
          <p style={{ marginTop: 8 }}>
            The Service does not replace clinical oversight, professional medical advice, or the clinician–patient relationship.
            Any health-related features (mood tracking, symptom logging, AI chat) are provided for informational and
            self-management purposes only.
          </p>
        </InfoBox>
      </Section>

      <Section title="4. Medical Disclaimer and AI Transparency">
        <InfoBox colour="red">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Medical Disclaimer</p>
          <p>
            The Service is for informational and educational purposes only. It does <strong>not</strong> provide medical
            advice, diagnosis, or treatment. Always consult your doctor, clinical team, or qualified healthcare provider
            with questions about your medical condition. Never disregard professional medical advice or delay seeking it
            because of information provided by this Service.
          </p>
        </InfoBox>
        <InfoBox colour="amber">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>AI Transparency</p>
          <p>
            The AI features of the Service generate responses using probabilistic language models. These models may produce
            inaccurate, incomplete, or inappropriate information. AI-generated content should not be treated as medical advice,
            clinical guidance, or factual certainty.
          </p>
          <p style={{ marginTop: 8 }}>
            You remain solely responsible for any decisions or actions taken based on AI-generated outputs.
            We strongly recommend independently verifying any health-related information with a qualified professional.
          </p>
        </InfoBox>
      </Section>

      <Section title="5. Emergency Situations">
        <InfoBox colour="red">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Not for Emergencies</p>
          <p>
            The Service is <strong>not</strong> intended for use in medical emergencies. If you believe you are experiencing
            a medical emergency, call your local emergency number (e.g. 999 in the UK, 112 in the EU, 911 in the US) or
            seek immediate professional medical assistance.
          </p>
          <p style={{ marginTop: 8 }}>
            The Service does not monitor users in real time and cannot respond to urgent health situations.
          </p>
        </InfoBox>
      </Section>

      <Section title="6. Eligibility and Age Restriction">
        <p>
          The Service is intended for users aged <strong>18 or over</strong>. By using the Service, you confirm that you are
          at least 18 years of age. We do not knowingly collect personal data from individuals under 18. If you are a parent
          or guardian and believe your child has provided us with personal data, please contact us immediately.
        </p>
      </Section>

      <Section title="7. User Accounts">
        <ul>
          <li>You may sign in with Google or use the Service as a guest.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You must notify us promptly if you become aware of any unauthorised use of your account.</li>
          <li>Guest accounts may have limited features and data may be ephemeral.</li>
          <li>We reserve the right to disable any account at any time if, in our reasonable opinion, you have
            failed to comply with these Terms.</li>
        </ul>
      </Section>

      <Section title="8. Health Data">
        <p>
          Health data — including mood logs, symptom entries, physical test results, and related information — is classified
          as <strong>special category data</strong> under Article 9 of the UK GDPR.
        </p>
        <p>
          Where health data is processed, we rely on both (i) <strong>performance of contract</strong> under
          Article 6(1)(b) UK GDPR for core service functionality, and (ii) your <strong>explicit consent</strong>{' '}
          under Article 9(2)(a) UK GDPR for special category data. We process this data for the following purposes:
        </p>
        <ul>
          <li>Providing the Service, including symptom tracking, mood logging, and trend visualisation.</li>
          <li>Document storage and management of your medical records.</li>
          <li>AI-assisted insights and personalised responses based on your health journey.</li>
          <li>Sharing selected data with your clinical team, only when you explicitly request it.</li>
        </ul>
        <p>
          You may <strong>withdraw your consent</strong> at any time via Profile → Privacy & Data Rights → Manage Data Consent.
          Withdrawal of consent does not affect the lawfulness of processing carried out before withdrawal.
        </p>
        <p>
          Where your data is <strong>anonymised</strong> such that you are no longer identifiable (in accordance with the
          ICO's anonymisation guidance), it may be used for research, statistical analysis, and service improvement purposes.
          Anonymised data is no longer personal data and is not subject to data subject rights.
        </p>
        <p>
          We do <strong>not</strong> use your identifiable personal data to train AI models. Any use of data for model
          improvement or research purposes is limited to irreversibly anonymised and aggregated datasets.
        </p>
        <p>
          See our <Link to="/privacy">Privacy Policy</Link> for full details on data processing, retention, and your rights.
        </p>
      </Section>

      <Section title="9. Documents and Uploads">
        <ul>
          <li>You retain ownership of all documents you upload.</li>
          <li>Documents are encrypted at rest (AES-256) and in transit (TLS 1.2+).</li>
          <li>We do not access, read, or analyse your documents except as strictly necessary to provide the Service
            or as required by law.</li>
          <li>Maximum file size: 10 MB. Supported formats: PDF, JPG, PNG.</li>
          <li>You are responsible for ensuring you have the right to upload any documents and that they do not
            contain unlawful content.</li>
        </ul>
        <p>
          You acknowledge that documents you upload may contain sensitive personal data. You are solely responsible for
          ensuring that you have the lawful right to upload and share such documents and that doing so does not violate
          any third-party rights or applicable laws.
        </p>
      </Section>

      <Section title="10. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations.</li>
          <li>Post harmful, abusive, threatening, defamatory, or misleading content.</li>
          <li>Share content that promotes self-harm, suicide, or dangerous medical practices.</li>
          <li>Provide medical advice to other users that could cause harm.</li>
          <li>Attempt to access other users' data, accounts, or any non-public areas of the Service.</li>
          <li>Reverse-engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Service.</li>
          <li>Upload malicious files, viruses, or any other harmful code.</li>
          <li>Use the AI chat to generate content intended to harm, deceive, or manipulate others.</li>
          <li>Use automated systems (bots, scrapers) to access the Service without our prior written consent.</li>
        </ul>
      </Section>

      <Section title="11. Community Guidelines">
        <p>When participating in the community forum, you agree to:</p>
        <ul>
          <li>Be respectful, supportive, and empathetic towards other community members.</li>
          <li>Not share medical advice that could be harmful or that contradicts professional guidance.</li>
          <li>Not share personally identifiable information about others without their consent.</li>
          <li>Report inappropriate content using the reporting feature.</li>
          <li>Understand that anonymous posts can still be removed if they violate these guidelines.</li>
        </ul>
        <p>
          We endeavour to moderate community content but do not guarantee that all content will be reviewed. We are not
          responsible for user-generated content posted in the community. You acknowledge that you may be exposed to
          content that is inaccurate, offensive, or otherwise objectionable, and you use the community features at your
          own risk.
        </p>
        <p>
          User-generated content reflects the views of the individual users and does not represent the views of the
          Company. We do not endorse or verify medical claims made by users.
        </p>
      </Section>

      <Section title="12. Suspension and Safety">
        <p>
          We reserve the right to <strong>immediately suspend or terminate</strong> your access to the Service, without prior
          notice, if we reasonably believe that:
        </p>
        <ul>
          <li>You have posted content promoting self-harm, suicide, or dangerous medical practices.</li>
          <li>You have provided medical advice to other users that poses a risk of harm.</li>
          <li>You have abused, harassed, or threatened other users or our staff.</li>
          <li>You have materially breached these Terms or any applicable laws.</li>
          <li>Your continued use poses a safety risk to yourself, other users, or the public.</li>
        </ul>
        <p>
          Where practicable, we will notify you of the reason for suspension and provide an opportunity to appeal.
          However, we are not obliged to do so where we reasonably believe that disclosure could compromise safety or
          an ongoing investigation.
        </p>
      </Section>

      <Section title="13. Intellectual Property">
        <p>
          The Service, including its design, code, AI models, branding, and content (excluding user-generated content), is
          owned by Anvega Ltd and protected by intellectual property laws. You may not copy, modify, distribute, or create
          derivative works from any part of the Service without our prior written consent.
        </p>
        <p>
          You retain all rights to content you create (posts, comments, documents). By posting in the community, you
          grant us a non-exclusive, worldwide, royalty-free licence to display, reproduce, and distribute that content
          within the Service for the purpose of operating and promoting the Service.
        </p>
        <p>
          AI-generated outputs are provided for your personal use within the Service. You may not reproduce, redistribute,
          or commercially exploit AI-generated content in a manner that violates applicable law or these Terms.
        </p>
      </Section>

      <Section title="14. Limitation of Liability">
        <InfoBox colour="grey">
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Statutory Rights</p>
          <p>
            Nothing in these Terms excludes or limits our liability for: (a) death or personal injury caused by our
            negligence; (b) fraud or fraudulent misrepresentation; or (c) any other liability that cannot be excluded
            or limited under applicable law, including the Consumer Rights Act 2015.
          </p>
        </InfoBox>
        <p>Subject to the above, and to the fullest extent permitted by law:</p>
        <ul>
          <li>The Service is provided "<strong>as is</strong>" and "<strong>as available</strong>" without warranties
            of any kind, whether express, implied, or statutory.</li>
          <li>We do not warrant that the Service will be uninterrupted, error-free, or free from harmful components.</li>
          <li>We are not liable for any medical decisions made, or not made, based on information from the Service.</li>
          <li>We are not liable for any loss of data, unless caused by our negligence or wilful default.</li>
          <li>Our total aggregate liability to you for any claims arising out of or in connection with these Terms
            or the Service shall not exceed <strong>£100 or the total amount paid by you for the Service in the
            12 months preceding the claim, whichever is greater</strong>.</li>
          <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
            including but not limited to loss of profits, data, goodwill, or other intangible losses.</li>
        </ul>
      </Section>

      <Section title="15. International Data Transfers">
        <p>
          The Service may use third-party infrastructure and services (including cloud hosting, authentication providers,
          and AI model providers) that process personal data outside the United Kingdom and the European Economic Area.
        </p>
        <p>
          Where such transfers occur, we ensure that appropriate safeguards are in place, including Standard Contractual
          Clauses (SCCs) approved by the European Commission, the UK International Data Transfer Agreement (IDTA), or
          reliance on an adequacy decision, as applicable.
        </p>
        <p>
          For full details on international transfers and safeguards, see our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </Section>

      <Section title="16. Service Availability and Modifications">
        <p>
          We aim to keep the Service available at all times but do not guarantee uninterrupted or error-free access.
          We may suspend access temporarily for maintenance, security, or operational reasons.
        </p>
        <p>
          We reserve the right to <strong>modify, update, or discontinue</strong> any features or functionality of the
          Service at any time, with or without notice. Where a change materially affects your use of the Service, we will
          endeavour to provide reasonable notice.
        </p>
      </Section>

      <Section title="17. Changes to Terms">
        <p>
          We may update these Terms from time to time to reflect changes in law, regulatory requirements, or our
          practices. We will notify you of significant changes via the Service or by email. The "Last updated" date
          at the top indicates when these Terms were last revised.
        </p>
        <p>
          Continued use of the Service after changes are posted constitutes acceptance of the revised Terms. If you
          do not agree to the revised Terms, you must stop using the Service and may delete your account.
        </p>
      </Section>

      <Section title="18. Data Retention and Termination">
        <p>
          You may delete your account at any time via Profile → Privacy & Data Rights → Delete my account. Upon
          account deletion:
        </p>
        <ul>
          <li>Your personal data will be permanently removed from our active systems within <strong>30 days</strong>.</li>
          <li>Backup copies will be purged within <strong>90 days</strong> of account deletion.</li>
          <li>Forum posts will be anonymised (author name replaced with "Deleted User").</li>
        </ul>
        <p>
          We may retain limited information beyond these periods where required by law (e.g. financial records, tax
          obligations), for fraud prevention, or to establish, exercise, or defend legal claims. Any such retained
          data will be minimised to what is strictly necessary and securely stored.
        </p>
        <p>
          Termination of your account does not affect any rights or obligations that by their nature should survive
          termination, including intellectual property rights, liability limitations, and dispute resolution provisions.
        </p>
      </Section>

      <Section title="19. Force Majeure">
        <p>
          We shall not be liable for any failure or delay in performance resulting from events beyond our reasonable
          control, including but not limited to acts of God, natural disasters, power failures, internet outages,
          cyberattacks, labour disputes, or governmental actions.
        </p>
      </Section>

      <Section title="20. Entire Agreement">
        <p>
          These Terms, together with our <Link to="/privacy">Privacy Policy</Link>, constitute the entire agreement
          between you and the Company regarding the Service and supersede any prior agreements or understandings,
          whether written or oral.
        </p>
      </Section>

      <Section title="21. Governing Law and Disputes">
        <p>
          These Terms are governed by and construed in accordance with the laws of <strong>England and Wales</strong>.
          Any disputes arising out of or in connection with these Terms or the Service shall be subject to the exclusive
          jurisdiction of the courts of England and Wales.
        </p>
        <p>
          Nothing in this clause affects your statutory rights as a consumer, including your right to bring proceedings
          in the courts of the country where you are domiciled.
        </p>
      </Section>

      <Section title="22. Contact">
        <p>
          For questions about these Terms or the Service, contact us at:
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li><strong>Email:</strong> <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a></li>
          <li><strong>Company:</strong> Anvega Ltd (Company No. [XXXXXXXX])</li>
          <li><strong>Address:</strong> [Registered Office Address]</li>
        </ul>
      </Section>
    </div>
    </PhoneFrame>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: '#374151' }}>{children}</div>
    </section>
  )
}

function InfoBox({ colour, children }: { colour: 'red' | 'blue' | 'amber' | 'grey'; children: React.ReactNode }) {
  const colours = {
    red: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
    blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
    amber: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    grey: { bg: '#f9fafb', border: '#e5e7eb', text: '#374151' },
  }
  const c = colours[colour]
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      color: c.text,
      fontSize: 14,
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  )
}
