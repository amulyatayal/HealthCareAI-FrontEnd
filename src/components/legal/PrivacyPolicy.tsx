import { useState } from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../../wireframes/components/PhoneFrame'
import { getJurisdiction } from '../../utils/jurisdiction'

export function PrivacyPolicy() {
  const [tab, setTab] = useState<'uk' | 'india'>(getJurisdiction)

  return (
    <PhoneFrame>
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 64px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Shield size={28} style={{ color: '#f43f5e' }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 }}>Privacy Policy</h1>
      </div>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>Last updated: January 2026</p>

      <JurisdictionTabs value={tab} onChange={setTab} />

      {/* ------------------------------------------------------------------ */}
      <Section title="1. Who We Are">
        <p>
          <strong>Anvega Ltd</strong> (Company No. <strong>[XXXXXXXX]</strong>), incorporated in England and Wales with
          its registered office at <strong>[Registered Address]</strong>, is the{' '}
          <strong>{tab === 'uk' ? 'data controller' : 'Data Fiduciary'}</strong>{' '}
          responsible for your personal data when you use the Tara Health Companion ("<strong>the Service</strong>").
        </p>
        <p>
          References to "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>" mean Anvega Ltd.
        </p>
        <p>
          <strong>Contact:</strong>{' '}
          <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="2. Data Protection Governance">
        {tab === 'uk' ? (
          <>
            <p>
              We have assessed whether we are required to appoint a Data Protection Officer (DPO) under Article 37 UK GDPR.
              We will update this policy and appoint a DPO if this requirement applies as our processing activities evolve.
            </p>
            <p>
              For processing that is likely to result in a high risk to individuals — including health data and
              AI-related processing — we conduct Data Protection Impact Assessments (DPIAs) and review them as our
              features evolve.
            </p>
            <p>
              In the meantime, all data protection queries should be directed to{' '}
              <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>.
            </p>
          </>
        ) : (
          <>
            <p>
              As a <strong>Data Fiduciary</strong> under the Digital Personal Data Protection Act 2023 (DPDPA),
              we are responsible for determining the purpose and means of processing your personal data.
            </p>
            <p>
              We comply with the obligations set out in DPDPA 2023 and the DPDP Rules 2025, including:
            </p>
            <ul>
              <li>Processing personal data only for lawful purposes with valid consent.</li>
              <li>Implementing reasonable security safeguards to protect personal data.</li>
              <li>Ensuring data accuracy and providing mechanisms for correction.</li>
              <li>Erasing personal data when it is no longer needed for the purpose it was collected.</li>
            </ul>
            <p>
              Future integration with <strong>Consent Managers</strong> (as defined under DPDPA) will be
              supported when the framework becomes operational.
            </p>
            <p>
              All data protection queries should be directed to{' '}
              <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>.
            </p>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="3. Data We Collect">
        <p>We collect only the data necessary to provide and improve the Service (<strong>data minimisation principle</strong>):</p>
        <ul>
          <li><strong>Account information</strong> — name, email address (via Google Sign-In) or guest username.</li>
          <li><strong>Chat conversations</strong> — messages you send to Tara and the AI-generated responses.</li>
          <li><strong>Health data</strong> (special category) — mood scores, symptom logs, physical test results. Collected <strong>only</strong> with your explicit consent and only if you choose to use those features.</li>
          <li><strong>Treatment pathway</strong> — your selected treatment stage and onboarding answers.</li>
          <li><strong>Appointments</strong> — titles, dates, locations you enter.</li>
          <li><strong>Documents</strong> — files you upload (stored <strong>encrypted at rest and in transit</strong>). Documents may contain personal or health information depending on what you upload. You control what you upload and delete.</li>
          <li><strong>Forum posts and comments</strong> — content you publish in the community.</li>
          <li><strong>Technical data</strong> — browser type, device type, IP address, pages visited. Non-essential analytics data is only collected <strong>with your consent</strong> via our cookie banner.</li>
          <li><strong>Consent records</strong> — timestamps and choices from your cookie and data processing consent decisions, retained as an audit trail.</li>
        </ul>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="4. How We Use Your Data (Lawful Basis)">
        {tab === 'uk' ? (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <Th>Purpose</Th>
                  <Th>Lawful Basis</Th>
                </tr>
              </thead>
              <tbody>
                <Tr purpose="Provide the core service (account, chat, dashboard)" basis="Performance of contract (Art. 6(1)(b))" />
                <Tr purpose="Personalise AI responses using your treatment stage" basis="Performance of contract (Art. 6(1)(b))" />
                <Tr purpose="Process health data (mood, symptoms, tests)" basis="Performance of contract (Art. 6(1)(b)) + Explicit consent for special category data (Art. 9(2)(a))" />
                <Tr purpose="Store and manage your uploaded documents" basis="Consent (Art. 6(1)(a))" />
                <Tr purpose="Share data with your clinician (when you request)" basis="Explicit consent (Art. 9(2)(a))" />
                <Tr purpose="Community forum features" basis="Legitimate interest (Art. 6(1)(f))" />
                <Tr purpose="Analytics and service improvement" basis="Consent via cookie banner (Art. 6(1)(a))" />
                <Tr purpose="Security, fraud prevention, abuse detection" basis="Legitimate interest (Art. 6(1)(f))" />
                <Tr purpose="Comply with legal obligations" basis="Legal obligation (Art. 6(1)(c))" />
              </tbody>
            </table>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
              Where we process special category (health) data, we rely on both a lawful basis under Article 6 and an
              additional condition under Article 9. Where we rely on <strong>legitimate interest</strong>, we have
              conducted a balancing test to ensure your rights and freedoms are not overridden.
            </p>
          </>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <Th>Purpose</Th>
                  <Th>Lawful Basis</Th>
                </tr>
              </thead>
              <tbody>
                <Tr purpose="Provide the core service (account, chat, dashboard)" basis="Necessary for performance of contract (DPDPA Section 7(b))" />
                <Tr purpose="Personalise AI responses using your treatment stage" basis="Necessary for performance of contract (DPDPA Section 7(b))" />
                <Tr purpose="Process health data (mood, symptoms, tests)" basis="Consent — free, specific, informed, unambiguous (DPDPA Section 6)" />
                <Tr purpose="Store and manage your uploaded documents" basis="Consent (DPDPA Section 6)" />
                <Tr purpose="Share data with your clinician (when you request)" basis="Per-event consent (DPDPA Section 6)" />
                <Tr purpose="Community forum features" basis="Consent (DPDPA Section 6)" />
                <Tr purpose="Analytics and service improvement" basis="Consent (DPDPA Section 6)" />
                <Tr purpose="Security, fraud prevention, abuse detection" basis="Reasonable purpose (DPDPA Section 7(g))" />
                <Tr purpose="Comply with legal obligations" basis="Legal obligation (DPDPA Section 7(a))" />
              </tbody>
            </table>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
              Under DPDPA 2023, all consent must be free, specific, informed, and unambiguous. You may withdraw
              consent at any time through Profile → Privacy & Data Rights.
            </p>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5. Data Sharing and Recipients">
        <p>We do <strong>not</strong> sell your personal data. We do <strong>not</strong> use your data for behavioural advertising. We may share data with:</p>
        <ul>
          <li>
            <strong>Cloud infrastructure providers</strong> — for hosting and storage. All data is encrypted at rest
            and in transit.
          </li>
          <li>
            <strong>Your clinical team</strong> — only when you explicitly request via "Share my Data". You choose
            exactly what to share each time.
          </li>
          <li>
            <strong>AI model providers</strong> — We use third-party AI providers to generate responses to your
            queries. These providers act as <strong>data processors</strong> on our behalf under contractual
            safeguards and are <strong>not permitted to use your personal data for their own purposes</strong>,
            including model training. We do not intentionally transmit directly identifying information (such as
            your name or email address) within AI prompts. However, if you include personal information in your
            messages, it may be processed by the AI provider to generate a response.
          </li>
          <li>
            <strong>Authentication providers</strong> — Google (for Sign-In). Subject to{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
          </li>
          <li>
            <strong>Law enforcement or regulatory authorities</strong> — only when legally required or to protect
            the safety of our users.
          </li>
        </ul>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6. Data Minimisation">
        <p>
          We are committed to the principle of data minimisation. We collect only the personal data that is necessary
          for the purposes described in this policy. Specifically:
        </p>
        <ul>
          <li>We do not scrape or collect data from external sources about you.</li>
          <li>We do not engage in behavioural profiling or targeted advertising.</li>
          <li>We do not sell, rent, or trade your personal data to third parties.</li>
          <li>Health features are opt-in — data is only collected if you actively use those features and have provided consent.</li>
          <li>Guest accounts collect minimal data (username only) with no email required.</li>
        </ul>
        <p>
          <strong>Note:</strong> Even for guest accounts, we may process limited technical data (such as IP address and
          device information) for security, fraud prevention, and abuse detection under our legitimate interest.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="7. Research Use and Anonymisation">
        {tab === 'uk' ? (
          <>
            <p>
              Where your data is <strong>irreversibly anonymised</strong> — such that you are no longer identifiable, in
              accordance with the ICO's anonymisation, pseudonymisation, and privacy enhancing technologies guidance — it
              may be used for:
            </p>
            <ul>
              <li>Research and statistical analysis.</li>
              <li>Service improvement and feature development.</li>
              <li>Training and improving AI models.</li>
            </ul>
            <p>
              Anonymised data is no longer personal data under UK GDPR and is therefore not subject to data subject rights.
              We will never attempt to re-identify anonymised data. We implement technical and organisational safeguards
              designed to reduce the risk of re-identification, including aggregation, minimisation, and access controls.
            </p>
          </>
        ) : (
          <>
            <p>
              Where your data is <strong>irreversibly anonymised</strong> — such that you are no longer identifiable — it
              may be used for:
            </p>
            <ul>
              <li>Research and statistical analysis.</li>
              <li>Service improvement and feature development.</li>
              <li>Training and improving AI models.</li>
            </ul>
            <p>
              Any research involving health data complies with the <strong>ICMR Ethical Guidelines for AI in Biomedical
              Research and Healthcare (2023)</strong> and is conducted under Institutional Ethics Committee oversight.
              Anonymised data is no longer personal data under DPDPA and is not subject to data principal rights.
            </p>
          </>
        )}
        <p>
          <strong>Important:</strong> We do not use your identifiable personal data to train AI models. Only irreversibly
          anonymised and aggregated datasets may be used for this purpose.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="8. International Transfers">
        {tab === 'uk' ? (
          <>
            <p>
              The Service may use third-party infrastructure and services that process personal data outside the United
              Kingdom and the European Economic Area, including but not limited to cloud hosting (AWS), authentication
              (Google), and AI model providers.
            </p>
            <p>
              Where such transfers occur, we ensure that appropriate safeguards are in place, including:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission.</li>
              <li>The UK International Data Transfer Agreement (IDTA) or UK Addendum.</li>
              <li>Reliance on an adequacy decision, where applicable.</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              The Service may use third-party infrastructure and services that process personal data outside India,
              including cloud hosting, authentication, and AI model providers located in the United Kingdom and
              European Economic Area.
            </p>
            <p>
              Under DPDPA 2023, cross-border transfers of personal data are permitted except to jurisdictions
              restricted by notification from the Central Government. We implement appropriate contractual
              safeguards for all cross-border transfers, including:
            </p>
            <ul>
              <li>Contractual obligations on data processors to maintain equivalent data protection standards.</li>
              <li>Encryption of data in transit and at rest.</li>
              <li>Compliance with any Central Government notifications restricting transfers to specific jurisdictions.</li>
            </ul>
          </>
        )}
        <p>
          You may request further details about the safeguards in place by contacting us at{' '}
          <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="9. Data Retention">
        <ul>
          <li><strong>Account data</strong> — retained until you delete your account.</li>
          <li><strong>Chat history</strong> — retained for up to {tab === 'uk' ? '2 years' : '12 months'}, or until you request deletion.</li>
          <li><strong>Health data</strong> (mood, symptoms, tests) — retained until you withdraw consent or delete your account.</li>
          <li><strong>Documents</strong> — retained until you delete them or your account.</li>
          <li><strong>Forum content</strong> — retained until deleted; anonymised on account deletion.</li>
          <li><strong>Consent records</strong> — retained for the duration of your account and for 3 years after deletion for audit purposes.</li>
        </ul>
        <p>
          Upon account deletion, your personal data is removed from our active systems within <strong>30 days</strong>.
          Residual copies may remain in secure, encrypted backups for up to <strong>90 days</strong> before automatic
          deletion.
        </p>
        <p>
          We may retain limited information beyond these periods where required by law (e.g. financial records, tax
          obligations), for fraud prevention, or to establish, exercise, or defend legal claims. Any such retained data
          will be minimised to what is strictly necessary.
        </p>
        {tab === 'india' && (
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Under DPDPA 2023, personal data must be erased when it is no longer necessary for the purpose for which
            it was collected, unless retention is required by law.
          </p>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10. Your Rights">
        {tab === 'uk' ? (
          <>
            <p>Under the UK GDPR (Articles 15–22), you have the right to:</p>
            <ul>
              <li><strong>Access</strong> (Art. 15) — request a copy of your personal data.</li>
              <li><strong>Rectification</strong> (Art. 16) — correct inaccurate or incomplete data.</li>
              <li><strong>Erasure</strong> (Art. 17) — request deletion of your data ("right to be forgotten").</li>
              <li><strong>Restrict processing</strong> (Art. 18) — limit how we use your data.</li>
              <li><strong>Data portability</strong> (Art. 20) — receive your data in a structured, commonly used, machine-readable format (for example JSON).</li>
              <li><strong>Object</strong> (Art. 21) — object to processing based on legitimate interests.</li>
              <li><strong>Withdraw consent</strong> (Art. 7) — at any time, without affecting the lawfulness of prior processing.</li>
              <li><strong>Not be subject to automated decision-making</strong> (Art. 22) — see Section 11 below.</li>
            </ul>
          </>
        ) : (
          <>
            <p>Under DPDPA 2023, you have the following rights as a Data Principal:</p>
            <ul>
              <li><strong>Right to Access</strong> (Section 11) — obtain a summary of your personal data and processing activities.</li>
              <li><strong>Right to Correction and Erasure</strong> (Section 12) — correct inaccurate data or request erasure of data no longer necessary for its purpose.</li>
              <li><strong>Right to Grievance Redressal</strong> (Section 13) — submit a grievance to our Grievance Officer.</li>
              <li><strong>Right to Nominate</strong> (Section 14) — designate a nominee to exercise your data rights in case of death or incapacity.</li>
              <li><strong>Withdraw consent</strong> — at any time, without affecting the lawfulness of processing performed before withdrawal.</li>
            </ul>
          </>
        )}

        <InfoBox>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Impact of Consent Withdrawal</p>
          <p>
            Withdrawing consent for specific data processing categories may limit certain features of the Service. For
            example, withdrawing health data consent will disable mood tracking, symptom logging, and trend visualisation.
            Core service functionality (account and AI chat) will remain available.
          </p>
        </InfoBox>

        <p><strong>How to exercise your rights:</strong></p>
        <ul>
          <li><strong>In the app:</strong> Profile → Privacy & Data Rights → "Download my data", "Manage Data Consent", or "Delete my account".</li>
          <li><strong>By email:</strong> <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>.</li>
        </ul>
        <p>We will respond within <strong>30 days</strong>. In complex cases, we may extend this by a further 60 days, in which case we will inform you.</p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="11. Automated Decision-Making and AI">
        <p>
          Our AI assistant generates responses based on your queries and treatment context using probabilistic language
          models. These responses are <strong>informational only</strong> and do not constitute:
        </p>
        <ul>
          <li>Medical advice, diagnosis, or treatment.</li>
          {tab === 'uk' ? (
            <li>Automated decision-making with legal or similarly significant effects (Art. 22 UK GDPR).</li>
          ) : (
            <li>Autonomous clinical decisions. Under ICMR Ethical Guidelines for AI in Healthcare (2023), all AI features operate under Institutional Ethics Committee oversight.</li>
          )}
        </ul>
        <p>
          AI-generated content may be inaccurate or incomplete. You always have the right to consult your clinical
          team and should independently verify any health-related information.
        </p>
        {tab === 'india' && (
          <p>
            You can request human review of any AI-generated information. Your conversations may be reviewed for
            safety and quality in accordance with ICMR guidelines.
          </p>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="12. Cookies and Consent">
        <p>
          We use <strong>essential cookies</strong> required for the Service to function (e.g. authentication, session
          management). These do not require consent.
        </p>
        <p>
          Non-essential cookies (for example, functional and analytics cookies) are only set <strong>after</strong> you
          provide consent via our cookie banner. You can review and change your cookie preferences at any time via the
          cookie banner or in your Profile settings.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="13. Security">
        <p>
          We implement appropriate technical and organisational measures to protect your data, including:
        </p>
        <ul>
          <li>Encryption at rest (AES-256) and in transit (TLS 1.2+).</li>
          <li>Access controls and role-based permissions.</li>
          <li>Regular security reviews and vulnerability assessments.</li>
          <li>Uploaded documents are stored encrypted at rest and in transit.</li>
        </ul>
        <p>
          No system is completely secure. While we take reasonable precautions, we cannot guarantee absolute security
          of your data.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="14. Data Breach Notification">
        {tab === 'uk' ? (
          <>
            <p>
              In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will:
            </p>
            <ul>
              <li>Notify the relevant supervisory authority (the ICO) within <strong>72 hours</strong> of becoming aware of the breach, where feasible.</li>
              <li>Notify you <strong>without undue delay</strong> if the breach is likely to result in a high risk to your rights and freedoms.</li>
              <li>Document the breach, its effects, and the remedial actions taken.</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              In the event of a personal data breach, we will:
            </p>
            <ul>
              <li>Notify the <strong>Data Protection Board of India</strong> and affected Data Principals as required under DPDPA 2023.</li>
              <li>Notify you <strong>without undue delay</strong> with details of the breach and steps taken to mitigate its impact.</li>
              <li>Document the breach, its effects, and the remedial actions taken.</li>
            </ul>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="15. Children">
        <p>
          Our Service is intended for users aged <strong>18 or over</strong>. We do not knowingly collect personal data
          from individuals under 18. If you are a parent or guardian and believe your child has provided us with personal
          data, please contact us and we will promptly delete it.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="16. Complaints">
        {tab === 'uk' ? (
          <>
            <p>
              If you are not satisfied with how we handle your data, you have the right to lodge a complaint with
              your supervisory authority. In the UK, this is the{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">Information Commissioner's Office (ICO)</a>.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: 14 }}>
              <li><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
              <li><strong>Phone:</strong> 0303 123 1113</li>
            </ul>
            <p>
              We would appreciate the opportunity to address your concerns before you approach the ICO. Please contact
              us first at <a href="mailto:contact-us@anvega.ai">contact-us@anvega.ai</a>.
            </p>
          </>
        ) : (
          <>
            <p>
              If you are not satisfied with how we handle your data, you may submit a grievance to our
              Grievance Officer:
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: 14 }}>
              <li><strong>Name:</strong> Anvega Compliance Team</li>
              <li><strong>Email:</strong> <a href="mailto:grievance@anvega.ai">grievance@anvega.ai</a></li>
            </ul>
            <p>
              We will acknowledge your grievance within <strong>48 hours</strong> and resolve it within <strong>30 days</strong>,
              as required under DPDPA.
            </p>
            <p>
              If your grievance is not resolved satisfactorily, you may file a complaint with the{' '}
              <strong>Data Protection Board of India</strong> as established under DPDPA 2023.
            </p>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="17. Ethics Committee Oversight">
        {tab === 'uk' ? (
          <>
            <p>
              This application has been reviewed and approved by the relevant Institutional Ethics Committee.
              If you have concerns about how this application handles your data or the ethical conduct of
              AI features, you may contact the Ethics Committee directly.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: 14 }}>
              <li><strong>Committee:</strong> Barts Health NHS Trust Research Ethics Committee</li>
              <li><strong>Approval Reference:</strong> IRAS 2025/001234</li>
              <li><strong>Valid until:</strong> 31 January 2027</li>
              <li><strong>Email:</strong> <a href="mailto:research.ethics@bartshealth.nhs.uk">research.ethics@bartshealth.nhs.uk</a></li>
            </ul>
          </>
        ) : (
          <>
            <p>
              This application has been reviewed and approved by the relevant Institutional Ethics Committee.
              Under ICMR Ethical Guidelines for AI in Healthcare (2023), all applications processing health
              data must operate under Institutional Ethics Committee oversight.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: 14 }}>
              <li><strong>Committee:</strong> Apollo Hospitals Institutional Ethics Committee</li>
              <li><strong>Approval Reference:</strong> AH-IEC/2025/056</li>
              <li><strong>Valid until:</strong> 31 March 2027</li>
              <li><strong>Email:</strong> <a href="mailto:iec@apollohospitals.com">iec@apollohospitals.com</a></li>
              <li><strong>Phone:</strong> +91 44 2829 3333</li>
            </ul>
          </>
        )}
        <p>
          If you have concerns about how this application handles your data, you may contact the Ethics Committee directly.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="18. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in law, regulatory requirements, or
          our practices. We will notify you of significant changes via the Service or by email. The "Last updated" date
          at the top indicates when the policy was last revised.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="19. Contact">
        <p>For any questions about this policy or your data:</p>
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

function JurisdictionTabs({ value, onChange }: { value: 'uk' | 'india'; onChange: (v: 'uk' | 'india') => void }) {
  return (
    <div style={{
      display: 'flex',
      gap: 0,
      marginBottom: 28,
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
    }}>
      {([
        { key: 'uk' as const, label: 'United Kingdom' },
        { key: 'india' as const, label: 'India' },
      ]).map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: value === key ? '#f43f5e' : '#f9fafb',
            color: value === key ? 'white' : '#6b7280',
          }}
        >
          {label}
        </button>
      ))}
    </div>
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

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff1f2',
      border: '1px solid #fecdd3',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      marginTop: 8,
      color: '#9f1239',
      fontSize: 14,
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #e5e7eb', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
      {children}
    </th>
  )
}

function Tr({ purpose, basis }: { purpose: string; basis: string }) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6' }}>{purpose}</td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>{basis}</td>
    </tr>
  )
}
