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
          setDashboard(data)
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
