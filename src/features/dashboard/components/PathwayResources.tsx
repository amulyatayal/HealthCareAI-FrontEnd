import { useState } from 'react'
import { ChevronRight, ChevronDown, Video, FileText, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeCard } from '../../../wireframes/components'
import { youtubeToEmbedUrl } from '../../../wireframes/utils/youtubeEmbed'
import type { ResourceCategory } from '../types'

interface Props {
  categories: ResourceCategory[]
  hasStageSelected: boolean
  basePath: string
}

export function PathwayResources({ categories, hasStageSelected, basePath }: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  return (
    <>
      <div className="wf-section-header">
        <span className="wf-section-title">Resources for your pathway</span>
        {!hasStageSelected && (
          <Link to={`${basePath}/profile/stage`} style={{ fontSize: 12, color: 'var(--wf-rose-500)', textDecoration: 'none' }}>
            Set your pathway
          </Link>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--wf-gray-600)', marginBottom: '12px' }}>
        {hasStageSelected
          ? 'Videos play in the app; PDFs and links open in a new tab.'
          : 'Set your treatment pathway to see personalised resources from your clinical team.'}
      </p>
      <WireframeCard>
        {categories.map((cat) => {
          const isExpanded = expandedCategory === cat.id
          return (
            <div key={cat.id} style={{ borderBottom: '1px solid var(--wf-gray-100)' }}>
              <button
                type="button"
                className="wf-list-item"
                style={{ width: '100%', border: 'none', textAlign: 'left', marginBottom: 0, cursor: 'pointer' }}
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
              >
                <div className="wf-list-avatar" style={{ background: cat.iconBg }}>
                  <cat.Icon size={20} style={{ color: cat.iconColor }} />
                </div>
                <div className="wf-list-content">
                  <div className="wf-list-title">{cat.title}</div>
                  <div className="wf-list-subtitle">{cat.links.length} link{cat.links.length !== 1 ? 's' : ''}</div>
                </div>
                {isExpanded ? (
                  <ChevronDown size={18} style={{ color: 'var(--wf-gray-400)' }} />
                ) : (
                  <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
                )}
              </button>
              {isExpanded && (
                <div style={{ padding: '0 12px 12px 60px' }}>
                  {cat.links.map((link) => {
                    const linkStyle = {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 0',
                      textDecoration: 'none',
                      color: 'inherit',
                      fontSize: '14px',
                      borderBottom: '1px solid var(--wf-gray-50)',
                    } as const
                    if (link.type === 'video') {
                      const embedUrl = youtubeToEmbedUrl(link.url)
                      return (
                        <Link
                          key={link.url}
                          to={`${basePath}/watch?url=${encodeURIComponent(embedUrl)}`}
                          style={linkStyle}
                        >
                          <Video size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{link.label}</span>
                        </Link>
                      )
                    }
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                      >
                        <FileText size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{link.label}</span>
                        <ExternalLink size={14} style={{ color: 'var(--wf-gray-400)' }} />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </WireframeCard>
    </>
  )
}
