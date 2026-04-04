import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Image, Download, Trash2, Shield, Plus, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

interface DocItem {
  id: number | string
  name: string
  type: string
  date: string
  size: string
}

const defaultDocs: DocItem[] = [
  { id: 1, name: 'Blood Test Results - Jan 2024', type: 'pdf', date: 'Jan 15, 2024', size: '245 KB' },
  { id: 2, name: 'MRI Scan Report', type: 'pdf', date: 'Jan 10, 2024', size: '1.2 MB' },
  { id: 3, name: 'Prescription - Tamoxifen', type: 'pdf', date: 'Jan 8, 2024', size: '89 KB' },
  { id: 4, name: 'Insurance Claim Form', type: 'pdf', date: 'Jan 5, 2024', size: '156 KB' },
  { id: 5, name: 'Treatment Plan Summary', type: 'pdf', date: 'Dec 28, 2023', size: '312 KB' },
]

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentsPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [docList, setDocList] = useState<DocItem[]>(defaultDocs)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [storageBytesUsed, setStorageBytesUsed] = useState(0)
  const [storageLimitBytes, setStorageLimitBytes] = useState(100 * 1024 * 1024)
  const [maxFileSizeBytes, setMaxFileSizeBytes] = useState(DEFAULT_MAX_FILE_SIZE)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { getDocuments } = await import('../../services/api')
        const data = await getDocuments()
        if (!cancelled) {
          if (data.documents.length > 0) {
            setDocList(data.documents.map((d, i) => ({
              id: d.id || i + 100,
              name: d.name,
              type: d.type as string,
              date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              size: d.size,
            })))
          }
          if (data.total_size_bytes !== undefined) setStorageBytesUsed(data.total_size_bytes)
          if (data.storage_limit_bytes !== undefined) setStorageLimitBytes(data.storage_limit_bytes)
          if (data.max_file_size_bytes !== undefined) setMaxFileSizeBytes(data.max_file_size_bytes)
        }
      } catch {
        // API not available
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const maxFileSizeMB = Math.round(maxFileSizeBytes / (1024 * 1024))

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Invalid file type "${file.type}". Accepted: PDF, JPG, PNG.`
    }
    if (file.size > maxFileSizeBytes) {
      return `File too large (${formatSize(file.size)}). Maximum size is ${maxFileSizeMB} MB.`
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    setUploadError(null)
    setUploadSuccess(false)
    const err = validateFile(file)
    if (err) {
      setUploadError(err)
      return
    }
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadError(null)
    try {
      const { uploadDocument } = await import('../../services/api')
      const result = await uploadDocument(selectedFile)
      setDocList((prev) => [{
        id: result.id,
        name: result.name,
        type: result.type,
        date: new Date(result.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: result.size,
      }, ...prev])
      setUploadSuccess(true)
      setSelectedFile(null)
      setTimeout(() => { setUploadSuccess(false); setShowUpload(false) }, 2000)
    } catch (err: unknown) {
      const apiErr = err as { status?: number; message?: string }
      if (apiErr.status === 413) {
        setUploadError(`File too large (max ${maxFileSizeMB} MB). Please choose a smaller file.`)
      } else if (apiErr.status === 422) {
        setUploadError(apiErr.message || 'Invalid file type or virus detected.')
      } else if (apiErr.status === 409) {
        setUploadError('Storage limit reached. Please delete some documents to free up space.')
      } else {
        // API not available — add locally for demo
        setDocList((prev) => [{
          id: `local_${Date.now()}`,
          name: selectedFile.name,
          type: selectedFile.type.includes('pdf') ? 'pdf' : selectedFile.type.includes('png') ? 'png' : 'jpg',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: formatSize(selectedFile.size),
        }, ...prev])
        setUploadSuccess(true)
        setSelectedFile(null)
        setTimeout(() => { setUploadSuccess(false); setShowUpload(false) }, 2000)
      }
    }
    setUploading(false)
  }

  const handleDownloadDoc = async (docId: number | string) => {
    try {
      const { downloadDocument } = await import('../../services/api')
      await downloadDocument(String(docId))
    } catch {
      // API not available — nothing to download locally
    }
  }

  const handleDeleteDoc = async (docId: number | string) => {
    try {
      const { deleteDocument } = await import('../../services/api')
      await deleteDocument(String(docId))
    } catch {
      // API not available
    }
    setDocList((prev) => prev.filter((d) => d.id !== docId))
  }

  const totalSize = storageBytesUsed / (1024 * 1024)

  return (
    <WireframeLayout title="My Documents" showBack>
      {/* Privacy Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 16px',
          background: '#dbeafe',
          borderRadius: '12px',
          marginBottom: '16px'
        }}
      >
        <Shield size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontSize: '13px', color: '#1e40af', fontWeight: '500', marginBottom: '2px' }}>
            Your documents are encrypted
          </p>
          <p style={{ fontSize: '12px', color: '#3b82f6' }}>
            All uploads are encrypted at rest (AES-256) and in transit (TLS 1.2+). You control what you upload and delete.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {showUpload ? (
        <WireframeCard style={{ marginBottom: 16 }}>
          {/* Drop zone */}
          <div
            className="wf-upload-area"
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              cursor: 'pointer',
              border: dragOver ? '2px dashed var(--wf-rose-500)' : '2px dashed var(--wf-gray-200)',
              background: dragOver ? '#fff1f2' : undefined,
              transition: 'all 0.2s',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
                e.target.value = ''
              }}
            />
            <Upload size={48} className="wf-upload-icon" />
            <p style={{ fontSize: '15px', color: 'var(--wf-gray-700)', marginBottom: '4px' }}>
              Tap to upload or drag files here
            </p>
            <p style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>
              PDF, JPG, PNG up to {maxFileSizeMB}MB
            </p>
          </div>

          {/* Selected file */}
          {selectedFile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: '#f9fafb',
              borderRadius: 8,
              marginTop: 10,
            }}>
              <FileText size={18} style={{ color: 'var(--wf-rose-500)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--wf-gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFile.name}
                </p>
                <p style={{ fontSize: 11, color: 'var(--wf-gray-500)' }}>{formatSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wf-gray-400)' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              background: '#fef2f2',
              borderRadius: 8,
              marginTop: 10,
              fontSize: 13,
              color: '#dc2626',
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              {uploadError}
            </div>
          )}

          {/* Upload success */}
          {uploadSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              background: '#dcfce7',
              borderRadius: 8,
              marginTop: 10,
              fontSize: 13,
              color: '#16a34a',
            }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              Document uploaded successfully!
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              className="wf-btn wf-btn-secondary"
              style={{ flex: 1 }}
              onClick={() => { setShowUpload(false); setSelectedFile(null); setUploadError(null) }}
            >
              Cancel
            </button>
            <button
              className="wf-btn wf-btn-primary"
              style={{ flex: 1 }}
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              <Upload size={18} />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </WireframeCard>
      ) : (
        <button
          className="wf-btn wf-btn-outline wf-btn-full"
          style={{ marginBottom: '16px' }}
          onClick={() => setShowUpload(true)}
        >
          <Plus size={18} />
          Upload New Document
        </button>
      )}

      {/* Document Stats */}
      <div className="wf-grid-2" style={{ marginBottom: '16px' }}>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '28px' }}>{docList.length}</div>
          <div className="wf-stat-label">Documents</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '28px' }}>{totalSize.toFixed(1)}</div>
          <div className="wf-stat-label">MB Used</div>
        </WireframeCard>
      </div>

      {/* Document List */}
      <div className="wf-section-header">
        <span className="wf-section-title">Recent Documents</span>
      </div>

      {docList.length === 0 ? (
        <WireframeCard>
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--wf-gray-500)' }}>
            <FileText size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <p style={{ fontSize: 14 }}>No documents uploaded yet.</p>
          </div>
        </WireframeCard>
      ) : (
        docList.map((doc) => (
          <WireframeCard key={doc.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: doc.type === 'pdf' ? '#fee2e2' : '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: doc.type === 'pdf' ? '#dc2626' : '#2563eb'
                }}
              >
                {doc.type === 'pdf' ? <FileText size={22} /> : <Image size={22} />}
              </div>

              <div className="wf-list-content">
                <div className="wf-list-title">{doc.name}</div>
                <div className="wf-list-subtitle">{doc.date} • {doc.size}</div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="wf-icon-btn" onClick={() => handleDownloadDoc(doc.id)}>
                  <Download size={18} />
                </button>
                <button className="wf-icon-btn" style={{ color: '#dc2626' }} onClick={() => handleDeleteDoc(doc.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </WireframeCard>
        ))
      )}

      {/* Storage info */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--wf-gray-600)' }}>Storage Used</span>
          <span style={{ fontSize: '13px', color: 'var(--wf-gray-600)' }}>{totalSize.toFixed(1)} MB / {(storageLimitBytes / (1024 * 1024)).toFixed(0)} MB</span>
        </div>
        <div className="wf-progress">
          <div className="wf-progress-bar" style={{ width: `${(storageBytesUsed / storageLimitBytes) * 100}%` }} />
        </div>
      </div>
    </WireframeLayout>
  )
}
