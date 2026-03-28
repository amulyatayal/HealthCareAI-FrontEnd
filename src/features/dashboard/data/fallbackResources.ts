import { Video, Brain, UtensilsCrossed, Dumbbell, Shirt, ClipboardCheck } from 'lucide-react'
import type { PatientResource } from '../../../services/api'
import type { ResourceCategory, ResourceLink } from '../types'

const CATEGORY_DEFINITIONS: Omit<ResourceCategory, 'links'>[] = [
  {
    id: 'procedure',
    title: 'Information about procedure',
    iconBg: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
    iconColor: '#2563eb',
    Icon: Video,
  },
  {
    id: 'exercises',
    title: 'Exercises',
    iconBg: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
    iconColor: '#d97706',
    Icon: Dumbbell,
  },
  {
    id: 'mental-health',
    title: 'Mental health',
    iconBg: 'linear-gradient(135deg, #f3e8ff, #faf5ff)',
    iconColor: '#9333ea',
    Icon: Brain,
  },
  {
    id: 'diet',
    title: 'Diet',
    iconBg: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
    iconColor: '#16a34a',
    Icon: UtensilsCrossed,
  },
  {
    id: 'follow-up-care',
    title: 'Follow-up care',
    iconBg: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
    iconColor: '#0891b2',
    Icon: ClipboardCheck,
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    iconBg: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
    iconColor: '#db2777',
    Icon: Shirt,
  },
]

const INTENT_TO_CATEGORY: Record<string, string> = {
  symptoms: 'procedure',
  surgery_procedures: 'procedure',
  drains_wound_care: 'procedure',
  cancer_treatment: 'procedure',
  medication_info: 'procedure',
  side_effects: 'procedure',
  pre_surgery_prehab: 'procedure',
  post_surgery_recovery: 'procedure',
  diagnosis_testing: 'procedure',
  safety_red_flags: 'procedure',
  statistics: 'procedure',
  admin_logistics: 'procedure',
  unknown: 'procedure',
  exercise: 'exercises',
  emotional_support: 'mental-health',
  nutrition: 'diet',
  follow_up_care: 'follow-up-care',
  clothing: 'lifestyle',
}

export const FALLBACK_CATEGORIES: ResourceCategory[] = [
  {
    ...CATEGORY_DEFINITIONS[0],
    links: [
      { label: 'Information on the procedure (video)', url: 'https://youtu.be/zeMr6XaoTEM?si=KUcwJsQ7WsNBY_cr', type: 'video' },
      { label: 'Barts chest wall perforator flap PIF (PDF)', url: 'https://drive.google.com/file/d/1TcJlT72dojrOCe8Z3OIxsfTSga4-tYF_/view?usp=drive_link', type: 'pdf' },
    ],
  },
  {
    ...CATEGORY_DEFINITIONS[1],
    links: [
      { label: 'Exercises after breast cancer surgery (PDF)', url: 'https://breastcancernow.org/media-assets/dmbpk1rz/bcc6-excercises-after-breast-cancer-surgery-web-pdf.pdf', type: 'pdf' },
      { label: 'Exercise (short video)', url: 'https://www.youtube.com/shorts/haDyGVRpQzo', type: 'video' },
    ],
  },
  {
    ...CATEGORY_DEFINITIONS[2],
    links: [
      { label: 'Mental health (video)', url: 'https://www.youtube.com/watch?v=AKCmdHN9JX8', type: 'video' },
      { label: 'Body image (Macmillan)', url: 'https://cdn.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/791-source/body-image-mac14192', type: 'link' },
    ],
  },
  {
    ...CATEGORY_DEFINITIONS[3],
    links: [
      { label: 'Diet (PDF leaflet)', url: 'https://sthk.merseywestlancs.nhs.uk/media/.leaflets/606ec25be26520.16511553.pdf', type: 'pdf' },
    ],
  },
]

