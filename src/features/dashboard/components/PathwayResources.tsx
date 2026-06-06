import { useState } from 'react'
import { ChevronRight, ChevronDown, Video, FileText, ExternalLink as ExternalLinkIcon } from 'lucide-react'
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
        <span className="wf-section-label">Resources for your pathway</span>
        <Link to={`${basePath}/profile/stage`} className="wf-card-action-link" style={{ fontSize: 12 }}>
          {hasStageSelected ? 'Change pathway' : 'Set your pathway'}
        </Link>
      </div>
      <p className="wf-pathway-helper">
        {hasStageSelected
          ? categories.length > 0
            ? 'Resources from your clinical team.'
            : 'No resources for your selection yet.'
          : 'Set your pathway to see resources from your clinical team.'}
      </p>
      <WireframeCard>
        {categories.length === 0 && hasStageSelected ? (
          <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', margin: 0, padding: '8px 4px' }}>
            Your clinical team has not added resources for this area yet. Try a different selection or check back later.
          </p>
        ) : categories.map((cat) => {
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
                    const viewUrl = link.type === 'video'
                      ? `${basePath}/view?url=${encodeURIComponent(youtubeToEmbedUrl(link.url))}&type=video&title=${encodeURIComponent(link.label)}`
                      : `${basePath}/view?url=${encodeURIComponent(link.url)}&type=${link.type}&title=${encodeURIComponent(link.label)}`
                    const Icon = link.type === 'video' ? Video : link.type === 'pdf' ? FileText : ExternalLinkIcon
                    return (
                      <Link key={link.url} to={viewUrl} style={linkStyle}>
                        <Icon size={16} style={{ color: 'var(--wf-gray-400)', flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{link.label}</span>
                      </Link>
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
