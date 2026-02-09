/**
 * Convert common YouTube URLs to the embed format for in-app playback.
 */
export function youtubeToEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname === 'www.youtube.com' && u.pathname === '/watch' && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1).split('?')[0]
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    if (u.hostname === 'www.youtube.com' && u.pathname.startsWith('/shorts/')) {
      const id = u.pathname.replace('/shorts/', '').replace(/\/$/, '')
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
  } catch {
    // ignore
  }
  return url
}
