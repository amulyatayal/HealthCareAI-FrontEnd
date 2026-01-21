import { useState } from 'react';
import {
    X,
    ChevronRight,
    Heart,
    Activity,
    Hourglass,
    ClipboardList,
    Stethoscope,
    CheckCircle,
    CalendarClock,
    Shield,
    Lock,
    MapPin,
    User,
    Scissors,
    Pill,
    Zap,
    Radio,
    Link as LinkIcon,
    ListTree
} from 'lucide-react';
import './OnboardingWizard.css';
import { linkAccount } from '../services/api';

// Age range options (GDPR compliant)
const AGE_RANGES = [
    { value: 'under_30', label: 'Under 30' },
    { value: '30-39', label: '30-39' },
    { value: '40-49', label: '40-49' },
    { value: '50-59', label: '50-59' },
    { value: '60-69', label: '60-69' },
    { value: '70-79', label: '70-79' },
    { value: '80+', label: '80+' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

// Main situation options
const SITUATION_OPTIONS = [
    {
        value: 'worried_about_symptoms',
        label: "I'm worried about symptoms I've noticed",
        Icon: Activity,
        hasFollowUp: false
    },
    {
        value: 'waiting_for_results',
        label: "I'm waiting for test results",
        Icon: Hourglass,
        hasFollowUp: false
    },
    {
        value: 'recently_diagnosed',
        label: "I was recently diagnosed",
        Icon: ClipboardList,
        hasFollowUp: false
    },
    {
        value: 'currently_in_treatment',
        label: "I'm currently in treatment",
        Icon: Stethoscope,
        hasFollowUp: true
    },
    {
        value: 'finished_treatment',
        label: "I've finished my treatment",
        Icon: CheckCircle,
        hasFollowUp: true
    },
    {
        value: 'long_term_followup',
        label: "I'm in long-term follow-up care",
        Icon: CalendarClock,
        hasFollowUp: true
    },
    {
        value: 'prefer_not_to_say',
        label: "I'd prefer not to say",
        Icon: Shield,
        hasFollowUp: false
    },
];

// Patient-friendly treatment type options (maps to detailed stages internally)
const TREATMENT_FOLLOWUP_OPTIONS = [
    {
        value: 'surgery',
        label: "Having surgery or recovering from surgery",
        Icon: Scissors,
        stageMapping: '2'  // Maps to Surgery stage
    },
    {
        value: 'hormone_therapy',
        label: "Taking hormone therapy (tablets)",
        Icon: Pill,
        stageMapping: '3'  // Maps to Systemic Therapy
    },
    {
        value: 'chemotherapy',
        label: "Having chemotherapy",
        Icon: Zap,
        stageMapping: '3.2'  // Maps to Chemotherapy
    },
    {
        value: 'radiotherapy',
        label: "Having radiotherapy",
        Icon: Radio,
        stageMapping: '4'  // Maps to Radiotherapy
    },
    {
        value: 'multiple_treatments',
        label: "Doing more than one of these",
        Icon: Stethoscope,
        stageMapping: '3'  // General treatment
    },
    {
        value: 'not_sure',
        label: "Not sure / Prefer not to say",
        Icon: Shield,
        stageMapping: null
    },
];

export interface OnboardingData {
    current_situation: string;
    treatment_type?: string;
    // detailed_stage_id removed
    age_range?: string;
    postal_code?: string;
    diagnosis_date?: string;
    diagnosis_type?: string;
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
    const [treatmentType, setTreatmentType] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [error, setError] = useState('');

    // Detailed Stage Selection removed

    // Account Linking State
    const [showLinkAccount, setShowLinkAccount] = useState(false);
    const [refIdInput, setRefIdInput] = useState('');
    const [isLinking, setIsLinking] = useState(false);
    const [linkSuccess, setLinkSuccess] = useState(false);

    const handleLinkAccount = async () => {
        if (!refIdInput.trim()) {
            setError('Please enter a valid Reference ID');
            return;
        }

        setIsLinking(true);
        setError('');

        try {
            await linkAccount(refIdInput.trim());
            setLinkSuccess(true);
            setTimeout(() => {
                onClose(); // Close modal on success
                // Force reload to refresh profile data would be ideal, but for now we close
                window.location.reload();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to link account. Please check the ID.');
        } finally {
            setIsLinking(false);
        }
    };

    const handleSituationSelect = (value: string, hasFollowUp: boolean) => {
        setSituation(value);
        setError('');
        if (hasFollowUp) {
            setShowFollowUp(true);
        } else {
            setShowFollowUp(false);
            setTreatmentType('');
        }
    };



    const handleSubmit = async () => {
        if (!situation) {
            setError('Please select where you are in your journey');
            return;
        }

        setError('');

        // If user selected a simple option, map it.
        let finalStageId: string | undefined = undefined;

        if (treatmentType) {
            const option = TREATMENT_FOLLOWUP_OPTIONS.find(o => o.value === treatmentType);
            if (option?.stageMapping) {
                finalStageId = option.stageMapping;
            }
        }

        const data: OnboardingData = {
            current_situation: situation,
            treatment_type: treatmentType,
            detailed_stage_id: finalStageId,
            age_range: ageRange || undefined,
            postal_code: postalCode || undefined
        };

        try {
            await onComplete(data);
        } catch (err) {
            setError('Failed to save. Please try again.');
        }
    };

    const canSubmit = situation && (!showFollowUp || treatmentType);

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
                    <h2>Welcome! Tell Us About You</h2>
                    <p>
                        This helps us personalize your experience. All information is private.
                    </p>
                </div>

                <div className="onboarding-content">
                    {showLinkAccount ? (
                        <div className="link-account-view">
                            <h3 className="link-title">Link Existing Profile</h3>
                            <p className="link-desc">
                                Enter your Patient Reference ID from your previous account to restore your journey history.
                            </p>

                            <div className="field-group">
                                <label htmlFor="refId">Patient Reference ID</label>
                                <input
                                    id="refId"
                                    type="text"
                                    value={refIdInput}
                                    onChange={(e) => setRefIdInput(e.target.value.toUpperCase())}
                                    placeholder="e.g. PAT-XK7M92"
                                    maxLength={12}
                                    disabled={isLinking || linkSuccess}
                                />
                            </div>

                            {linkSuccess && (
                                <div className="link-success">
                                    <CheckCircle size={18} /> Account linked successfully! Reloading...
                                </div>
                            )}

                            {error && <div className="onboarding-error">{error}</div>}

                            <div className="link-actions">
                                <button
                                    className="secondary-btn"
                                    onClick={() => setShowLinkAccount(false)}
                                    disabled={isLinking || linkSuccess}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="primary-btn"
                                    onClick={handleLinkAccount}
                                    disabled={!refIdInput || isLinking || linkSuccess}
                                >
                                    {isLinking ? 'Linking...' : 'Link Account'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Quick Profile Fields - Upfront */}
                            <div className="quick-profile-row">
                                <div className="field-group compact">
                                    <label htmlFor="ageRange">
                                        <User size={14} /> Age
                                    </label>
                                    <select
                                        id="ageRange"
                                        value={ageRange}
                                        onChange={(e) => setAgeRange(e.target.value)}
                                    >
                                        <option value="">Optional</option>
                                        {AGE_RANGES.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group compact">
                                    <label htmlFor="postalCode">
                                        <MapPin size={14} /> Area
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value.toUpperCase().slice(0, 4))}
                                        placeholder="e.g. SW1"
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            {/* Main Question */}
                            <label className="onboarding-label">
                                Where are you in your journey?
                            </label>

                            <div className="situation-options">
                                {SITUATION_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        className={`situation-option ${situation === option.value ? 'selected' : ''}`}
                                        onClick={() => handleSituationSelect(option.value, option.hasFollowUp)}
                                        type="button"
                                    >
                                        <span className="option-icon">
                                            <option.Icon size={20} />
                                        </span>
                                        <span className="option-label">{option.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Follow-up for treatment */}
                            {showFollowUp && (
                                <div className="followup-section">
                                    <label className="onboarding-label followup-label">
                                        What type of treatment? (optional)
                                    </label>

                                    <div className="treatment-options">
                                        {TREATMENT_FOLLOWUP_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                className={`treatment-option ${treatmentType === option.value ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setTreatmentType(option.value);
                                                }}
                                                type="button"
                                            >
                                                <span className="option-icon">
                                                    <option.Icon size={18} />
                                                </span>
                                                <span className="option-label">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && <div className="onboarding-error">{error}</div>}
                        </>
                    )}
                </div>

                {!showLinkAccount && (
                    <div className="onboarding-footer">
                        <p className="privacy-note">
                            <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                            Your information is private and helps us personalize your experience.
                        </p>

                        <button
                            className="onboarding-submit"
                            onClick={handleSubmit}
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : (
                                <>
                                    Continue <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                        <button
                            className="link-account-trigger"
                            onClick={() => setShowLinkAccount(true)}
                        >
                            <LinkIcon size={14} /> Already have a profile? Link it here
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
