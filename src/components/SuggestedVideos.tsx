import { Youtube } from 'lucide-react'
import type { SuggestedVideo } from '../types'
import './SuggestedVideos.css'

interface SuggestedVideosProps {
  videos: SuggestedVideo[]
}

function formatTimestamp(seconds: number | null): string {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function SuggestedVideos({ videos }: SuggestedVideosProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  // Take up to 3 videos
  const displayVideos = videos.slice(0, 3)

  return (
    <div className="suggested-videos-section">
      <div className="suggested-videos-header">
        <Youtube size={18} className="suggested-videos-icon" />
        <span>Related Videos</span>
      </div>
      <div className="suggested-videos-divider" />
      <div className="suggested-videos-grid">
        {displayVideos.map((video) => {
          // Build YouTube embed URL with optional start time
          const startParam = video.timestamp_seconds ? `?start=${video.timestamp_seconds}` : ''
          const embedUrl = `https://www.youtube.com/embed/${video.video_id}${startParam}`

          return (
            <div key={video.video_id} className="suggested-video-embed-card">
              <div className="suggested-video-embed-wrapper">
                <iframe
                  src={embedUrl}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="suggested-video-iframe"
                />
              </div>
              <div className="suggested-video-info">
                <h4 className="suggested-video-title">{video.title}</h4>
                {video.channel_name && (
                  <p className="suggested-video-channel">{video.channel_name}</p>
                )}
                {video.timestamp_seconds !== null && video.timestamp_seconds > 0 && (
                  <p className="suggested-video-timestamp">
                    Starts at {formatTimestamp(video.timestamp_seconds)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
