import { useState, useEffect, useRef } from 'react'
import { Search, Video, FileText, ExternalLink, X, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { youtubeToEmbedUrl } from '../utils/youtubeEmbed'
import { getAllResources } from '../../services/api'
import type { PatientResource } from '../../services/api'
import { DEMO_ADMIN_RESOURCES, patientResourcesToCategories } from '../../features/dashboard/data/fallbackResources'
import type { ResourceCategory } from '../../features/dashboard/types'

function getAllLocalResources(): PatientResource[] {
  const all: PatientResource[] = []

  try {
    const adminRaw = localStorage.getItem('admin_pathway_resources')
    if (adminRaw) {
      const adminItems = JSON.parse(adminRaw)
      for (const item of adminItems) {
        for (const r of item.resources) {
          all.push({
            title: r.title,
            description: item.description,
            url: r.url,
            type: r.type,
            intents: item.intents,
          })
        }
      }
    }
  } catch { /* ignore */ }

  if (all.length === 0) {
    for (const item of DEMO_ADMIN_RESOURCES) {
      for (const r of item.resources) {
        all.push({
          title: r.title,
          description: item.description,
          url: r.url,
          type: r.type,
          intents: item.intents,
        })
      }
    }
  }

  return all
}

function resourceUrlKey(url: string): string {
  const trimmed = url.trim()
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i)
  if (driveMatch) return `drive:${driveMatch[1].toLowerCase()}`
  try {
    const u = new URL(trimmed)
    u.hash = ''
    return u.toString().toLowerCase()
  } catch {
    return trimmed.toLowerCase()
  }
}

function dedupeResourcesByUrl(resources: PatientResource[]): PatientResource[] {
  const byUrl = new Map<string, PatientResource>()
  for (const r of resources) {
    const key = resourceUrlKey(r.url)
    const existing = byUrl.get(key)
    if (!existing) {
      byUrl.set(key, r)
      continue
    }
    byUrl.set(key, {
      ...existing,
      intents: [...new Set([...existing.intents, ...r.intents])],
    })
  }
  return [...byUrl.values()]
}

function filterResources(resources: PatientResource[], query: string): PatientResource[] {
  const q = query.toLowerCase().trim()
  if (!q) return resources
  return resources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.intents.some((i) => i.replace(/_/g, ' ').includes(q)),
  )
}

export function SearchResourcesPage() {
  const base = useBasePath()
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [allResources, setAllResources] = useState<PatientResource[]>([])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    async function loadResources() {
      setLoading(true)
      try {
        const data = await getAllResources()
        if (!cancelled && data.resources.length > 0) {
          const deduped = dedupeResourcesByUrl(data.resources)
          setAllResources(deduped)
          setCategories(patientResourcesToCategories(deduped))
          setLoading(false)
          return
        }
      } catch {
        /* backend unavailable, fall through */
      }
      if (!cancelled) {
        const deduped = dedupeResourcesByUrl(getAllLocalResources())
        setAllResources(deduped)
        setCategories(patientResourcesToCategories(deduped))
        setLoading(false)
      }
    }
    loadResources()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!allResources.length) return
    const matched = dedupeResourcesByUrl(filterResources(allResources, query))
    setCategories(patientResourcesToCategories(matched))
  }, [query, allResources])

  const totalResults = categories.reduce((n, c) => n + c.links.length, 0)

  return (
    <WireframeLayout title="Search Resources" showBack>
      <div className="wf-search-bar">
        <Search size={18} className="wf-search-bar-icon" />
        <input
          ref={inputRef}
          type="text"
          className="wf-search-bar-input"
          placeholder="Search resources by keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            type="button"
            className="wf-search-bar-clear"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="wf-search-status">
          <p>Searching...</p>
        </div>
      ) : totalResults === 0 && query.trim() ? (
        <div className="wf-search-empty">
          <Search size={40} strokeWidth={1.2} />
          <h3>No results found</h3>
          <p>Try a different keyword or check your spelling.</p>
        </div>
      ) : !query.trim() ? (
        <div className="wf-search-empty">
          <BookOpen size={40} strokeWidth={1.2} />
          <h3>Search your care resources</h3>
          <p>Find leaflets, videos, and links shared by your clinical team.</p>
        </div>
      ) : null}

      {!loading && totalResults > 0 && (
        <>
          <p className="wf-search-result-count">
            {totalResults} result{totalResults !== 1 ? 's' : ''}
            {query.trim() ? ` for "${query.trim()}"` : ''}
          </p>

          {categories.map((cat) => (
            <WireframeCard key={cat.id} className="wf-search-category">
              <div className="wf-search-category-header">
                <div className="wf-list-avatar" style={{ background: cat.iconBg }}>
                  <cat.Icon size={20} style={{ color: cat.iconColor }} />
                </div>
                <span className="wf-search-category-title">{cat.title}</span>
                <span className="wf-search-category-count">{cat.links.length}</span>
              </div>

              {cat.links.map((link) => {
                const TypeIcon = link.type === 'video' ? Video : link.type === 'pdf' ? FileText : ExternalLink
                const typeColor = link.type === 'video' ? '#2563eb' : link.type === 'pdf' ? '#d97706' : '#6b7280'
                const viewUrl = link.type === 'video'
                  ? `${base}/view?url=${encodeURIComponent(youtubeToEmbedUrl(link.url))}&type=video&title=${encodeURIComponent(link.label)}`
                  : `${base}/view?url=${encodeURIComponent(link.url)}&type=${link.type}&title=${encodeURIComponent(link.label)}`

                return (
                  <Link
                    key={link.url}
                    to={viewUrl}
                    className="wf-search-result-card"
                  >
                    <TypeIcon size={18} style={{ color: typeColor, flexShrink: 0 }} />
                    <span className="wf-search-result-label">{link.label}</span>
                    <span className="wf-search-result-badge" style={{ color: typeColor }}>{link.type}</span>
                  </Link>
                )
              })}
            </WireframeCard>
          ))}
        </>
      )}
    </WireframeLayout>
  )
}
