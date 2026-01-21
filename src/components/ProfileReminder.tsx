import { X, UserPlus } from 'lucide-react';
import './ProfileReminder.css';

interface ProfileReminderProps {
    onComplete: () => void;
    onDismiss: () => void;
}

export function ProfileReminder({ onComplete, onDismiss }: ProfileReminderProps) {
    return (
        <div className="profile-reminder">
            <div className="reminder-content">
                <UserPlus size={20} className="reminder-icon" />
                <div className="reminder-text">
                    <strong>Complete your profile</strong>
                    <span>Get more personalized responses tailored to your journey</span>
                </div>
            </div>
            <div className="reminder-actions">
                <button className="reminder-complete" onClick={onComplete}>
                    Complete now
                </button>
                <button className="reminder-dismiss" onClick={onDismiss} aria-label="Dismiss">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
