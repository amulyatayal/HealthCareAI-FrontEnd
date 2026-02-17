import { useState } from 'react'
import { Shield, Heart, Activity, FileText, Users, ChevronDown, ChevronUp, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const DATA_CONSENT_KEY = 'gdpr_data_consent_v1'

export interface DataConsentChoices {
  /** Core service: account + chat. Always true — contract basis, not consent. */
  coreService: true
  /** Health tracking: mood, symptoms, physical tests. Explicit consent (Art. 9(2)(a)). */
  healthData: boolean
  /** Third-party AI model providers process your messages. */
  aiModelProviders: boolean
  /** Document storage: uploaded medical records. */
  documentStorage: boolean
  /** Community: forum posts, buddy matching. */
  community: boolean
  /** Clinical sharing: per-event consent — not stored here, always true as acknowledgement. */
  clinicalSharing: true
}

interface StoredDataConsent {
  choices: DataConsentChoices
  timestamp: string
  version: 1
}

export function getStoredDataConsent(): StoredDataConsent | null {
  try {
    const raw = localStorage.getItem(DATA_CONSENT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

export function saveDataConsent(choices: DataConsentChoices) {
  const stored: StoredDataConsent = {
    choices,
    timestamp: new Date().toISOString(),
    version: 1,
  }
  try {
    localStorage.setItem(DATA_CONSENT_KEY, JSON.stringify(stored))
  } catch {
    // ignore
  }
}

export function clearDataConsent() {
  try {
    localStorage.removeItem(DATA_CONSENT_KEY)
  } catch {
    // ignore
  }
}

interface Props {
  onConsent: (choices: DataConsentChoices) => void
}

type ConsentItemType = 'informational' | 'explicit' | 'optional'

interface ConsentItem {
  key: string
  choiceKey?: keyof DataConsentChoices
  icon: typeof Shield
  iconBg: string
  iconColor: string
  title: string
  badge?: string
  badgeColor?: string
  summary: string
  consentStatement?: string
  detail: string
  type: ConsentItemType
  legalBasis: string
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    key: 'coreService',
    icon: Heart,
    iconBg: '#fef2f2',
    iconColor: '#f43f5e',
    title: 'Core Service',
    badge: 'Required',
    badgeColor: '#6b7280',
    summary: 'Account, authentication, and AI chat',
    detail: 'We store your name and email (from Google) or guest username to provide the service. Your chat messages are processed by our AI to generate responses. This processing is necessary to provide the Service and does not require consent.',
    type: 'informational',
    legalBasis: 'Performance of contract (Art. 6(1)(b))',
  },
  {
    key: 'healthData',
    choiceKey: 'healthData',
    icon: Activity,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Health Data',
    badge: 'Explicit Consent Required',
    badgeColor: '#dc2626',
    summary: 'Mood logs, symptom tracking, physical tests',
    consentStatement: 'By ticking this box, you explicitly consent to the processing of your health data under UK GDPR.',
    detail: 'I explicitly consent to the processing of my health data (special category data) under Article 9(2)(a) UK GDPR. This includes mood scores, symptom entries, and physical test results stored to show trends and support my wellbeing journey.',
    type: 'explicit',
    legalBasis: 'Performance of contract (Art. 6(1)(b)) + Explicit consent (Art. 9(2)(a))',
  },
  {
    key: 'aiModelProviders',
    choiceKey: 'aiModelProviders',
    icon: Globe,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    title: 'AI Model Providers',
    summary: 'Messages processed by third-party AI providers',
    detail: 'Your messages may be processed by third-party AI providers acting as data processors on our behalf to generate responses. These providers are contractually prohibited from using your data for their own purposes, including model training. We do not intentionally send identifying information (name, email) — only conversation content. If disabled, AI chat functionality may be limited or unavailable.',
    type: 'optional',
    legalBasis: 'Consent (Art. 6(1)(a))',
  },
  {
    key: 'documentStorage',
    choiceKey: 'documentStorage',
    icon: FileText,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Document Storage',
    summary: 'Upload and store medical records (may include personal and health information)',
    detail: 'Documents you upload are encrypted at rest (AES-256) and in transit (TLS 1.2+). We do not read or analyse your documents. They are only accessible to you and anyone you explicitly share them with. Documents may contain sensitive personal data — you control what you upload and delete.',
    type: 'optional',
    legalBasis: 'Consent (Art. 6(1)(a))',
  },
  {
    key: 'community',
    choiceKey: 'community',
    icon: Users,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Community Features',
    summary: 'Forum posts, buddy matching, events',
    detail: 'Content you post in the community is visible to other users. You can post anonymously. Buddy matching shares limited profile info with your match. You can delete your content at any time.',
    type: 'optional',
    legalBasis: 'Consent (Art. 6(1)(a))',
  },
  {
    key: 'clinicalSharing',
    icon: Shield,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    title: 'Clinical Data Sharing',
    badge: 'Per-Event',
    badgeColor: '#16a34a',
    summary: 'Share selected data with your clinician',
    detail: 'We will only share data with your clinician when you explicitly choose to share specific information via the "Share my Data" feature. Each sharing action requires your individual consent at the time — this is not a blanket authorisation.',
    type: 'informational',
    legalBasis: 'Explicit consent per event (Art. 9(2)(a))',
  },
]

export function DataConsentScreen({ onConsent }: Props) {
  const [choices, setChoices] = useState<Omit<DataConsentChoices, 'coreService' | 'clinicalSharing'>>({
    healthData: false,
    aiModelProviders: false,
    documentStorage: false,
    community: false,
  })
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const toggle = (key: keyof typeof choices) => {
    setChoices((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const buildFinalChoices = (overrides?: Partial<typeof choices>): DataConsentChoices => {
    const merged = overrides ?? choices
    return {
      coreService: true,
      clinicalSharing: true,
      healthData: merged.healthData ?? false,
      aiModelProviders: merged.aiModelProviders ?? false,
      documentStorage: merged.documentStorage ?? false,
      community: merged.community ?? false,
    }
  }

  const acceptAll = () => {
    const all = buildFinalChoices({
      healthData: true,
      aiModelProviders: true,
      documentStorage: true,
      community: true,
    })
    saveDataConsent(all)
    onConsent(all)
  }

  const acceptSelected = () => {
    const final = buildFinalChoices()
    saveDataConsent(final)
    onConsent(final)
  }

  const toggleableItems = CONSENT_ITEMS.filter((i) => i.type !== 'informational')
  const optionalCount = Object.values(choices).filter(Boolean).length
  const totalOptional = toggleableItems.length

  return (
    <div style={{
      minHeight: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
        padding: '24px 20px 20px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <Shield size={24} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>Your Data, Your Choice</h1>
        <p style={{ fontSize: 13, opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
          Tara collects data to provide its features. Under UK GDPR, you have the right to decide
          exactly what we process. You can change these choices at any time in Settings.
        </p>
        <p style={{ fontSize: 11, opacity: 0.7, margin: '8px 0 0', lineHeight: 1.4 }}>
          Consent applies to Privacy Policy version January 2026.
        </p>
      </div>

      {/* Consent items */}
      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        {CONSENT_ITEMS.map((item) => {
          const isExpanded = expandedItem === item.key
          const isToggleable = item.type !== 'informational' && item.choiceKey
          const isChecked = isToggleable
            ? choices[item.choiceKey as keyof typeof choices]
            : true

          return (
            <div
              key={item.key}
              style={{
                background: 'white',
                borderRadius: 14,
                marginBottom: 10,
                border: item.type === 'informational'
                  ? '2px solid #e5e7eb'
                  : isChecked
                    ? item.type === 'explicit' ? '2px solid #dc2626' : '2px solid #f43f5e'
                    : '2px solid #e5e7eb',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 14px',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedItem(isExpanded ? null : item.key)}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.icon size={20} style={{ color: item.iconColor }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {item.title}
                    {item.badge && (
                      <span style={{
                        fontSize: 10,
                        color: 'white',
                        background: item.badgeColor,
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontWeight: 600,
                        lineHeight: '16px',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{item.summary}</div>
                  {item.consentStatement && isChecked && (
                    <div style={{ fontSize: 11, color: '#dc2626', marginTop: 3, fontWeight: 500, lineHeight: 1.4 }}>
                      {item.consentStatement}
                    </div>
                  )}
                </div>
                {isToggleable ? (
                  <label
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item.choiceKey as keyof typeof choices)}
                      style={{
                        width: 20,
                        height: 20,
                        accentColor: item.type === 'explicit' ? '#dc2626' : '#f43f5e',
                        cursor: 'pointer',
                      }}
                    />
                  </label>
                ) : (
                  <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>
                    {item.key === 'coreService' ? '✓ Always on' : '↗ Per event'}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
                )}
              </div>
              {isExpanded && (
                <div style={{
                  padding: '0 14px 14px 66px',
                  fontSize: 12,
                  color: '#4b5563',
                  lineHeight: 1.6,
                }}>
                  <p style={{ margin: '0 0 6px' }}>{item.detail}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
                    Legal basis: {item.legalBasis}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {/* Withdrawal impact notice */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 10,
          padding: '10px 14px',
          marginTop: 4,
          marginBottom: 8,
          fontSize: 12,
          color: '#92400e',
          lineHeight: 1.5,
        }}>
          <strong>Note:</strong> Withdrawing consent may limit certain features of the Service.
          For example, disabling Health Data will prevent mood tracking and symptom logging.
        </div>

        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 1.5, margin: '8px 0 4px' }}>
          You can withdraw consent at any time in Profile → Privacy & Data Rights.
          Read our full{' '}
          <Link to="/privacy" style={{ color: '#f43f5e', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>
      </div>

      {/* Actions */}
      <div style={{
        padding: '12px 16px 20px',
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <p style={{ fontSize: 12, color: '#374151', textAlign: 'center', margin: '0 0 8px', lineHeight: 1.4 }}>
          You may refuse optional processing without affecting access to the core Service.
        </p>
        <button
          onClick={acceptAll}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accept All Optional Processing
        </button>
        <button
          onClick={acceptSelected}
          style={{
            width: '100%',
            padding: '14px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Continue with Selected ({optionalCount}/{totalOptional} optional)
        </button>
        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.4 }}>
          By continuing, you confirm you are 18 or over.
        </p>
      </div>
    </div>
  )
}
