import { Video, FileText, Brain, UtensilsCrossed, ExternalLink } from 'lucide-react'
import type { PatientResource } from '../../../services/api'
import type { ResourceCategory } from '../types'

export const ICON_ROTATION: { Icon: typeof Video | typeof FileText | typeof Brain | typeof UtensilsCrossed | typeof ExternalLink; bg: string; color: string }[] = [
  { Icon: Video, bg: 'linear-gradient(135deg, #dbeafe, #eff6ff)', color: '#2563eb' },
  { Icon: FileText, bg: 'linear-gradient(135deg, #fef3c7, #fffbeb)', color: '#d97706' },
  { Icon: Brain, bg: 'linear-gradient(135deg, #f3e8ff, #faf5ff)', color: '#9333ea' },
  { Icon: UtensilsCrossed, bg: 'linear-gradient(135deg, #dcfce7, #f0fdf4)', color: '#16a34a' },
  { Icon: ExternalLink, bg: 'linear-gradient(135deg, #fce7f3, #fdf2f8)', color: '#db2777' },
]

export const FALLBACK_CATEGORIES: ResourceCategory[] = [
  {
    id: 'procedure',
    title: 'Information about procedure',
    iconBg: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
    iconColor: '#2563eb',
    Icon: Video,
    links: [
      { label: 'Information on the procedure (video)', url: 'https://youtu.be/zeMr6XaoTEM?si=KUcwJsQ7WsNBY_cr', type: 'video' },
      { label: 'Barts chest wall perforator flap PIF (PDF)', url: 'https://drive.google.com/file/d/1TcJlT72dojrOCe8Z3OIxsfTSga4-tYF_/view?usp=drive_link', type: 'pdf' },
    ],
  },
  {
    id: 'exercises',
    title: 'Exercises',
    iconBg: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
    iconColor: '#d97706',
    Icon: FileText,
    links: [
      { label: 'Exercises after breast cancer surgery (PDF)', url: 'https://breastcancernow.org/media-assets/dmbpk1rz/bcc6-excercises-after-breast-cancer-surgery-web-pdf.pdf', type: 'pdf' },
      { label: 'Exercise (short video)', url: 'https://www.youtube.com/shorts/haDyGVRpQzo', type: 'video' },
    ],
  },
  {
    id: 'mental-health',
    title: 'Mental health',
    iconBg: 'linear-gradient(135deg, #f3e8ff, #faf5ff)',
    iconColor: '#9333ea',
    Icon: Brain,
    links: [
      { label: 'Mental health (video)', url: 'https://www.youtube.com/watch?v=AKCmdHN9JX8', type: 'video' },
      { label: 'Body image (Macmillan)', url: 'https://cdn.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/791-source/body-image-mac14192', type: 'link' },
    ],
  },
  {
    id: 'diet',
    title: 'Diet',
    iconBg: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
    iconColor: '#16a34a',
    Icon: UtensilsCrossed,
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

export const MOCK_DASHBOARD = {
  wellness_score: 78,
  streak_days: 7,
  avg_mood: 8.2,
  trend_direction: 'up' as const,
  trend_percentage: 15,
  next_appointment: {
    id: '1',
    title: 'Dr. Thompson - Oncology',
    clinician_name: 'Dr. Thompson',
    specialty: 'Oncology',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '10:30 AM',
    location: 'City Hospital, Room 302',
    reminder_set: true,
  },
  daily_quote: {
    text: 'Every day may not be good, but there is something good in every day.',
    author: 'Alice Morse Earle',
  },
}

export function patientResourcesToCategories(resources: PatientResource[]): ResourceCategory[] {
  const grouped = new Map<string, PatientResource[]>()
  for (const r of resources) {
    const key = r.description || 'Resources'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(r)
  }
  const categories: ResourceCategory[] = []
  let i = 0
  for (const [desc, items] of grouped) {
    const style = ICON_ROTATION[i % ICON_ROTATION.length]
    categories.push({
      id: `dynamic-${i}`,
      title: desc,
      iconBg: style.bg,
      iconColor: style.color,
      Icon: style.Icon,
      links: items.map((r) => ({ label: r.title, url: r.url, type: r.type })),
    })
    i++
  }
  return categories
}
