import { useState } from 'react'
import { X, Flag, AlertTriangle } from 'lucide-react'
import { reportContent } from '../../services/forumApi'
import './ReportModal.css'

interface ReportModalProps {
  targetType: 'post' | 'comment'
  targetId: string
  onClose: () => void
  onReported: () => void
}

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam or misleading' },
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'misinformation', label: 'Medical misinformation' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'other', label: 'Other' },
]

export function ReportModal({
  targetType,
  targetId,
  onClose,
  onReported,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Please select a reason')
      return
    }

    const reasonLabel = REPORT_REASONS.find(r => r.id === selectedReason)?.label || ''
    const fullReason = additionalInfo
      ? `${reasonLabel}: ${additionalInfo}`
      : reasonLabel

    if (fullReason.length < 10) {
      setError('Please provide more details about your report')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await reportContent({
        target_type: targetType,
        target_id: targetId,
        reason: fullReason,
      })
      setSubmitted(true)
      onReported()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="report-modal" onClick={e => e.stopPropagation()}>
          <div className="report-success">
            <div className="success-icon">✓</div>
            <h3>Report Submitted</h3>
            <p>Thank you for helping keep our community safe. We'll review this content shortly.</p>
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="report-title">
            <Flag size={20} className="report-icon" />
            <h2>Report {targetType === 'post' ? 'Post' : 'Comment'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="report-content">
          <div className="report-notice">
            <AlertTriangle size={16} />
            <span>Reports are reviewed by our moderation team. False reports may result in action against your account.</span>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="reason-list">
            <label className="reason-label">Why are you reporting this?</label>
            {REPORT_REASONS.map(reason => (
              <label 
                key={reason.id} 
                className={`reason-option ${selectedReason === reason.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                />
                <span>{reason.label}</span>
              </label>
            ))}
          </div>

          <div className="additional-info">
            <label htmlFor="additional">Additional details (optional)</label>
            <textarea
              id="additional"
              placeholder="Please provide any additional context..."
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="report-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!selectedReason || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

