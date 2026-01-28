/**
 * Detects which domain/site should be displayed
 * Priority: query param > localStorage > env var > hostname > default
 */
export type DomainType = 'anvega' | 'tara'

const DOMAIN_STORAGE_KEY = 'anvega_domain_preference'

export function detectDomain(): DomainType {
  const hostname = window.location.hostname.toLowerCase()
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  
  // 1. Check query parameter (for local testing) - highest priority
  const urlParams = new URLSearchParams(window.location.search)
  const queryDomain = urlParams.get('domain')
  if (queryDomain === 'anvega' || queryDomain === 'tara') {
    // Store in localStorage to persist across navigation
    try {
      localStorage.setItem(DOMAIN_STORAGE_KEY, queryDomain)
    } catch (e) {
      // localStorage might not be available
    }
    return queryDomain as DomainType
  }

  // 2. Check hostname (production) - check this before localStorage
  if (hostname.includes('anvega.ai')) {
    return 'anvega'
  }
  if (hostname.includes('mytara.care')) {
    return 'tara'
  }

  // 3. For localhost: only use localStorage if there was a query param before
  // If no query param on localhost, default to tara (don't use stored preference)
  if (isLocalhost) {
    // On localhost without query param, default to tara
    // This prevents stored preferences from persisting when user doesn't want them
    return 'tara'
  }

  // 4. For non-localhost (but not production domains), check localStorage
  try {
    const storedDomain = localStorage.getItem(DOMAIN_STORAGE_KEY)
    if (storedDomain === 'anvega' || storedDomain === 'tara') {
      return storedDomain as DomainType
    }
  } catch (e) {
    // localStorage might not be available
  }

  // 5. Check environment variable (for development)
  const envDomain = import.meta.env.VITE_FORCE_DOMAIN
  if (envDomain === 'anvega' || envDomain === 'tara') {
    return envDomain as DomainType
  }

  // 6. Default to tara
  return 'tara'
}

/**
 * Gets the current domain query parameter to preserve in navigation
 */
export function getDomainQueryParam(): string {
  const hostname = window.location.hostname.toLowerCase()
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  
  // Only return query param if it's explicitly in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const queryDomain = urlParams.get('domain')
  
  if (queryDomain === 'anvega' || queryDomain === 'tara') {
    return `?domain=${queryDomain}`
  }
  
  // On localhost, don't use stored preference - only use explicit query param
  // This prevents unwanted persistence
  if (isLocalhost) {
    return ''
  }
  
  // For non-localhost, we could use stored preference, but for now
  // only use explicit query params
  return ''
}
