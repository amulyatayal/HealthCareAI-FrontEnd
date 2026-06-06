import { useState, useEffect } from 'react'
import { Plus, Copy, Check, Trash2, KeyRound, AlertCircle } from 'lucide-react'
import { getAccessCodes, createAccessCode, deleteAccessCode } from '../../services/adminApi'
import type { AccessCode } from '../../types/admin'

const HOSPITALS = [
  { value: 'barts', label: 'Barts Health NHS Trust' },
  { value: 'futuredreams', label: 'FutureDreams' },
  { value: 'uhnm', label: 'University Hospitals of North Midlands NHS Trust (UHNM)' },
  { value: 'apollo', label: 'Apollo Hospitals' },
  { value: 'uclh', label: 'University College London Hospitals' },
  { value: 'guys', label: "Guy's and St Thomas' NHS Trust" },
  { value: 'imperial', label: 'Imperial College Healthcare' },
  { value: 'kings', label: "King's College Hospital" },
]

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

export function AdminAccessCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedHospital, setSelectedHospital] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null)

  useEffect(() => {
    loadCodes()
  }, [])

  async function loadCodes() {
    setLoading(true)
    setError('')
    try {
      const data = await getAccessCodes()
      setCodes(data.codes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access codes')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!selectedHospital) return
    setCreating(true)
    setError('')
    try {
      const newCode = await createAccessCode(selectedHospital)
      setCodes((prev) => [newCode, ...prev])
      setSelectedHospital('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create access code')
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(code: string) {
    setError('')
    try {
      await deleteAccessCode(code)
      setCodes((prev) => prev.filter((c) => c.access_code !== code))
      setConfirmRevoke(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke access code')
    }
  }

  function copyToClipboard(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }

  const activeCodes = codes.filter((c) => c.is_active)
  const revokedCodes = codes.filter((c) => !c.is_active)

  return (
    <>
      <div className="admin-page-header">
        <h1>Access Codes</h1>
        <p>Generate and manage codes that patients use to connect with your team.</p>
      </div>

      {error && (
        <div className="admin-ac-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="admin-ac-create">
        <h3>Generate New Code</h3>
        <div className="admin-ac-create-form">
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="admin-ac-select"
          >
            <option value="" disabled>Select hospital...</option>
            {HOSPITALS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
          <button
            className="admin-ac-btn-create"
            onClick={handleCreate}
            disabled={!selectedHospital || creating}
          >
            <Plus size={16} />
            {creating ? 'Generating...' : 'Generate Code'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-ac-loading">Loading access codes...</div>
      ) : codes.length === 0 ? (
        <div className="admin-ac-empty">
          <KeyRound size={40} strokeWidth={1.2} />
          <h3>No access codes yet</h3>
          <p>Generate a code above to share with your patients.</p>
        </div>
      ) : (
        <>
          {activeCodes.length > 0 && (
            <div className="admin-ac-section">
              <h3>Active Codes ({activeCodes.length})</h3>
              <div className="admin-ac-table">
                <div className="admin-ac-thead">
                  <span>Code</span>
                  <span>Hospital</span>
                  <span>Created</span>
                  <span>Actions</span>
                </div>
                {activeCodes.map((c) => (
                  <div key={c.access_code} className="admin-ac-row">
                    <span className="admin-ac-code-cell">
                      <code>{c.access_code}</code>
                      <button
                        className="admin-ac-copy"
                        onClick={() => copyToClipboard(c.access_code)}
                        title="Copy to clipboard"
                      >
                        {copiedCode === c.access_code
                          ? <Check size={14} />
                          : <Copy size={14} />}
                      </button>
                    </span>
                    <span>{HOSPITALS.find((h) => h.value === c.hospital_id)?.label || c.hospital_id}</span>
                    <span>{formatDate(c.created_at)}</span>
                    <span>
                      {confirmRevoke === c.access_code ? (
                        <span className="admin-ac-confirm">
                          <span>Revoke?</span>
                          <button className="admin-ac-btn-yes" onClick={() => handleRevoke(c.access_code)}>Yes</button>
                          <button className="admin-ac-btn-no" onClick={() => setConfirmRevoke(null)}>No</button>
                        </span>
                      ) : (
                        <button
                          className="admin-ac-btn-revoke"
                          onClick={() => setConfirmRevoke(c.access_code)}
                        >
                          <Trash2 size={14} />
                          Revoke
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {revokedCodes.length > 0 && (
            <div className="admin-ac-section">
              <h3>Revoked Codes ({revokedCodes.length})</h3>
              <div className="admin-ac-table revoked">
                <div className="admin-ac-thead">
                  <span>Code</span>
                  <span>Hospital</span>
                  <span>Created</span>
                  <span>Status</span>
                </div>
                {revokedCodes.map((c) => (
                  <div key={c.access_code} className="admin-ac-row">
                    <span className="admin-ac-code-cell">
                      <code>{c.access_code}</code>
                    </span>
                    <span>{HOSPITALS.find((h) => h.value === c.hospital_id)?.label || c.hospital_id}</span>
                    <span>{formatDate(c.created_at)}</span>
                    <span className="admin-ac-revoked-badge">Revoked</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
