import { useSearchParams } from 'react-router-dom'
import { ExternalLink, Globe } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'

type ResourceType = 'video' | 'pdf' | 'link'

function toGoogleDrivePreview(url: string): string | null {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`
  return null
}

function toPdfViewerUrl(url: string): string {
  const drivePreview = toGoogleDrivePreview(url)
  if (drivePreview) return drivePreview
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
}

const TYPE_LABELS: Record<ResourceType, string> = {
  video: 'Video',
  pdf: 'Document',
  link: 'Resource',
}

export function ViewResourcePage() {
  const [searchParams] = useSearchParams()
  const rawUrl = searchParams.get('url')
  const type = (searchParams.get('type') as ResourceType) || 'link'
  const title = searchParams.get('title') || TYPE_LABELS[type] || 'Resource'

  if (!rawUrl) {
    return (
      <WireframeLayout title={title} showBack>
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--wf-gray-600)' }}>
          No URL provided.
        </div>
      </WireframeLayout>
    )
  }

  const embedUrl = type === 'pdf' ? toPdfViewerUrl(rawUrl) : rawUrl

  if (type === 'video') {
    return (
      <WireframeLayout title={title} showBack>
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            background: 'var(--wf-gray-900)',
          }}
        >
          <iframe
            title="Video"
            src={embedUrl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <OpenInBrowserBar url={rawUrl} />
      </WireframeLayout>
    )
  }

  if (type === 'link') {
    const hostname = (() => {
      try { return new URL(rawUrl).hostname } catch { return rawUrl }
    })()
    return (
      <WireframeLayout title={title} showBack>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          textAlign: 'center',
          minHeight: 'calc(100vh - 200px)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Globe size={28} style={{ color: '#6b7280' }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>{title}</h3>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 24px', wordBreak: 'break-all' }}>{hostname}</p>
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <ExternalLink size={16} />
            Open resource
          </a>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16, maxWidth: 300, lineHeight: 1.5 }}>
            This resource will open in your browser. Use the back button to return to the app.
          </p>
        </div>
      </WireframeLayout>
    )
  }

  return (
    <WireframeLayout title={title} showBack>
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 120px)',
          overflow: 'hidden',
          background: '#f9fafb',
        }}
      >
        <iframe
          title={title}
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
      <OpenInBrowserBar url={rawUrl} />
    </WireframeLayout>
  )
}

function OpenInBrowserBar({ url }: { url: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 16px',
        background: '#fff',
        borderTop: '1px solid var(--wf-gray-100)',
      }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--wf-rose-500)',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        <ExternalLink size={14} />
        Open in browser
      </a>
    </div>
  )
}
