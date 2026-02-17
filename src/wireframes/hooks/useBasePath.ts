import { useLocation } from 'react-router-dom'

/**
 * Returns the base path prefix for links in the wireframe app.
 * When accessed via /demo/*, returns "/demo".
 * When accessed via /* (ProductApp), returns "".
 */
export function useBasePath(): string {
  const { pathname } = useLocation()
  return pathname.startsWith('/demo') ? '/demo' : ''
}
