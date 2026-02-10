import { useState, useEffect } from 'react';
import {
    X,
    ChevronRight,
    Heart,
    Activity,
    ClipboardList,
    Stethoscope,
    Scissors,
    Pill,
    Zap,
    Radio,
    Lock,
    MapPin,
    User,
    Link as LinkIcon,
    HelpCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import './OnboardingWizard.css';
import { linkAccount, getStageTree, type StageTreeNode } from '../services/api';

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

// Icons for root stages
const STAGE_ICONS: Record<string, any> = {
    '0': Activity,
    '1': ClipboardList,
    '2': Scissors,
    '3': Zap,
    '4': Pill,
    '5': Heart,
    '6': Scissors,
    '7': Radio,
    '8': Zap,
    '9': Pill,
    '10': Pill,
};

// Map root stage IDs to situation values for backend compatibility
const STAGE_ID_TO_SITUATION: Record<string, string> = {
    '0': 'worried_about_symptoms',
    '1': 'recently_diagnosed',
    '2': 'currently_in_treatment',
    '3': 'currently_in_treatment',
    '4': 'currently_in_treatment',
    '5': 'finished_treatment',
    '6': 'currently_in_treatment',
    '7': 'currently_in_treatment',
    '8': 'currently_in_treatment',
    '9': 'long_term_followup',
    '10': 'long_term_followup',
};

export interface OnboardingData {
    current_situation: string;
    detailed_stage_id?: string;
    treatment_type?: string;
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
    const [rootStages, setRootStages] = useState<StageTreeNode[]>([]);
    const [stagesLoading, setStagesLoading] = useState(true);
    const [stagesError, setStagesError] = useState('');

    const [selectedStageId, setSelectedStageId] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [error, setError] = useState('');

    // Account linking
    const [showLinkAccount, setShowLinkAccount] = useState(false);
    const [refIdInput, setRefIdInput] = useState('');
    const [isLinking, setIsLinking] = useState(false);
    const [linkSuccess, setLinkSuccess] = useState(false);

    useEffect(() => {
        async function loadStages() {
            try {
                const response = await getStageTree();
                setRootStages(response.stages);
            } catch {
                setStagesError('Failed to load stages');
            } finally {
                setStagesLoading(false);
            }
        }
        loadStages();
    }, []);

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
            setTimeout(() => { onClose(); window.location.reload(); }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to link account.');
        } finally {
            setIsLinking(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedStageId) {
            setError('Please select where you are in your journey');
            return;
        }
        setError('');

        const situation = selectedStageId === 'prefer_not_to_say'
            ? 'prefer_not_to_say'
            : (STAGE_ID_TO_SITUATION[selectedStageId] || 'currently_in_treatment');

        try {
            await onComplete({
                current_situation: situation,
                detailed_stage_id: selectedStageId === 'prefer_not_to_say' ? undefined : selectedStageId,
                age_range: ageRange || undefined,
                postal_code: postalCode || undefined,
            });
        } catch {
            setError('Failed to save. Please try again.');
        }
    };

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
                    <p>This helps us personalise your experience. All information is private.</p>
                </div>

                <div className="onboarding-content">
                    {showLinkAccount ? (
                        <div className="link-account-view">
                            <h3 className="link-title">Link Existing Profile</h3>
                            <p className="link-desc">Enter your Patient Reference ID to restore your journey history.</p>
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
                                    <CheckCircle size={18} /> Account linked! Reloading...
                                </div>
                            )}
                            {error && <div className="onboarding-error">{error}</div>}
                            <div className="link-actions">
                                <button className="secondary-btn" onClick={() => setShowLinkAccount(false)} disabled={isLinking || linkSuccess}>Cancel</button>
                                <button className="primary-btn" onClick={handleLinkAccount} disabled={!refIdInput || isLinking || linkSuccess}>
                                    {isLinking ? 'Linking...' : 'Link Account'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Age & Area */}
                            <div className="quick-profile-row">
                                <div className="field-group compact">
                                    <label htmlFor="ageRange"><User size={14} /> Age</label>
                                    <select id="ageRange" value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                                        <option value="">Optional</option>
                                        {AGE_RANGES.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field-group compact">
                                    <label htmlFor="postalCode"><MapPin size={14} /> Area</label>
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

                            {/* Stage selection — patient-friendly labels only */}
                            <label className="onboarding-label">Where are you in your journey?</label>

                            {stagesLoading ? (
                                <div className="stages-loading">
                                    <Loader2 size={24} className="spinner-icon" />
                                    <span>Loading...</span>
                                </div>
                            ) : stagesError ? (
                                <div className="onboarding-error">{stagesError}</div>
                            ) : (
                                <div className="situation-options">
                                    {rootStages.map((node) => {
                                        const Icon = STAGE_ICONS[node.stage.stage_id] || Stethoscope;
                                        return (
                                            <button
                                                key={node.stage.stage_id}
                                                className={`situation-option ${selectedStageId === node.stage.stage_id ? 'selected' : ''}`}
                                                onClick={() => { setSelectedStageId(node.stage.stage_id); setError(''); }}
                                                type="button"
                                            >
                                                <span className="option-icon"><Icon size={20} /></span>
                                                <span className="option-label">
                                                    {node.stage.patient_facing_label || node.stage.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                    <button
                                        className={`situation-option ${selectedStageId === 'prefer_not_to_say' ? 'selected' : ''}`}
                                        onClick={() => { setSelectedStageId('prefer_not_to_say'); setError(''); }}
                                        type="button"
                                    >
                                        <span className="option-icon"><HelpCircle size={20} /></span>
                                        <span className="option-label">I'm not sure / Prefer not to say</span>
                                    </button>
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
                            Your information is private and helps us personalise your experience.
                        </p>
                        <button
                            className="onboarding-submit"
                            onClick={handleSubmit}
                            disabled={!selectedStageId || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : <><span>Continue</span> <ChevronRight size={18} /></>}
                        </button>
                        <button className="link-account-trigger" onClick={() => setShowLinkAccount(true)}>
                            <LinkIcon size={14} /> Already have a profile? Link it here
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
