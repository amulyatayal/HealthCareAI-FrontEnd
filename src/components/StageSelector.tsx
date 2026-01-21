import { useState, useEffect } from 'react';
import { ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { getStageTree, selectDetailedStage, type StageTreeNode, type TreatmentStage } from '../services/api';
import './StageSelector.css';

interface StageSelectorProps {
    onStageSelected: (stageId: string, stageName: string, breadcrumb: string[]) => void;
    onBack?: () => void;
    initialStageId?: string;
}

export function StageSelector({ onStageSelected, onBack }: StageSelectorProps) {
    const [stages, setStages] = useState<StageTreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPath, setSelectedPath] = useState<TreatmentStage[]>([]);
    const [currentLevel, setCurrentLevel] = useState<StageTreeNode[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Load stage tree on mount
    useEffect(() => {
        async function loadStages() {
            try {
                const response = await getStageTree();
                setStages(response.stages);
                setCurrentLevel(response.stages);
                setLoading(false);
            } catch (err) {
                setError('Failed to load treatment stages');
                setLoading(false);
            }
        }
        loadStages();
    }, []);

    const handleSelectStage = (node: StageTreeNode) => {
        const newPath = [...selectedPath, node.stage];
        setSelectedPath(newPath);

        if (node.children.length > 0) {
            // Has children - drill down
            setCurrentLevel(node.children);
        } else {
            // Leaf node - this is the final selection
            handleFinalSelection(node.stage, newPath);
        }
    };

    const handleFinalSelection = async (stage: TreatmentStage, _path: TreatmentStage[]) => {
        setSubmitting(true);
        try {
            const result = await selectDetailedStage(stage.stage_id);
            onStageSelected(stage.stage_id, stage.name, result.breadcrumb);
        } catch (err) {
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
            // Find the parent node's children
            let current = stages;
            for (const stage of newPath) {
                const found = current.find(n => n.stage.stage_id === stage.stage_id);
                if (found) {
                    current = found.children;
                }
            }
            setCurrentLevel(current);
        }
    };

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