export const DEMO_ADMIN_RESOURCES = [
  {
    pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.1.1', '2.1.1.2', '2.1.1.2.1', '2.1.1.2.2', '2.1.2', '2.1.2.1', '2.1.2.2', '2.1.2.2.1', '2.1.2.2.2'],
    description: 'Information about your surgery',
    intents: ['surgery_procedures', 'post_surgery_recovery'],
    resources: [
      { title: 'Information on the procedure (video)', url: 'https://youtu.be/zeMr6XaoTEM?si=KUcwJsQ7WsNBY_cr', type: 'video' as const },
      { title: 'Barts chest wall perforator flap PIF (PDF)', url: 'https://drive.google.com/file/d/1TcJlT72dojrOCe8Z3OIxsfTSga4-tYF_/view?usp=drive_link', type: 'pdf' as const },
    ],
  },
  {
    pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.1.1', '2.1.1.2', '2.1.2', '2.1.2.1', '2.1.2.2', '5', '5.1', '5.2', '6', '7', '8'],
    description: 'Exercises after surgery',
    intents: ['exercise', 'post_surgery_recovery'],
    resources: [
      { title: 'Exercises after breast cancer surgery (PDF)', url: 'https://breastcancernow.org/media-assets/dmbpk1rz/bcc6-excercises-after-breast-cancer-surgery-web-pdf.pdf', type: 'pdf' as const },
      { title: 'Exercise (short video)', url: 'https://www.youtube.com/shorts/haDyGVRpQzo', type: 'video' as const },
    ],
  },
  {
    pathway_stage_ids: ['0', '1', '1.1', '1.2', '1.3', '2', '3', '4', '5', '5.1', '5.2', '6', '7', '8', '9', '10'],
    description: 'Mental health & wellbeing',
    intents: ['emotional_support'],
    resources: [
      { title: 'Mental health (video)', url: 'https://www.youtube.com/watch?v=AKCmdHN9JX8', type: 'video' as const },
      { title: 'Body image (Macmillan)', url: 'https://cdn.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/791-source/body-image-mac14192', type: 'link' as const },
    ],
  },
  {
    pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.2', '3', '5', '5.1', '5.2', '6', '7', '8', '9', '10'],
    description: 'Diet & nutrition',
    intents: ['nutrition'],
    resources: [
      { title: 'Diet (PDF leaflet)', url: 'https://sthk.merseywestlancs.nhs.uk/media/.leaflets/606ec25be26520.16511553.pdf', type: 'pdf' as const },
    ],
  },
]

/**
 * When a patient_clinician_id is stored (from /me/associate), only keep
 * resources belonging to that clinician. No-op when no ID is stored.
 */
export function filterByPatientClinician<T>(items: T[]): T[] {
  const id = localStorage.getItem('patient_clinician_id')?.trim()
  if (!id) return items
  return items.filter(
    (item) => (item as Record<string, unknown>).clinician_id === id,
  )
}

export const MOCK_DASHBOARD = {
  wellness_score: 78,
  streak_days: 7,
  avg_mood: 8.2,
  trend_direction: 'up' as const,
  trend_percentage: 15,
  next_appointment: {
    id: '1',
    title: 'Dr. Thompson - Oncology',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '10:30 AM',
    location: 'City Hospital, Room 302',
  },
  daily_quote: {
    text: 'Every day may not be good, but there is something good in every day.',
    author: 'Alice Morse Earle',
  },
}

function resolveCategoryId(intents: string[]): string {
  for (const intent of intents) {
    const catId = INTENT_TO_CATEGORY[intent]
    if (catId) return catId
  }
  return 'procedure'
}

export function patientResourcesToCategories(resources: PatientResource[]): ResourceCategory[] {
  const buckets = new Map<string, ResourceLink[]>()

  for (const r of resources) {
    const catId = resolveCategoryId(r.intents)
    if (!buckets.has(catId)) buckets.set(catId, [])
    buckets.get(catId)!.push({ label: r.title, url: r.url, type: r.type })
  }

  return CATEGORY_DEFINITIONS
    .filter((def) => buckets.has(def.id))
    .map((def) => ({ ...def, links: buckets.get(def.id)! }))
}
