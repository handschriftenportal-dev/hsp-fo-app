/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React from 'react'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import {
  selectors,
  useSelector,
  useDispatch,
  actions,
} from 'src/contexts/state'
import { useFeatureFlags } from 'src/contexts/features'
import { usePageName } from 'src/contexts/pageName'
import { useTranslation } from 'src/contexts/i18n'
import { useModules } from 'src/contexts/modules'
import { AnyWebModule } from 'hsp-web-module'
import { CmsMenu } from './CmsMenu'
import { MenuItem } from './MenuItem'

interface Props {
  className?: string
  mobile: boolean
}

export function Menu(props: Props) {
  const { t } = useTranslation()
  const modules = useModules()
  const dispatch = useDispatch()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const workspaceBadgeCount = useSelector(selectors.getWorkspaceBadgeCount)
  const pageName = usePageName()
  const featureFlags = useFeatureFlags()

  const getHref = (m: AnyWebModule) =>
    m.getConfig().createAbsoluteURL(m.getLocation()).href

  return (
    <List
      className={props.className}
      id="sideBar"
      tabIndex={-1}
      component="nav"
    >
      <MenuItem
        href={getHref(modules.home)}
        icon="home"
        label={t('sidebar.pages.home')}
        selected={pageName === 'home'}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      />
      <Divider />
      <MenuItem
        href={getHref(modules.search)}
        icon="search"
        label={t('sidebar.pages.search')}
        selected={pageName === 'search'}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      />
      <Divider />
      {/* Projects */}
      {featureFlags.cms && (
        <>
          <MenuItem
            href={getHref(modules.projects)}
            icon="groups"
            label={t('sidebar.pages.projects')}
            selected={pageName === 'projects'}
            showTooltip={!sideBarOpen}
            level={0}
            onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
          />
          <Divider />
        </>
      )}
      <MenuItem
        href={getHref(modules.workspace)}
        icon="dashboard"
        label={t('sidebar.pages.workspace')}
        selected={pageName === 'workspace'}
        badgeCount={workspaceBadgeCount}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      />
      <Divider />
      {pageName === 'workspace' && (
        <>
          <MenuItem
            onClick={() => {
              modules.workspace.toggleAlbum()
              props.mobile && dispatch(actions.toggleSidebar())
            }}
            icon="collections"
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
            icon="more_vert"
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
      {featureFlags.cms && <CmsMenu mobile={props.mobile} />}
      <Divider />
    </List>
  )
}
