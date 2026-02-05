import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, CheckCircle } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const DATA_OPTIONS = [
  { id: 'mood', label: 'Mood & wellness data', description: 'Mood diary, scores and trends' },
  { id: 'pathway', label: 'Treatment pathway', description: 'Where I am in my journey' },
  { id: 'symptoms', label: 'Symptom log', description: 'Logged symptoms and patterns' },
  { id: 'documents', label: 'Documents summary', description: 'List of uploaded documents (not files)' },
]

export function ShareDataPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<string>>(new Set(['mood', 'pathway']))
  const [sent, setSent] = useState(false)

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSend = () => {
    // In a real app: call API to send selected data to clinician
    setSent(true)
  }

  if (sent) {
    return (
      <WireframeLayout title="Share my Data" showBack>
        <div className="wf-main-content" style={{ padding: '16px', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle size={32} style={{ color: '#16a34a' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--wf-gray-800)', marginBottom: '8px' }}>
            Data shared with clinician
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-600)', marginBottom: '24px' }}>
            Your selected data has been sent securely. Your clinician will be able to view it in their portal.
          </p>
          <button
            type="button"
            className="wf-btn wf-btn-primary wf-btn-full"
            onClick={() => navigate('/demo/profile')}
          >
            Back to Profile
          </button>
        </div>
      </WireframeLayout>
    )
  }

  return (
    <WireframeLayout title="Share my Data" showBack>
      <div className="wf-main-content" style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            background: '#dbeafe',
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        >
          <Shield size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '13px', color: '#1e40af', fontWeight: '500', marginBottom: '2px' }}>
              Secure sharing
            </p>
            <p style={{ fontSize: '12px', color: '#3b82f6' }}>
              Data is sent only to your linked clinician via a secure channel. You choose what to include.
            </p>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--wf-gray-600)', marginBottom: '16px' }}>
          Select the data you want to send to your clinician:
        </p>

        <WireframeCard>
          {DATA_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: opt.id !== DATA_OPTIONS[DATA_OPTIONS.length - 1].id ? '1px solid var(--wf-gray-100)' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(opt.id)}
                onChange={() => toggle(opt.id)}
                style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--wf-rose-500)' }}
              />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>{opt.label}</div>
                <div style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>{opt.description}</div>
              </div>
            </label>
          ))}
        </WireframeCard>

        <button
          type="button"
          className="wf-btn wf-btn-primary wf-btn-full"
          style={{ marginTop: '20px' }}
          onClick={handleSend}
          disabled={selected.size === 0}
        >
          Send to my clinician
        </button>

        {selected.size === 0 && (
          <p style={{ fontSize: '12px', color: 'var(--wf-gray-500)', marginTop: '8px', textAlign: 'center' }}>
            Select at least one option to share.
          </p>
        )}
      </div>
    </WireframeLayout>
  )
}
