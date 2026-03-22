import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Video, FileText, ExternalLink, X, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { youtubeToEmbedUrl } from '../utils/youtubeEmbed'
import { searchAllResources } from '../../services/api'
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
  const [allLocal, setAllLocal] = useState<PatientResource[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAllLocal(getAllLocalResources())
  }, [])

  useEffect(() => {
    if (!allLocal.length) return
    if (!query.trim()) {
      setCategories(patientResourcesToCategories(allLocal))
      return
    }

    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      searchBackendThenLocal(query.trim())
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, allLocal])

  const searchBackendThenLocal = useCallback(
    async (q: string) => {
      try {
        const data = await searchAllResources(q)
        if (data.resources.length > 0) {
          setCategories(patientResourcesToCategories(data.resources))
          setLoading(false)
          return
        }
      } catch {
        /* backend unavailable, fall through */
      }

      const matched = filterResources(allLocal, q)
      setCategories(patientResourcesToCategories(matched))
      setLoading(false)
    },
    [allLocal],
  )

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

                if (link.type === 'video') {
                  const embedUrl = youtubeToEmbedUrl(link.url)
                  return (
                    <Link
                      key={link.url}
                      to={`${base}/watch?url=${encodeURIComponent(embedUrl)}`}
                      className="wf-search-result-card"
                    >
                      <TypeIcon size={18} style={{ color: typeColor, flexShrink: 0 }} />
                      <span className="wf-search-result-label">{link.label}</span>
                      <span className="wf-search-result-badge" style={{ color: typeColor }}>{link.type}</span>
                    </Link>
                  )
                }
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wf-search-result-card"
                  >
                    <TypeIcon size={18} style={{ color: typeColor, flexShrink: 0 }} />
                    <span className="wf-search-result-label">{link.label}</span>
                    <span className="wf-search-result-badge" style={{ color: typeColor }}>{link.type}</span>
                    <ExternalLink size={14} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                  </a>
                )
              })}
            </WireframeCard>
          ))}
        </>
      )}
    </WireframeLayout>
  )
}
