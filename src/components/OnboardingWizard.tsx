import { useState } from 'react';
import {
    X,
    ChevronRight,
    Heart,
    Calendar,
    Activity, // Symptoms
    Hourglass, // Waiting
    ClipboardList, // Diagnosed
    Stethoscope, // Treatment
    CheckCircle, // Finished
    CalendarClock, // Follow-up
    Shield, // Privacy
    Lock
} from 'lucide-react';
import './OnboardingWizard.css';

// Onboarding situation options with patient-centric icons
const SITUATION_OPTIONS = [
    {
        value: 'worried_about_symptoms',
        label: "I'm worried about symptoms I've noticed",
        Icon: Activity
    },
    {
        value: 'waiting_for_results',
        label: "I'm waiting for test results",
        Icon: Hourglass
    },
    {
        value: 'recently_diagnosed',
        label: "I was recently diagnosed",
        Icon: ClipboardList
    },
    {
        value: 'currently_in_treatment',
        label: "I'm currently in treatment",
        Icon: Stethoscope
    },
    {
        value: 'finished_treatment',
        label: "I've finished my treatment",
        Icon: CheckCircle
    },
    {
        value: 'long_term_followup',
        label: "I'm in long-term follow-up care",
        Icon: CalendarClock
    },
    {
        value: 'prefer_not_to_say',
        label: "I'd prefer not to say",
        Icon: Shield
    },
];

export interface OnboardingData {
    current_situation: string;
    diagnosis_date?: string;
    diagnosis_type?: string;
    current_treatments?: string[];
    treatment_start_date?: string;
}

interface OnboardingWizardProps {
    onComplete: (data: OnboardingData) => Promise<void>;
    onClose: () => void;
    isSubmitting?: boolean;
}

export function OnboardingWizard({
    onComplete,
    onClose,
    isSubmitting = false
}: OnboardingWizardProps) {
    const [situation, setSituation] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [diagnosisDate, setDiagnosisDate] = useState('');
    const [diagnosisType, setDiagnosisType] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!situation) {
            setError('Please select an option to continue');
            return;
        }

        setError('');

        try {
            await onComplete({
                current_situation: situation,
                diagnosis_date: diagnosisDate || undefined,
                diagnosis_type: diagnosisType || undefined,
            });
        } catch (err) {
            setError('Failed to save. Please try again.');
        }
    };

    const showDetailFields = ['recently_diagnosed', 'currently_in_treatment', 'finished_treatment'].includes(situation);

    return (
        <div className="onboarding-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="onboarding-modal">
                <button className="onboarding-close" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                <div className="onboarding-header">
                    <div className="onboarding-icon">
                        <Heart size={32} className="heart-icon" />
                    </div>
                    <h2>Tell Us About Your Journey</h2>
                    <p>
                        To provide you with the most relevant support, please tell us
                        a bit about where you are in your journey.
                    </p>
                </div>

                <div className="onboarding-content">
                    <label className="onboarding-label">
                        Where are you in your healthcare journey?
                    </label>

                    <div className="situation-options">
                        {SITUATION_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                className={`situation-option ${situation === option.value ? 'selected' : ''}`}
                                onClick={() => {
                                    setSituation(option.value);
                                    setError('');
                                }}
                                type="button"
                            >
                                <span className="option-icon">
                                    <option.Icon size={20} />
                                </span>
                                <span className="option-label">{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {error && <div className="onboarding-error">{error}</div>}

                    {/* Optional details section */}
                    {showDetailFields && (
                        <div className="onboarding-details">
                            <button
                                className="details-toggle"
                                onClick={() => setShowDetails(!showDetails)}
                                type="button"
                            >
                                {showDetails ? '▼' : '▶'} Optional: Add more details
                            </button>

                            {showDetails && (
                                <div className="details-fields">
                                    <div className="field-group">
                                        <label htmlFor="diagnosisDate">
                                            <Calendar size={16} /> Diagnosis date
                                        </label>
                                        <input
                                            type="date"
                                            id="diagnosisDate"
                                            value={diagnosisDate}
                                            onChange={(e) => setDiagnosisDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="field-group">
                                        <label htmlFor="diagnosisType">
                                            <Stethoscope size={16} /> Type of diagnosis
                                        </label>
                                        <input
                                            type="text"
                                            id="diagnosisType"
                                            value={diagnosisType}
                                            onChange={(e) => setDiagnosisType(e.target.value)}
                                            placeholder="e.g., Invasive ductal carcinoma"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="onboarding-footer">
                    <p className="privacy-note">
                        <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        This information is private and helps us personalize your experience.
                    </p>
                    <button
                        className="onboarding-submit"
                        onClick={handleSubmit}
                        disabled={!situation || isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (
                            <>
                                Continue <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
