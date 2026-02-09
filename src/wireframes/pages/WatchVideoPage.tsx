import { useSearchParams } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'

export function WatchVideoPage() {
  const [searchParams] = useSearchParams()
  const embedUrl = searchParams.get('url')

  if (!embedUrl) {
    return (
      <WireframeLayout title="Video" showBack>
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--wf-gray-600)' }}>
          No video URL provided.
        </div>
      </WireframeLayout>
    )
  }

  return (
    <WireframeLayout title="Video" showBack>
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%', // 16:9
          height: 0,
          overflow: 'hidden',
          background: 'var(--wf-gray-900)',
        }}
      >
        <iframe
          title="Video"
          src={embedUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </WireframeLayout>
  )
}
