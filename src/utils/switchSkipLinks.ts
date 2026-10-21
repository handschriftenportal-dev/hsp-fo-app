import {
  basicSkipLinks,
  catalogOverviewSkipLinks,
  homeSkipLinks,
  projectOverviewSkipLinks,
  searchDetailPageSkipLinks,
  searchOverviewSkipLinks,
} from 'src/components/navigation/config'

export function switchSkiplinks(pathname: string, search: string) {
  const path = pathname + search
  if (path === '/') {
    return homeSkipLinks
  } else if (path.includes('hspobjectid')) {
    return searchDetailPageSkipLinks
  } else if (path.includes('search')) {
    return searchOverviewSkipLinks
  } else if (path === '/projects') {
    return projectOverviewSkipLinks
  } else if (path.includes('catalogs')) {
    return catalogOverviewSkipLinks
  } else {
    return basicSkipLinks
  }
}
