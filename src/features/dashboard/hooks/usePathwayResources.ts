import { useState, useEffect } from 'react'
import { getResourcesForStage } from '../../../services/api'
import type { PatientResource } from '../../../services/api'
import type { ResourceCategory } from '../types'
import {
  FALLBACK_CATEGORIES,
  patientResourcesToCategories,
} from '../data/fallbackResources'

interface AdminPathwayResource {
  pathway_stage_ids: string[]
  description: string
  intents: string[]
  resources: { title: string; url: string; type: 'video' | 'pdf' | 'link' }[]
}

function getPatientStageIds(): string[] {
  try {
    const raw = localStorage.getItem('patient_stage_path')
    if (raw) return JSON.parse(raw) as string[]
  } catch { /* ignore */ }
  return []
}

function matchAdminResources(
  adminItems: AdminPathwayResource[],
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
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([])
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
      setResourceCategories(FALLBACK_CATEGORIES)
      return
    }

    let cancelled = false
    const leafStageId = patientStageIds[patientStageIds.length - 1]

    async function loadResources() {
      try {
        const data = await getResourcesForStage(leafStageId)
        if (!cancelled && data.resources.length > 0) {
          setResourceCategories(patientResourcesToCategories(data.resources))
          return
        }
      } catch (err) {
        console.info('[PathwayResources] Backend unavailable', err)
      }

      if (cancelled) return

      try {
        const adminDataRaw = localStorage.getItem('admin_pathway_resources')
        if (adminDataRaw) {
          const adminItems = JSON.parse(adminDataRaw) as AdminPathwayResource[]
          const matched = matchAdminResources(adminItems, patientStageIds)
          if (matched.length > 0) {
            setResourceCategories(patientResourcesToCategories(matched))
            return
          }
        }
      } catch { /* ignore */ }

      if (!cancelled) {
        setResourceCategories([])
      }
    }

    loadResources()
    return () => { cancelled = true }
  }, [stageKey, hasStageSelected])

  return { resourceCategories, hasStageSelected }
}
