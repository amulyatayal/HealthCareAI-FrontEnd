import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Clock, User, MapPin, Activity, AlertTriangle, CheckCircle, Smile, FileText, Stethoscope } from 'lucide-react'
import type { ShareViewResponse, ShareScope } from '../../services/api'

const SCOPE_LABELS: { key: keyof ShareScope; label: string; icon: typeof Smile }[] = [
  { key: 'mood', label: 'Mood & wellness data', icon: Smile },
  { key: 'pathway', label: 'Treatment pathway', icon: Activity },
  { key: 'symptoms', label: 'Symptom log', icon: Stethoscope },
  { key: 'documents_summary', label: 'Documents summary', icon: FileText },
]

export function ShareViewerPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<ShareViewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (!token) { setError('No share token provided.'); setLoading(false); return }
    let cancelled = false
    async function load() {
      try {
        const { getShareView } = await import('../../services/api')
        const result = await getShareView(token!)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'This share link is invalid, expired, or has been revoked.')
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [token])

  useEffect(() => {
    if (!data) return
    const tick = () => {
      const remaining = Math.max(0, new Date(data.expires_at).getTime() - Date.now())
      if (remaining <= 0) {
        setCountdown('Expired')
        clearInterval(timerRef.current)
        return
      }
      const h = Math.floor(remaining / 3600000)
      const m = Math.floor((remaining % 3600000) / 60000)
      const s = Math.floor((remaining % 60000) / 1000)
      setCountdown(h > 0 ? `${h}h ${m}m` : `${m}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => clearInterval(timerRef.current)
  }, [data])

  const expired = countdown === 'Expired'
  const sharedItems = data ? SCOPE_LABELS.filter((s) => data.scope?.[s.key]) : []

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #fdf2f8 0%, #eff6ff 50%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={18} fill="white" color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>Tara</span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
            Secure Patient Data Share
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, margin: '0 auto 16px',
                border: '3px solid #e5e7eb', borderTopColor: '#f43f5e',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: 14, color: '#6b7280' }}>Loading shared data...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : error ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, margin: '0 auto 16px',
                background: '#fef2f2', borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={28} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', marginBottom: 6 }}>
                Link Unavailable
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
                {error}
              </p>
            </div>
          ) : data ? (
            <>
              {/* Header */}
              <div style={{
                background: expired
                  ? 'linear-gradient(135deg, #fef2f2, #fff1f2)'
                  : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color={expired ? '#dc2626' : '#2563eb'} />
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: expired ? '#dc2626' : '#1e40af',
                  }}>
                    {expired ? 'This link has expired' : `Expires in ${countdown}`}
                  </span>
                </div>
                {!expired && (
                  <CheckCircle size={18} color="#16a34a" />
                )}
              </div>

              {/* Patient info */}
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', marginBottom: 16 }}>
                  Patient Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <InfoRow
                    icon={<User size={16} color="#6b7280" />}
                    label="Patient Reference"
                    value={data.profile_summary.patient_ref_id || 'Not available'}
                  />
                  <InfoRow
                    icon={<Activity size={16} color="#6b7280" />}
                    label="Current Stage"
                    value={data.profile_summary.current_stage || 'Not set'}
                  />
                  <InfoRow
                    icon={<MapPin size={16} color="#6b7280" />}
                    label="Hospital"
                    value={data.profile_summary.hospital_id || 'Not specified'}
                  />
                </div>

                {/* Shared data scope */}
                {sharedItems.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: 0.5, color: '#9ca3af', marginBottom: 10,
                    }}>
                      Data Categories Shared
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {sharedItems.map((s) => (
                        <div key={String(s.key)} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 12px',
                          background: '#f0fdf4', borderRadius: 8,
                        }}>
                          <s.icon size={14} color="#16a34a" />
                          <span style={{ fontSize: 13, color: '#166534', fontWeight: 500 }}>
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sharedItems.length === 0 && (
                  <div style={{
                    marginTop: 20, padding: 16, textAlign: 'center',
                    background: '#f9fafb', borderRadius: 8,
                  }}>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>
                      No specific data categories were selected for this share.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '12px 24px',
                borderTop: '1px solid #f3f4f6',
                background: '#fafafa',
              }}>
                <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 1.5 }}>
                  This data was shared voluntarily by the patient under GDPR Art. 9(2)(a).
                  The link is temporary and may be revoked at any time.
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', background: '#f9fafb', borderRadius: 10,
    }}>
      {icon}
      <div>
        <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 14, color: '#1f2937', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  )
}
