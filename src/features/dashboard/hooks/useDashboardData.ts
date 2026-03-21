import { useState, useEffect } from 'react'
import { getDashboardSummary } from '../../../services/api'
import type { DashboardSummary } from '../types'
import { MOCK_DASHBOARD } from '../data/fallbackResources'

export function useDashboardData() {
  const [dashboard, setDashboard] = useState<DashboardSummary>(MOCK_DASHBOARD)

  useEffect(() => {
    let cancelled = false
    async function load() {
      console.info('[Dashboard] Fetching summary from backend')
      try {
        const data = await getDashboardSummary()
        if (!cancelled) {
          console.info('[Dashboard] Backend returned summary', data)
          setDashboard({
            wellness_score: data.wellness_score ?? MOCK_DASHBOARD.wellness_score,
            streak_days: data.streak_days ?? MOCK_DASHBOARD.streak_days,
            avg_mood: data.avg_mood ?? MOCK_DASHBOARD.avg_mood,
            trend_direction: data.trend_direction ?? MOCK_DASHBOARD.trend_direction,
            trend_percentage: data.trend_percentage ?? MOCK_DASHBOARD.trend_percentage,
            next_appointment: data.next_appointment ?? MOCK_DASHBOARD.next_appointment,
            daily_quote: data.daily_quote ?? MOCK_DASHBOARD.daily_quote,
          })
        }
      } catch (err) {
        console.info('[Dashboard] Backend unavailable, using mock data', err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return dashboard
}
