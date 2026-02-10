import { useState, useEffect } from 'react';
import { ChevronRight, Check, ArrowLeft, Heart, Lock, MapPin, User, Loader2 } from 'lucide-react';
import { getStageTree, selectDetailedStage, type StageTreeNode, type TreatmentStage } from '../services/api';
import './StageSelector.css';

// Age range options
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

interface StageSelectorProps {
    onStageSelected: (stageId: string, stageName: string, breadcrumb: string[]) => void;
    onBack?: () => void;
    initialStageId?: string;
    rootOnly?: boolean;
}

export function StageSelector({ onStageSelected, onBack, rootOnly = false }: StageSelectorProps) {
    const [stages, setStages] = useState<StageTreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPath, setSelectedPath] = useState<TreatmentStage[]>([]);
    const [currentLevel, setCurrentLevel] = useState<StageTreeNode[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // rootOnly state
    const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
    const [ageRange, setAgeRange] = useState('');
    const [postalCode, setPostalCode] = useState('');

    useEffect(() => {
        async function loadStages() {
            try {
                const response = await getStageTree();
                setStages(response.stages);
                setCurrentLevel(response.stages);
                setLoading(false);
            } catch (_err) {
                setError('Failed to load treatment stages');
                setLoading(false);
            }
        }
        loadStages();
    }, []);

    const handleSelectStage = (node: StageTreeNode) => {
        if (rootOnly) {
            setSelectedRootId(node.stage.stage_id);
            return; // Don't submit yet — wait for Save button
        }

        const newPath = [...selectedPath, node.stage];
        setSelectedPath(newPath);

        if (node.children.length > 0) {
            setCurrentLevel(node.children);
        } else {
            handleFinalSelection(node.stage, newPath);
        }
    };

    const handleSaveRootSelection = async () => {
        if (!selectedRootId) return;
        const node = stages.find(n => n.stage.stage_id === selectedRootId);
        if (!node) return;

        setSubmitting(true);
        try {
            const result = await selectDetailedStage(node.stage.stage_id);
            onStageSelected(node.stage.stage_id, node.stage.name, result.breadcrumb);
        } catch (_err) {
            setError('Failed to save. Please try again.');
            setSubmitting(false);
        }
    };

    const handleFinalSelection = async (stage: TreatmentStage, _path: TreatmentStage[]) => {
        setSubmitting(true);
        try {
            const result = await selectDetailedStage(stage.stage_id);
            onStageSelected(stage.stage_id, stage.name, result.breadcrumb);
        } catch (_err) {
            setError('Failed to save stage selection');
            setSubmitting(false);
        }
    };

    const handleSelectCurrent = async () => {
        if (selectedPath.length === 0) return;
        const lastStage = selectedPath[selectedPath.length - 1];
        await handleFinalSelection(lastStage, selectedPath);
    };

    const handleBack = () => {
        if (selectedPath.length === 0) {
            onBack?.();
            return;
        }
        const newPath = selectedPath.slice(0, -1);
        setSelectedPath(newPath);
        if (newPath.length === 0) {
            setCurrentLevel(stages);
        } else {
            let current = stages;
            for (const stage of newPath) {
                const found = current.find(n => n.stage.stage_id === stage.stage_id);
                if (found) current = found.children;
            }
            setCurrentLevel(current);
        }
    };

    // ─── rootOnly: Light-theme form ───
    if (rootOnly) {
        return (
            <div className="journey-form">
                <button className="journey-close" onClick={onBack} aria-label="Close">
                    ✕
                </button>

                <div className="journey-header">
                    <div className="journey-icon">
                        <Heart size={28} />
                    </div>
                    <h2 className="journey-title">Update Your Journey</h2>
                    <p className="journey-subtitle">Tell us where you are now so we can personalise your experience.</p>
                </div>

                <div className="journey-body">
                    {/* Age & Area row */}
                    <div className="journey-fields-row">
                        <div className="journey-field">
                            <label htmlFor="journey-age"><User size={14} /> Age</label>
                            <select
                                id="journey-age"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            >
                                <option value="">Optional</option>
                                {AGE_RANGES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="journey-field">
                            <label htmlFor="journey-area"><MapPin size={14} /> Area</label>
                            <input
                                type="text"
                                id="journey-area"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value.toUpperCase().slice(0, 4))}
                                placeholder="e.g. SW1"
                                maxLength={4}
                            />
                        </div>
                    </div>

                    {/* Stage selection */}
                    <p className="journey-question">Where are you in your journey?</p>

                    {loading ? (
                        <div className="journey-loading">
                            <Loader2 size={22} className="journey-spinner" />
                            <span>Loading stages...</span>
                        </div>
                    ) : error && stages.length === 0 ? (
                        <div className="journey-error">{error}</div>
                    ) : (
                        <div className="journey-options">
                            {stages.map((node) => {
                                const isSelected = selectedRootId === node.stage.stage_id;
                                return (
                                    <button
                                        key={node.stage.stage_id}
                                        className={`journey-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectStage(node)}
                                        disabled={submitting}
                                        type="button"
                                    >
                                        <span className={`journey-radio ${isSelected ? 'checked' : ''}`}>
                                            {isSelected && <span className="journey-radio-dot" />}
                                        </span>
                                        <span className="journey-option-label">
                                            {node.stage.patient_facing_label || node.stage.name}
                                        </span>
                                    </button>
                                );
                            })}
                            {/* Not sure option */}
                            <button
                                className={`journey-option ${selectedRootId === 'prefer_not_to_say' ? 'selected' : ''}`}
                                onClick={() => setSelectedRootId('prefer_not_to_say')}
                                disabled={submitting}
                                type="button"
                            >
                                <span className={`journey-radio ${selectedRootId === 'prefer_not_to_say' ? 'checked' : ''}`}>
                                    {selectedRootId === 'prefer_not_to_say' && <span className="journey-radio-dot" />}
                                </span>
                                <span className="journey-option-label">I'm not sure / Prefer not to say</span>
                            </button>
                        </div>
                    )}

                    {error && stages.length > 0 && (
                        <div className="journey-error">{error}</div>
                    )}
                </div>

                <div className="journey-footer">
                    <button
                        className="journey-save-btn"
                        onClick={handleSaveRootSelection}
                        disabled={!selectedRootId || submitting}
                    >
                        {submitting ? (
                            <><Loader2 size={18} className="journey-spinner" /> Saving...</>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                    <p className="journey-privacy">
                        <Lock size={13} /> Your information is private and helps personalise your experience.
                    </p>
                </div>
            </div>
        );
    }

    // ─── Drill-down mode (unchanged) ───
    if (loading) {
        return (
            <div className="stage-selector loading">
                <div className="spinner"></div>
                <p>Loading treatment stages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stage-selector error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    const breadcrumbNames = selectedPath.map(s => s.name);

    return (
        <div className="stage-selector">
            <div className="stage-header">
                <button className="back-btn" onClick={handleBack} disabled={submitting}>
                    <ArrowLeft size={20} />
                </button>
                <div className="stage-title">
                    <h3>Select Your Treatment Stage</h3>
                    {breadcrumbNames.length > 0 && (
                        <div className="breadcrumb">
                            {breadcrumbNames.join(' → ')}
                        </div>
                    )}
                </div>
            </div>

            <div className="stage-list">
                {currentLevel.map((node) => (
                    <button
                        key={node.stage.stage_id}
                        className="stage-option"
                        onClick={() => handleSelectStage(node)}
                        disabled={submitting}
                    >
                        <div className="stage-info">
                            <span className="stage-name">{node.stage.name}</span>
                            {node.stage.description && (
                                <span className="stage-desc">{node.stage.description.slice(0, 100)}{node.stage.description.length > 100 ? '...' : ''}</span>
                            )}
                        </div>
                        {node.children.length > 0 ? (
                            <ChevronRight size={20} className="stage-arrow" />
                        ) : (
                            <Check size={20} className="stage-check" />
                        )}
                    </button>
                ))}
            </div>

            {selectedPath.length > 0 && currentLevel.some(n => n.children.length > 0) && (
                <div className="stage-actions">
                    <p className="hint">Select a sub-stage above, or:</p>
                    <button
                        className="select-current-btn"
                        onClick={handleSelectCurrent}
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : `Use "${selectedPath[selectedPath.length - 1].name}"`}
                    </button>
                </div>
            )}
        </div>
    );
}
