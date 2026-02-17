import { useState, useEffect, useRef } from 'react'
import { Shield, QrCode, Clock, CheckCircle, History, AlertTriangle } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const DATA_OPTIONS = [
  { id: 'mood', label: 'Mood & wellness data', description: 'Mood diary, scores and trends' },
  { id: 'pathway', label: 'Treatment pathway', description: 'Where I am in my journey' },
  { id: 'symptoms', label: 'Symptom log', description: 'Logged symptoms and patterns' },
  { id: 'documents', label: 'Documents summary', description: 'List of uploaded documents (not files)' },
]

type ViewState = 'select' | 'qr' | 'history'

interface ShareResult {
  share_id: string
  qr_code_base64: string
  token: string
  expires_at: string
}

interface ShareHistoryItem {
  share_id: string
  data_types: Record<string, boolean>
  created_at: string
  expires_at: string
  status: 'active' | 'expired' | 'revoked'
  revoked_at?: string
}

export function ShareDataPage() {
  const [view, setView] = useState<ViewState>('select')
  const [selected, setSelected] = useState<Set<string>>(new Set(['mood', 'pathway']))
  const [generating, setGenerating] = useState(false)
  const [shareResult, setShareResult] = useState<ShareResult | null>(null)
  const [countdown, setCountdown] = useState('')
  const [history, setHistory] = useState<ShareHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Countdown timer for QR code expiry
  useEffect(() => {
    if (!shareResult) return
    const updateCountdown = () => {
      const now = Date.now()
      const expires = new Date(shareResult.expires_at).getTime()
      const remaining = Math.max(0, expires - now)
      if (remaining <= 0) {
        setCountdown('Expired')
        clearInterval(timerRef.current)
        return
      }
      const mins = Math.floor(remaining / 60000)
      const secs = Math.floor((remaining % 60000) / 1000)
      setCountdown(`${mins}:${secs.toString().padStart(2, '0')}`)
    }
    updateCountdown()
    timerRef.current = setInterval(updateCountdown, 1000)
    return () => clearInterval(timerRef.current)
  }, [shareResult])

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const { generateShare } = await import('../../services/api')
      const result = await generateShare({
        data_types: {
          mood: selected.has('mood'),
          pathway: selected.has('pathway'),
          symptoms: selected.has('symptoms'),
          documents_summary: selected.has('documents'),
        },
      })
      setShareResult(result)
      setView('qr')
    } catch (err) {
      // Fallback for when API is not available — generate a mock QR for demonstration
      const mockToken = `share_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      setShareResult({
        share_id: `sid_${Date.now()}`,
        qr_code_base64: '',
        token: mockToken,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })
      setView('qr')
    }
    setGenerating(false)
  }

  const handleRevoke = async (shareId: string) => {
    setRevoking(shareId)
    try {
      const { revokeShare } = await import('../../services/api')
      await revokeShare(shareId)
    } catch {
      // API not available
    }
    if (shareResult?.share_id === shareId) {
      setShareResult(null)
      setView('select')
    }
    setHistory((prev) => prev.map((h) => h.share_id === shareId ? { ...h, status: 'revoked' as const, revoked_at: new Date().toISOString() } : h))
    setRevoking(null)
  }

  const loadHistory = async () => {
    setLoadingHistory(true)
    setView('history')
    try {
      const { getShareHistory } = await import('../../services/api')
      const data = await getShareHistory()
      setHistory(data.shares)
    } catch {
      // Mock data for demonstration
      setHistory([
        { share_id: 'demo1', data_types: { mood: true, pathway: true, symptoms: false, documents_summary: false }, created_at: new Date(Date.now() - 86400000).toISOString(), expires_at: new Date(Date.now() - 86400000 + 600000).toISOString(), status: 'expired' },
        { share_id: 'demo2', data_types: { mood: true, pathway: true, symptoms: true, documents_summary: true }, created_at: new Date(Date.now() - 172800000).toISOString(), expires_at: new Date(Date.now() - 172800000 + 600000).toISOString(), status: 'expired' },
      ])
    }
    setLoadingHistory(false)
  }

  // QR Code view
  if (view === 'qr' && shareResult) {
    return (
      <WireframeLayout title="Share my Data" showBack>
        <div style={{ padding: 16, textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}>
            {shareResult.qr_code_base64 ? (
              <img
                src={`data:image/png;base64,${shareResult.qr_code_base64}`}
                alt="Share QR Code"
                style={{ width: 200, height: 200, borderRadius: 12, margin: '0 auto', display: 'block' }}
              />
            ) : (
              <div style={{
                width: 200,
                height: 200,
                margin: '0 auto',
                background: 'white',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #93c5fd',
              }}>
                <QrCode size={64} style={{ color: '#2563eb', marginBottom: 8 }} />
                <span style={{ fontSize: 11, color: '#6b7280' }}>QR Code</span>
                <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>(generated by backend)</span>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--wf-gray-800)', marginBottom: 4 }}>
            Show this to your clinician
          </h3>
          <p style={{ fontSize: 13, color: 'var(--wf-gray-500)', marginBottom: 16, lineHeight: 1.5 }}>
            Your clinician can scan this QR code to view your selected health data.
            No login required on their end.
          </p>

          {/* Countdown */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: countdown === 'Expired' ? '#fef2f2' : '#fffbeb',
            borderRadius: 20,
            marginBottom: 16,
          }}>
            <Clock size={14} style={{ color: countdown === 'Expired' ? '#dc2626' : '#d97706' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: countdown === 'Expired' ? '#dc2626' : '#92400e' }}>
              {countdown === 'Expired' ? 'Link expired' : `Expires in ${countdown}`}
            </span>
          </div>

          {/* Selected data summary */}
          <WireframeCard style={{ textAlign: 'left', marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: 'var(--wf-gray-500)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Data included
            </p>
            {DATA_OPTIONS.filter((o) => selected.has(o.id)).map((o) => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <CheckCircle size={14} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: 13, color: 'var(--wf-gray-700)' }}>{o.label}</span>
              </div>
            ))}
          </WireframeCard>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="wf-btn wf-btn-full"
              style={{ flex: 1, background: '#dc2626', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              onClick={() => handleRevoke(shareResult.share_id)}
              disabled={countdown === 'Expired' || revoking === shareResult.share_id}
            >
              {revoking === shareResult.share_id ? 'Revoking...' : 'Revoke Access'}
            </button>
            <button
              className="wf-btn wf-btn-secondary wf-btn-full"
              style={{ flex: 1 }}
              onClick={() => { setShareResult(null); setView('select') }}
            >
              Done
            </button>
          </div>
        </div>
      </WireframeLayout>
    )
  }

  // History view
  if (view === 'history') {
    return (
      <WireframeLayout title="Share History" showBack>
        <div style={{ padding: 16 }}>
          <button
            className="wf-btn wf-btn-outline wf-btn-full"
            style={{ marginBottom: 16 }}
            onClick={() => setView('select')}
          >
            ← Back to Share
          </button>

          {loadingHistory ? (
            <p style={{ textAlign: 'center', color: 'var(--wf-gray-500)', padding: 32 }}>Loading...</p>
          ) : history.length === 0 ? (
            <WireframeCard>
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--wf-gray-500)' }}>
                <History size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p style={{ fontSize: 14 }}>No sharing history yet.</p>
              </div>
            </WireframeCard>
          ) : (
            history.map((item) => {
              const types = Object.entries(item.data_types).filter(([, v]) => v).map(([k]) => k)
              return (
                <WireframeCard key={item.share_id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--wf-gray-800)', marginBottom: 4 }}>
                        {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--wf-gray-500)' }}>
                        {types.join(', ')}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: item.status === 'active' ? '#dcfce7' : item.status === 'revoked' ? '#fef2f2' : '#f3f4f6',
                      color: item.status === 'active' ? '#16a34a' : item.status === 'revoked' ? '#dc2626' : '#6b7280',
                    }}>
                      {item.status}
                    </span>
                  </div>
                  {item.status === 'active' && (
                    <button
                      style={{ marginTop: 8, fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                      onClick={() => handleRevoke(item.share_id)}
                      disabled={revoking === item.share_id}
                    >
                      {revoking === item.share_id ? 'Revoking...' : 'Revoke'}
                    </button>
                  )}
                </WireframeCard>
              )
            })
          )}
        </div>
      </WireframeLayout>
    )
  }

  // Selection view (default)
  return (
    <WireframeLayout title="Share my Data" showBack>
      <div className="wf-main-content" style={{ padding: '16px' }}>
        {/* Security notice */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '12px 16px',
          background: '#dbeafe',
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <Shield size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, color: '#1e40af', fontWeight: 500, marginBottom: 2 }}>
              Secure QR Code Sharing
            </p>
            <p style={{ fontSize: 12, color: '#3b82f6' }}>
              A temporary QR code will be generated for your clinician to scan.
              It expires after 10 minutes and can be revoked at any time.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#fef2f2',
            borderRadius: 10,
            marginBottom: 16,
            fontSize: 13,
            color: '#dc2626',
          }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <p style={{ fontSize: 14, color: 'var(--wf-gray-600)', marginBottom: 16 }}>
          Select the data you want to share with your clinician:
        </p>

        <WireframeCard>
          {DATA_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: opt.id !== DATA_OPTIONS[DATA_OPTIONS.length - 1].id ? '1px solid var(--wf-gray-100)' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(opt.id)}
                onChange={() => toggle(opt.id)}
                style={{ marginTop: 4, width: 18, height: 18, accentColor: 'var(--wf-rose-500)' }}
              />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--wf-gray-800)' }}>{opt.label}</div>
                <div style={{ fontSize: 13, color: 'var(--wf-gray-500)' }}>{opt.description}</div>
              </div>
            </label>
          ))}
        </WireframeCard>

        <button
          type="button"
          className="wf-btn wf-btn-primary wf-btn-full"
          style={{ marginTop: 20 }}
          onClick={handleGenerate}
          disabled={selected.size === 0 || generating}
        >
          <QrCode size={18} />
          {generating ? 'Generating QR Code...' : 'Generate QR Code'}
        </button>

        {selected.size === 0 && (
          <p style={{ fontSize: 12, color: 'var(--wf-gray-500)', marginTop: 8, textAlign: 'center' }}>
            Select at least one option to share.
          </p>
        )}

        {/* Share History link */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            marginTop: 16,
            padding: 12,
            background: 'none',
            border: 'none',
            color: 'var(--wf-rose-500)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={loadHistory}
        >
          <History size={16} />
          View sharing history
        </button>

        {/* Per-event consent notice */}
        <p style={{ fontSize: 11, color: 'var(--wf-gray-400)', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
          Each share is a separate consent event under GDPR Art. 9(2)(a).
          Your clinician will see your patient reference ID only — not your email.
        </p>
      </div>
    </WireframeLayout>
  )
}
