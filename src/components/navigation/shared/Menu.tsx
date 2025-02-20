import { AnyWebModule } from 'hsp-web-module'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'

import { actions } from 'src/contexts/actions/actions'
import { useFeatureFlags } from 'src/contexts/features'
import { useTranslation } from 'src/contexts/i18n'
import { useModules } from 'src/contexts/modules'
import {
  catalogSelectors,
  searchSelectors,
  selectors,
} from 'src/contexts/selectors'
import { getSearchHref } from 'src/utils/getSearchHref'
import { toSearchParams } from 'src/utils/searchparams'

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
  const location = useLocation()
  const featureFlags = useFeatureFlags()
  const getHref = (m: AnyWebModule) =>
    m.getConfig().createAbsoluteURL(m.getLocation()).href
  const searchParams = useSelector(searchSelectors.getSearchParams)
  const catalogFq = useSelector(catalogSelectors.getCatalogModifiedFilterQuery)

  const searchHref = getSearchHref(searchParams)
  const catalogHref = catalogFq
    ? `/catalogs?${toSearchParams({ fq: catalogFq })}`
    : '/catalogs'

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
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      />
      <Divider />
      <MenuItem
        href={searchHref}
        icon="search"
        label={t('sidebar.pages.search')}
        selected={location.pathname.includes('search')}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
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
          onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
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
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      />
      <Divider />
      {location.pathname.includes('/workspace') && (
        <>
          <MenuItem
            onClick={() => {
              modules.workspace.setJumpToWindowDialogOpen(true)
              props.mobile && dispatch(actions.toggleSidebar())
            }}
            icon="burstMode"
            label={t('sidebar.workspaceTools.openWindows')}
            showTooltip={!sideBarOpen}
            level={1}
          />
          <MenuItem
            onClick={() => {
              modules.workspace.toggleAlbum()
              props.mobile && dispatch(actions.toggleSidebar())
            }}
            icon="library"
            label={t('sidebar.workspaceTools.addContent')}
            showTooltip={!sideBarOpen}
            level={1}
            id={'externalWorkspace'}
          />
          <MenuItem
            onClick={() => {
              modules.workspace.setWindowTypeDialogOpen(true)
              props.mobile && dispatch(actions.toggleSidebar())
            }}
            icon="settings"
            label={t('sidebar.workspaceTools.viewMode')}
            showTooltip={!sideBarOpen}
            level={1}
          />
          <MenuItem
            onClick={() => {
              modules.workspace.setFullscreen()
              props.mobile && dispatch(actions.toggleSidebar())
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
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      />
      <Divider />
      <CmsMenu mobile={props.mobile} />
      <Divider />
    </List>
  )
}
