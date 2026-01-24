import { X, FileText, Youtube, ExternalLink } from 'lucide-react'
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

  const isVideo = source.timestamped_url || source.video_id
  const videoUrl = source.timestamped_url || source.video_url

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-row">
            {isVideo ? <Youtube size={20} color="#FF0000" /> : <FileText size={20} />}
            <h3 className="modal-title">{source.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Video metadata */}
          {isVideo && (
            <div className="source-video-info">
              {source.channel && (
                <div className="source-info-row">
                  <span className="source-info-label">Channel:</span>
                  <span className="source-info-value">{source.channel}</span>
                </div>
              )}
              {source.start_timestamp && (
                <div className="source-info-row">
                  <span className="source-info-label">Timestamp:</span>
                  <span className="source-info-value">{source.start_timestamp}</span>
                </div>
              )}
            </div>
          )}

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

        {(videoUrl || source.url) && (
          <div className="modal-footer">
            {isVideo && videoUrl ? (
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-youtube"
              >
                <Youtube size={18} />
                Watch on YouTube
                {source.start_timestamp && ` (at ${source.start_timestamp})`}
              </a>
            ) : (
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={18} />
                View Original Source
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

