import { useState, useEffect } from 'react'
import { getResourcesForStage } from '../../../services/api'
import type { PatientResource } from '../../../services/api'
import type { ResourceCategory } from '../types'
import {
  FALLBACK_CATEGORIES,
  DEMO_ADMIN_RESOURCES,
  filterByPatientClinician,
  patientResourcesToCategories,
} from '../data/fallbackResources'

function getPatientStageIds(): string[] {
  try {
    const raw = localStorage.getItem('patient_stage_path')
    if (raw) return JSON.parse(raw) as string[]
  } catch { /* ignore */ }
  return []
}

function matchResources(
  adminItems: typeof DEMO_ADMIN_RESOURCES,
  patientStageIds: string[],
): PatientResource[] {
  const matched: PatientResource[] = []
  for (const item of adminItems) {
    if (patientStageIds.some((id) => item.pathway_stage_ids.includes(id))) {
      for (const r of item.resources) {
        matched.push({
          title: r.title,
          description: item.description,
          url: r.url,
          type: r.type,
          intents: item.intents,
        })
      }
    }
  }
  return matched
}

export function usePathwayResources() {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>(FALLBACK_CATEGORIES)
  const [patientStageIds, setPatientStageIds] = useState<string[]>(getPatientStageIds)
  const hasStageSelected = patientStageIds.length > 0

  useEffect(() => {
    setPatientStageIds(getPatientStageIds())
  }, [])

  useEffect(() => {
    function handleFocus() {
      setPatientStageIds(getPatientStageIds())
    }
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleFocus)
    }
  }, [])

  const stageKey = patientStageIds.join(',')
  useEffect(() => {
    if (!hasStageSelected) {
      console.info('[PathwayResources] No stage selected, showing defaults')
      setResourceCategories(FALLBACK_CATEGORIES)
      return
    }
    let cancelled = false
    const leafStageId = patientStageIds[patientStageIds.length - 1]

    async function loadResources() {
      console.info(`[PathwayResources] Fetching from backend for stage: ${leafStageId}`)
      try {
        const data = await getResourcesForStage(leafStageId)
        if (!cancelled && data.resources.length > 0) {
          console.info(`[PathwayResources] Backend returned ${data.resources.length} resources`)
          setResourceCategories(patientResourcesToCategories(data.resources))
          return
        }
        if (!cancelled) {
          console.info('[PathwayResources] Backend returned empty, trying fallbacks')
        }
      } catch (err) {
        console.info('[PathwayResources] Backend unavailable, trying fallbacks', err)
      }

      if (cancelled) return

      try {
        const adminDataRaw = localStorage.getItem('admin_pathway_resources')
        if (adminDataRaw) {
          const adminItems = filterByPatientClinician(JSON.parse(adminDataRaw) as typeof DEMO_ADMIN_RESOURCES)
          const matched = matchResources(adminItems, patientStageIds)
          if (matched.length > 0) {
            console.info(`[PathwayResources] Using localStorage admin resources (${matched.length} matched)`)
            setResourceCategories(patientResourcesToCategories(matched))
            return
          }
        }
      } catch { /* ignore */ }

      if (cancelled) return

      const matched = matchResources(filterByPatientClinician(DEMO_ADMIN_RESOURCES), patientStageIds)
      if (matched.length > 0) {
        console.info(`[PathwayResources] Using demo fallback resources (${matched.length} matched)`)
        setResourceCategories(patientResourcesToCategories(matched))
      } else {
        console.info('[PathwayResources] No resources matched, showing defaults')
        setResourceCategories(FALLBACK_CATEGORIES)
      }
    }

    loadResources()
    return () => { cancelled = true }
  }, [stageKey])

  return { resourceCategories, hasStageSelected }
}
