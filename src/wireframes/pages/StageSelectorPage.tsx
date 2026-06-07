import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import stageHierarchyData from '../data/stage_hierarchy.json'
import { WireframeLayout } from '../WireframeLayout'
import type { StageHierarchyData as StageHierarchyType, StageRecord } from '../data/stageHierarchyTypes'
import { useBasePath } from '../hooks/useBasePath'
import { useAuth } from '../../contexts/AuthContext'
import { selectDetailedStage, getMyStage } from '../../services/api'

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

/** Walk parent_stage_id chain so we can restore the wizard path from a saved leaf id. */
function pathFromLeafId(leafId: string): string[] {
  const steps: string[] = []
  let currentId: string | null | undefined = leafId
  const seen = new Set<string>()
  while (currentId) {
    if (seen.has(currentId)) break
    seen.add(currentId)
    steps.unshift(currentId)
    const stage: StageRecord | undefined = hierarchy.stages[currentId]
    currentId = stage?.parent_stage_id ?? null
  }
  return steps
}

function readStoredPath(): string[] | null {
  try {
    const raw = localStorage.getItem('patient_stage_path')
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    if (!parsed.every((id): id is string => typeof id === 'string' && Boolean(hierarchy.stages[id]))) return null
    return parsed
  } catch {
    return null
  }
}

export function StageSelectorPage() {
  const base = useBasePath()
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const [path, setPath] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [hydrating, setHydrating] = useState(true)

  useEffect(() => {
    if (authLoading) return

    let cancelled = false
    void (async () => {
      try {
        if (user?.isGuest) {
          const stored = readStoredPath()
          if (stored) {
            setPath(stored)
            setDone(true)
          }
          return
        }

        try {
          const my = await getMyStage()
          if (cancelled) return
          if (my.stage_id && hierarchy.stages[my.stage_id]) {
            setPath(pathFromLeafId(my.stage_id))
            setDone(true)
            return
          }
        } catch {
          /* 401 / offline — fall back to localStorage */
        }
        if (cancelled) return
        const stored = readStoredPath()
        if (stored) {
          setPath(stored)
          setDone(true)
        }
      } finally {
        if (!cancelled) setHydrating(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, user?.isGuest])

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
    setSaveError(null)
    setPath([])
    setDone(false)
  }

  const handleSave = async () => {
    if (path.length === 0) {
      navigate(`${base}/profile`)
      return
    }
    setSaveError(null)
    setSaving(true)
    try {
      // Authenticated users: persist to API + local copy for the app. Guests: local only (no DB).
      if (!user?.isGuest) {
        await selectDetailedStage(path[path.length - 1])
      }
      localStorage.setItem('patient_stage_path', JSON.stringify(path))
      window.dispatchEvent(new StorageEvent('storage', { key: 'patient_stage_path' }))
      navigate(`${base}/`, { state: { scrollToPathwayResources: true } })
    } catch (err) {
      setSaveError('Failed to save your selection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDontKnowYet = () => {
    // Leave without saving; go back to profile
    navigate(`${base}/profile`)
  }

  if (hydrating) {
    return (
      <WireframeLayout title="Treatment pathway" showBack>
        <div className="wf-main-content" style={{ padding: '24px', textAlign: 'center', color: 'var(--wf-gray-600)' }}>
          Loading your pathway…
        </div>
      </WireframeLayout>
    )
  }

  if (done) {
    const pathStages = path.map((id) => getStage(id)).filter(Boolean) as StageRecord[]
    const labels = pathStages.map((s) => s.display_name)
    return (
      <WireframeLayout title="Treatment pathway" showBack>
        <div className="wf-main-content" style={{ padding: '16px' }}>
          <p style={{ fontSize: '15px', color: 'var(--wf-gray-700)', marginBottom: '12px' }}>
            You want information about:
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
            We use this to show you relevant resources. Nothing is shared without your consent.
          </p>
          {saveError ? (
            <p style={{ fontSize: 14, color: 'var(--wf-rose-600)', marginBottom: 12 }} role="alert">
              {saveError}
            </p>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="wf-btn wf-btn-primary wf-btn-full"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              Save and show resources
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
            ? 'Which area would you like more information about? Choose the option that fits best.'
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
            Save selection
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
