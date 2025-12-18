import { X, FileText } from 'lucide-react'
import type { Source } from '../types'
import './SourceModal.css'

interface SourceModalProps {
  source: Source
  onClose: () => void
}

export function SourceModal({ source, onClose }: SourceModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-row">
            <FileText size={20} />
            <h3 className="modal-title">{source.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {source.source_text ? (
            <div className="source-full-text">
              {source.source_text.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : source.snippet ? (
            <div className="source-snippet">
              <p>{source.snippet}</p>
            </div>
          ) : (
            <p className="no-content">No additional content available for this source.</p>
          )}
        </div>

        {source.url && (
          <div className="modal-footer">
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Original Source
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

