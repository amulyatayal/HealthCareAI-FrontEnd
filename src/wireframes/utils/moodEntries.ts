import type { MoodEntry } from '../../services/api'

export type MoodEntryType = 'basic' | 'advanced'

type RawMoodEntry = MoodEntry & { id?: string; entry_type?: MoodEntryType }

export function normalizeMoodEntry(raw: RawMoodEntry): MoodEntry {
  return {
    entry_id: raw.entry_id ?? raw.id ?? `mood-${Date.now()}`,
    entry_type: raw.entry_type,
    mood_score: raw.mood_score,
    note: raw.note ?? null,
    emotions: raw.emotions ?? null,
    triggers: raw.triggers ?? null,
    quick_check: raw.quick_check ?? null,
    timestamp: raw.timestamp,
  }
}

export function isAdvancedMoodEntry(entry: MoodEntry): boolean {
  if (entry.entry_type === 'advanced') return true
  if (entry.entry_type === 'basic') return false
  return !!(
    entry.emotions?.length ||
    entry.triggers?.length ||
    entry.quick_check
  )
}

export function isBasicMoodEntry(entry: MoodEntry): boolean {
  if (entry.entry_type === 'basic') return true
  if (entry.entry_type === 'advanced') return false
  return !isAdvancedMoodEntry(entry)
}

/** Merge optimistic local advanced entries with API results, deduped by id. */
export function mergeAdvancedHistory(local: MoodEntry[], api: MoodEntry[]): MoodEntry[] {
  const merged = new Map<string, MoodEntry>()
  for (const entry of api.map(normalizeMoodEntry).filter(isAdvancedMoodEntry)) {
    merged.set(entry.entry_id, entry)
  }
  for (const entry of local.filter(isAdvancedMoodEntry)) {
    if (!merged.has(entry.entry_id)) {
      merged.set(entry.entry_id, entry)
    }
  }
  return [...merged.values()].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
}
