import { useState } from 'react'
import { Upload, FileText, Image, Download, Trash2, Shield, Plus } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const documents = [
  { id: 1, name: 'Blood Test Results - Jan 2024', type: 'pdf', date: 'Jan 15, 2024', size: '245 KB' },
  { id: 2, name: 'MRI Scan Report', type: 'pdf', date: 'Jan 10, 2024', size: '1.2 MB' },
  { id: 3, name: 'Prescription - Tamoxifen', type: 'pdf', date: 'Jan 8, 2024', size: '89 KB' },
  { id: 4, name: 'Insurance Claim Form', type: 'pdf', date: 'Jan 5, 2024', size: '156 KB' },
  { id: 5, name: 'Treatment Plan Summary', type: 'pdf', date: 'Dec 28, 2023', size: '312 KB' },
]

export function DocumentsPage() {
  const [showUpload, setShowUpload] = useState(false)

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
            All uploads are anonymized and stored securely
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {showUpload ? (
        <WireframeCard>
          <div className="wf-upload-area">
            <Upload size={48} className="wf-upload-icon" />
            <p style={{ fontSize: '15px', color: 'var(--wf-gray-700)', marginBottom: '4px' }}>
              Tap to upload or drag files here
            </p>
            <p style={{ fontSize: '13px', color: 'var(--wf-gray-500)' }}>
              PDF, JPG, PNG up to 10MB
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => setShowUpload(false)}>
              Cancel
            </button>
            <button className="wf-btn wf-btn-primary" style={{ flex: 1 }}>
              <Upload size={18} />
              Upload
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
          <div className="wf-stat-value" style={{ fontSize: '28px' }}>{documents.length}</div>
          <div className="wf-stat-label">Documents</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '28px' }}>2.1</div>
          <div className="wf-stat-label">MB Used</div>
        </WireframeCard>
      </div>

      {/* Document List */}
      <div className="wf-section-header">
        <span className="wf-section-title">Recent Documents</span>
      </div>

      {documents.map((doc) => (
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
              <button className="wf-icon-btn">
                <Download size={18} />
              </button>
              <button className="wf-icon-btn" style={{ color: '#dc2626' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </WireframeCard>
      ))}

      {/* Storage info */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--wf-gray-600)' }}>Storage Used</span>
          <span style={{ fontSize: '13px', color: 'var(--wf-gray-600)' }}>2.1 MB / 100 MB</span>
        </div>
        <div className="wf-progress">
          <div className="wf-progress-bar" style={{ width: '2.1%' }} />
        </div>
      </div>
    </WireframeLayout>
  )
}
