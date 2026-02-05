/** Single stage from stage_hierarchy.json */
export interface StageRecord {
  stage_id: string
  name: string
  description: string
  parent_stage_id: string | null
  child_stage_ids: string[]
  before_stages: string[]
  after_stages: string[]
  transition_notes: string | null
  is_patient_facing: boolean
  display_name: string
  patient_facing_questions?: string
  search_terms?: string[]
}

/** Full stage hierarchy payload */
export interface StageHierarchyData {
  version: string
  generated_at: string
  source_file: string
  total_stages: number
  root_stage_ids: string[]
  stages: Record<string, StageRecord>
}
