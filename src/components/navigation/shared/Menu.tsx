import { AnyWebModule } from 'hsp-web-module'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'

import Divider from '@mui/material/Divider'
import List from '@mui/material/List'

import { actions } from 'src/contexts/actions/actions'
import { searchActions } from 'src/contexts/actions/searchActions'
import { useFeatureFlags } from 'src/contexts/features'
import { useTranslation } from 'src/contexts/i18n'
import { useModules } from 'src/contexts/modules'
import {
  catalogSelectors,
  searchSelectors,
  selectors,
} from 'src/contexts/selectors'
import { getSearchHref } from 'src/utils/getSearchHref'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import { CmsMenu } from './CmsMenu'
import { MenuItem } from './MenuItem'

interface Props {
  className?: string
  mobile: boolean
}

export function Menu(props: Readonly<Props>) {
  const { t } = useTranslation()
  const modules = useModules()
  const dispatch = useDispatch()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const workspaceBadgeCount = useSelector(selectors.getWorkspaceBadgeCount)
  const isMiradorAddVisible = useSelector(selectors.getIsMiradorAddVisible)

  const location = useLocation()
  const featureFlags = useFeatureFlags()
  const getHref = (m: AnyWebModule) =>
    m.getConfig().createAbsoluteURL(m.getLocation()).href
  const rememberedSearchParams = useSelector(searchSelectors.getSearchParams)
  const liveSearchParams = useParsedSearchParams()
  const catalogFq = useSelector(catalogSelectors.getCatalogModifiedFilterQuery)
  const catalogQ = useSelector(catalogSelectors.getCatalogSearchTerm)

  // On /search the live URL is the source of truth for the search link.
  // Reading it directly avoids the lag of the Redux mirror, which is synced in
  // a post-paint effect (Search.tsx) and otherwise freezes the link on the
  // previous params when the user navigates away before that effect commits.
  // Off /search the URL no longer carries the result-list params, so fall back
  // to the remembered last search in Redux.
  const searchHref = getSearchHref(
    location.pathname === '/search' ? liveSearchParams : rememberedSearchParams,
  )
  const catalogHref = catalogFq
    ? `/catalogs?${toSearchParams({ q: catalogQ, fq: catalogFq })}`
    : '/catalogs'

  // Fires synchronously on a sidebar link click, before navigation. When
  // leaving /search it stamps the live URL into the cross-route memory that the
  // sidebar "Search" link reads off-route, so returning to the search reflects
  // the latest result list - even if the user navigates away before the Search
  // page's post-paint sync effect commits (and regardless of the SearchBar
  // effect, which resets the mirror's start to 0 while on the list).
  const handlePageNavigation = () => {
    if (location.pathname === '/search') {
      dispatch(searchActions.setSearchParams(liveSearchParams))
    }
    if (props.mobile) {
      dispatch(actions.toggleSidebar())
    }
  }

  return (
    <List
      className={props.className}
      id="sideBar"
      tabIndex={-1}
      component="nav"
    >
      <MenuItem
        href={'/'}
        icon="home"
        label={t('sidebar.pages.home')}
        selected={location.pathname === '/'}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={handlePageNavigation}
      />
      <Divider />
      <MenuItem
        href={searchHref}
        icon="search"
        label={t('sidebar.pages.search')}
        selected={location.pathname.includes('search')}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={handlePageNavigation}
      />
      <Divider />
      {featureFlags.catalogs && (
        <MenuItem
          href={catalogHref}
          icon="catalogs"
          label={t('sidebar.pages.catalogs')}
          selected={location.pathname.includes('/catalogs')}
          showTooltip={!sideBarOpen}
          level={0}
          onClick={handlePageNavigation}
        />
      )}
      <Divider />
      <MenuItem
        href={getHref(modules.workspace)}
        icon="dashboard"
        label={t('sidebar.pages.workspace')}
        selected={location.pathname.includes('/workspace')}
        badgeCount={workspaceBadgeCount}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={handlePageNavigation}
      />
      <Divider />
      {location.pathname.includes('/workspace') && (
        <>
          <MenuItem
            onClick={() => {
              modules.workspace.setJumpToWindowDialogOpen(true)
              if (props.mobile) dispatch(actions.toggleSidebar())
            }}
            icon="burstMode"
            label={t('sidebar.workspaceTools.openWindows')}
            showTooltip={!sideBarOpen}
            level={1}
          />
          <MenuItem
            onClick={() => {
              modules.workspace.toggleAlbum()
              if (props.mobile) dispatch(actions.toggleSidebar())
            }}
            icon="library"
            label={t('sidebar.workspaceTools.addContent')}
            showTooltip={!sideBarOpen}
            selected={isMiradorAddVisible}
            level={1}
            id={'externalWorkspace'}
          />
          <MenuItem
            onClick={() => {
              modules.workspace.setWindowTypeDialogOpen(true)
              if (props.mobile) dispatch(actions.toggleSidebar())
            }}
            icon="settings"
            label={t('sidebar.workspaceTools.viewMode')}
            showTooltip={!sideBarOpen}
            level={1}
          />
          <MenuItem
            onClick={() => {
              modules.workspace.setFullscreen()
              if (props.mobile) dispatch(actions.toggleSidebar())
            }}
            icon="fullscreen"
            label={t('sidebar.workspaceTools.fullscreen')}
            showTooltip={!sideBarOpen}
            level={1}
          />
          <Divider />
        </>
      )}
      {/* Projects & CMS */}
      <MenuItem
        href={'/projects'}
        icon="projects"
        label={t('sidebar.pages.projects')}
        selected={location.pathname.includes('/projects')}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={handlePageNavigation}
      />
      <Divider />
      <CmsMenu mobile={props.mobile} />
      <Divider />
    </List>
  )
}
