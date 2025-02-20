import { useLocation } from 'react-router-dom'

export function useGetLocationType() {
  const location = useLocation()
  const locationPath = location.pathname.includes('catalogs')
    ? 'catalogs'
    : 'objects'

  return locationPath
}
