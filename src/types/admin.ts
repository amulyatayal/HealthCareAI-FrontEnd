export type IntentType =
  | 'symptoms'
  | 'surgery_procedures'
  | 'drains_wound_care'
  | 'cancer_treatment'
  | 'medication_info'
  | 'side_effects'
  | 'pre_surgery_prehab'
  | 'post_surgery_recovery'
  | 'follow_up_care'
  | 'nutrition'
  | 'exercise'
  | 'clothing'
  | 'emotional_support'
  | 'diagnosis_testing'
  | 'admin_logistics'
  | 'safety_red_flags'
  | 'statistics'
  | 'unknown';

export interface IntentOption {
  value: IntentType;
  label: string;
  category: string;
}

export const INTENT_OPTIONS: IntentOption[] = [
  // Core Medical
  { value: 'symptoms', label: 'Symptoms', category: 'Core Medical' },
  { value: 'surgery_procedures', label: 'Surgery & Procedures', category: 'Core Medical' },
  { value: 'drains_wound_care', label: 'Drains & Wound Care', category: 'Core Medical' },
  { value: 'cancer_treatment', label: 'Cancer Treatment', category: 'Core Medical' },
  { value: 'medication_info', label: 'Medication Info', category: 'Core Medical' },
  { value: 'side_effects', label: 'Side Effects', category: 'Core Medical' },

  // Perioperative
  { value: 'pre_surgery_prehab', label: 'Pre-Surgery / Prehab', category: 'Perioperative' },
  { value: 'post_surgery_recovery', label: 'Post-Surgery Recovery', category: 'Perioperative' },

  // Follow-up Care
  { value: 'follow_up_care', label: 'Follow-up Care', category: 'Follow-up Care' },
  { value: 'nutrition', label: 'Nutrition', category: 'Follow-up Care' },
  { value: 'exercise', label: 'Exercise', category: 'Follow-up Care' },
  { value: 'clothing', label: 'Clothing', category: 'Follow-up Care' },

  // Support & Admin
  { value: 'emotional_support', label: 'Emotional Support', category: 'Support & Admin' },
  { value: 'diagnosis_testing', label: 'Diagnosis & Testing', category: 'Support & Admin' },
  { value: 'admin_logistics', label: 'Admin & Logistics', category: 'Support & Admin' },

  // Safety & Info
  { value: 'safety_red_flags', label: 'Safety / Red Flags', category: 'Safety & Info' },
  { value: 'statistics', label: 'Statistics', category: 'Safety & Info' },

  // Fallback
  { value: 'unknown', label: 'Unknown / General', category: 'Fallback' },
];

export const INTENT_CATEGORIES = [...new Set(INTENT_OPTIONS.map((o) => o.category))];

export interface ResourceLink {
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'link';
}

export interface PathwayStageResource {
  id: string;
  clinician_name: string;
  clinician_id: string;
  pathway_stage_ids: string[];
  description: string;
  intents: IntentType[];
  resources: ResourceLink[];
  created_at: string;
  updated_at: string;
}

export type CreatePathwayResourceRequest = Omit<PathwayStageResource, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePathwayResourceRequest = CreatePathwayResourceRequest;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
}

// Access Codes
export interface AccessCode {
  access_code: string;
  clinician_id: string;
  clinician_name: string;
  hospital_id: string;
  created_at: string;
  is_active: boolean;
}

export interface AccessCodeCreateRequest {
  hospital_id: string;
}

export interface AccessCodeListResponse {
  codes: AccessCode[];
}
