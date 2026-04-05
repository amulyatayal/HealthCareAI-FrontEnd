import { useState, useEffect } from 'react'
import { Share2, ExternalLink, RefreshCw, AlertCircle, Eye } from 'lucide-react'
import { getPatientShares } from '../../services/adminApi'
import type { PatientShareEntry } from '../../services/adminApi'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

function deriveStatus(item: PatientShareEntry): 'active' | 'expired' | 'revoked' {
  if (item.revoked_at) return 'revoked'
  if (new Date(item.expires_at).getTime() < Date.now()) return 'expired'
  return 'active'
}

function scopeLabels(scope: Record<string, boolean>): string {
  const map: Record<string, string> = {
    mood: 'Mood',
    pathway: 'Pathway',
    symptoms: 'Symptoms',
    documents_summary: 'Documents',
  }
  return Object.entries(scope)
    .filter(([, v]) => v)
    .map(([k]) => map[k] || k)
    .join(', ') || 'None specified'
}

export function AdminSharedDataPage() {
  const [shares, setShares] = useState<PatientShareEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { loadShares() }, [])

  async function loadShares() {
    setLoading(true)
    setError('')
    try {
      const data = await getPatientShares()
      setShares(data.shares)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient shares')
    } finally {
      setLoading(false)
    }
  }

  function handleView(item: PatientShareEntry) {
    if (item.token) {
      window.open(`/share/view/${encodeURIComponent(item.token)}`, '_blank')
    }
  }

  const activeShares = shares.filter((s) => deriveStatus(s) === 'active')
  const pastShares = shares.filter((s) => deriveStatus(s) !== 'active')

  return (
    <>
      <div className="admin-page-header">
        <h1>Shared Patient Data</h1>
        <p>View data that patients have shared with your clinical team via secure share links.</p>
      </div>

      {error && (
        <div className="admin-ac-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          className="admin-ac-btn-create"
          onClick={loadShares}
          disabled={loading}
          style={{ gap: 6 }}
        >
          <RefreshCw size={14} className={loading ? 'admin-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="admin-ac-loading">Loading shared data...</div>
      ) : shares.length === 0 ? (
        <div className="admin-ac-empty">
          <Share2 size={40} strokeWidth={1.2} />
          <h3>No shared data yet</h3>
          <p>When patients create share links, their shared data will appear here.</p>
        </div>
      ) : (
        <>
          {activeShares.length > 0 && (
            <div className="admin-ac-section">
              <h3>Active Shares ({activeShares.length})</h3>
              <div className="admin-sd-table">
                <div className="admin-sd-thead">
                  <span>Patient</span>
                  <span>Shared On</span>
                  <span>Data Scope</span>
                  <span>Expires</span>
                  <span>Actions</span>
                </div>
                {activeShares.map((s) => (
                  <div key={s.share_id} className="admin-sd-row">
                    <span className="admin-sd-patient">{s.patient_ref_id}</span>
                    <span>{formatDate(s.created_at)}</span>
                    <span className="admin-sd-scope">{scopeLabels(s.scope)}</span>
                    <span>{formatDate(s.expires_at)}</span>
                    <span>
                      {s.token ? (
                        <button className="admin-sd-btn-view" onClick={() => handleView(s)}>
                          <ExternalLink size={13} />
                          View
                        </button>
                      ) : (
                        <span className="admin-sd-no-token">
                          <Eye size={13} />
                          Summary only
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastShares.length > 0 && (
            <div className="admin-ac-section">
              <h3>Past Shares ({pastShares.length})</h3>
              <div className="admin-sd-table past">
                <div className="admin-sd-thead">
                  <span>Patient</span>
                  <span>Shared On</span>
                  <span>Data Scope</span>
                  <span>Status</span>
                </div>
                {pastShares.map((s) => {
                  const status = deriveStatus(s)
                  return (
                    <div key={s.share_id} className="admin-sd-row">
                      <span className="admin-sd-patient">{s.patient_ref_id}</span>
                      <span>{formatDate(s.created_at)}</span>
                      <span className="admin-sd-scope">{scopeLabels(s.scope)}</span>
                      <span>
                        <span className={`admin-sd-status admin-sd-status--${status}`}>
                          {status}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
