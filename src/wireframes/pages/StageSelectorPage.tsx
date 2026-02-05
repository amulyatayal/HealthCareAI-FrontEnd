import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import stageHierarchyData from '../data/stage_hierarchy.json'
import { WireframeLayout } from '../WireframeLayout'
import type { StageHierarchyData as StageHierarchyType, StageRecord } from '../data/stageHierarchyTypes'

const hierarchy = stageHierarchyData as StageHierarchyType

function getStage(id: string): StageRecord | undefined {
  return hierarchy.stages[id]
}

function getPatientFacingChildren(stageId: string): StageRecord[] {
  const stage = getStage(stageId)
  if (!stage?.child_stage_ids?.length) return []
  return stage.child_stage_ids
    .map((id) => getStage(id))
    .filter((s): s is StageRecord => Boolean(s && s.is_patient_facing))
}

function getRootStages(): StageRecord[] {
  return hierarchy.root_stage_ids
    .map((id) => getStage(id))
    .filter((s): s is StageRecord => Boolean(s && s.is_patient_facing))
}

export function StageSelectorPage() {
  const navigate = useNavigate()
  const [path, setPath] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const rootStages = getRootStages()
  const isRootStep = path.length === 0
  const currentOptions = isRootStep
    ? rootStages
    : getPatientFacingChildren(path[path.length - 1])

  const handleSelect = (stageId: string) => {
    const stage = getStage(stageId)
    if (!stage) return
    const newPath = [...path, stageId]
    setPath(newPath)
    const children = getPatientFacingChildren(stageId)
    if (children.length === 0) setDone(true)
  }

  const handleSkip = () => {
    setDone(true)
  }

  const handleChangeSelection = () => {
    setDone(false)
  }

  const handleSave = () => {
    // In a real app: persist path (e.g. API call), then navigate
    navigate('/demo/profile')
  }

  const handleDontKnowYet = () => {
    // Leave without saving; go back to profile
    navigate('/demo/profile')
  }

  if (done) {
    const pathStages = path.map((id) => getStage(id)).filter(Boolean) as StageRecord[]
    const labels = pathStages.map((s) => s.display_name)
    return (
      <WireframeLayout title="Treatment pathway" showBack>
        <div className="wf-main-content" style={{ padding: '16px' }}>
          <p style={{ fontSize: '15px', color: 'var(--wf-gray-700)', marginBottom: '12px' }}>
            You selected:
          </p>
          <div
            style={{
              background: 'var(--wf-rose-50)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            {labels.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--wf-gray-800)' }}>
                {labels.map((label, i) => (
                  <li key={i} style={{ marginBottom: i < labels.length - 1 ? '8px' : 0 }}>
                    {label}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: 'var(--wf-gray-600)' }}>No pathway selected</p>
            )}
          </div>
          <p className="stage-summary-note">
            We use this to personalise your experience. Nothing is shared without your consent.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="wf-btn wf-btn-primary wf-btn-full"
              onClick={handleSave}
            >
              Save my pathway
            </button>
            <button
              type="button"
              className="wf-btn wf-btn-secondary wf-btn-full"
              onClick={handleDontKnowYet}
            >
              I don't know yet
            </button>
            <button
              type="button"
              className="wf-btn wf-btn-outline wf-btn-full"
              onClick={handleChangeSelection}
            >
              Change my selection
            </button>
          </div>
        </div>
      </WireframeLayout>
    )
  }

  return (
    <WireframeLayout title="Treatment pathway" showBack>
      <div className="wf-main-content" style={{ padding: '16px' }}>
        <p style={{ fontSize: '15px', color: 'var(--wf-gray-700)', marginBottom: '16px' }}>
          {isRootStep
            ? 'Where are you in your journey? Choose the option that best describes you.'
            : 'Would you like to add more detail? Choose one or skip.'}
        </p>

        {currentOptions.map((stage) => (
          <button
            key={stage.stage_id}
            type="button"
            className="stage-option"
            onClick={() => handleSelect(stage.stage_id)}
          >
            <span>{stage.display_name}</span>
            <ChevronRight size={18} style={{ color: 'var(--wf-rose-500)', flexShrink: 0 }} />
          </button>
        ))}

        {path.length > 0 && (
          <button
            type="button"
            className="wf-btn wf-btn-primary wf-btn-full"
            style={{ marginTop: '16px' }}
            onClick={handleSave}
          >
            Save
          </button>
        )}
        {!isRootStep && currentOptions.length > 0 && (
          <button
            type="button"
            className="wf-btn wf-btn-secondary wf-btn-full"
            style={{ marginTop: '10px' }}
            onClick={handleSkip}
          >
            Skip
          </button>
        )}
      </div>
    </WireframeLayout>
  )
}
