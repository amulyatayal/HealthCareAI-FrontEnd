
import { useState } from 'react';
import { Check, X, ArrowRight, AlertCircle } from 'lucide-react';
import { selectDetailedStage } from '../services/api';
import type { ModificationProposal } from '../types';
import './ProposalCard.css';

interface ProposalCardProps {
    proposal: ModificationProposal;
    onAction?: (accepted: boolean) => void;
}

export function ProposalCard({ proposal, onAction }: ProposalCardProps) {
    const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            await selectDetailedStage(proposal.stage_id);
            setStatus('accepted');
            onAction?.(true);
        } catch (err) {
            setError('Failed to update stage');
            setIsSubmitting(false);
        }
    };

    const handleReject = () => {
        setStatus('rejected');
        onAction?.(false);
    };

    if (status === 'rejected') {
        return null; // Or show a small "Suggestion dismissed" text
    }

    if (status === 'accepted') {
        return (
            <div className="proposal-card accepted">
                <div className="proposal-content">
                    <div className="proposal-icon success">
                        <Check size={20} />
                    </div>
                    <div className="proposal-text">
                        <strong>Pathway Updated</strong>
                        <p>You are now in {proposal.stage_name}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="proposal-card">
            <div className="proposal-header">
                <strong>Update Pathway?</strong>
                <span className="confidence-badge">
                    {(proposal.confidence * 100).toFixed(0)}% Match
                </span>
            </div>

            <div className="proposal-body">
                <p>{proposal.message}</p>
                <div className="proposal-stage-info">
                    <span className="label">Detected Stage:</span>
                    <span className="value">{proposal.stage_name}</span>
                </div>
            </div>

            {error && (
                <div className="proposal-error">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}

            <div className="proposal-actions">
                <button
                    className="proposal-btn reject"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    title="Do not update stage information"
                >
                    <X size={16} />
                    <span>Ignore</span>
                </button>
                <button
                    className="proposal-btn accept"
                    onClick={handleAccept}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="spinner-small" />
                    ) : (
                        <Check size={16} />
                    )}
                    <span>Yes, Update Stage</span>
                </button>
            </div>
        </div>
    );
}
