import type { Video, FileText, Brain, UtensilsCrossed, ExternalLink, Dumbbell, Shirt, ClipboardCheck } from 'lucide-react'

export interface ResourceCategory {
  id: string
  title: string
  iconBg: string
  iconColor: string
  Icon: typeof Video | typeof FileText | typeof Brain | typeof UtensilsCrossed | typeof ExternalLink | typeof Dumbbell | typeof Shirt | typeof ClipboardCheck
  links: ResourceLink[]
}

export interface ResourceLink {
  label: string
  url: string
  type: 'video' | 'pdf' | 'link'
}

export interface DashboardSummary {
  wellness_score: number
  streak_days: number
  avg_mood: number
  trend_direction: 'up' | 'down' | 'stable'
  trend_percentage: number
  next_appointment: {
    id: string
    title: string
    date: string
    time: string
    location: string
  } | null
  daily_quote: { text: string; author: string } | null
}
