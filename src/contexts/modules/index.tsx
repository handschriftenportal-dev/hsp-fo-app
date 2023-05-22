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

/**
 * This file sets up the web modules (home, search, workspace, cms) and provides
 * functions to integrate the modules into the app flow.
 */

import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useReducer,
} from 'react'
import urlJoin from 'proper-url-join'
import { useHistory, useLocation } from 'react-router'
import { WebModuleLocation, AnyWebModule } from 'hsp-web-module'

import { relative } from 'src/utils/relative'
import { actions, useDispatch } from 'src/contexts/state'
import { getWebModuleLanguage, useTranslation } from 'src/contexts/i18n'
import { useTracker } from 'src/contexts/tracking'
import { useFeatureFlags } from '../features'

import { HspHome } from 'hsp-fo-home/types'
import { HspSearch } from 'hsp-fo-search/types'
import { HspWorkspace } from 'hsp-fo-workspace/types'
import { HspCms } from 'hsp-fo-cms/types'
import { HspProjects } from 'hsp-fo-projects/types'

import { createHome } from './home'
import { createSearch } from './search'
import { createWorkspace } from './workspace'
import { createCms } from './cms'
import { createProjects } from './projects'

export interface HspModules {
  home: HspHome
  search: HspSearch
  workspace: HspWorkspace
  cms: HspCms
  projects: HspProjects
}

/**
 * Creates instances of the web modules used in the app.
 */
export function createHspModules(): HspModules {
  /**
   * Callback function for the modules that determines how
   * absolute urls are built.
   *
   * See: https://code.dev.sbb.berlin/HSP/hsp-web-module#27-routing
   */
  function makeCreateAbsoluteURL(mountPath: string) {
    return function ({ pathname, search, hash }: WebModuleLocation) {
      const url = new URL(urlJoin(mountPath, pathname), location.origin)
      url.search = search
      url.hash = hash
      return url
    }
  }

  return {
    home: createHome(makeCreateAbsoluteURL('/')),
    search: createSearch(makeCreateAbsoluteURL('/search')),
    workspace: createWorkspace(makeCreateAbsoluteURL('/workspace')),
    cms: createCms(makeCreateAbsoluteURL('/info')),
    projects: createProjects(makeCreateAbsoluteURL('/projects')),
  }
}

/**
 * React context to make the modules available within the apps component tree.
 */
export const ModuleContext = createContext<HspModules | undefined>(undefined)

/**
 * Returns the module instances provided by the ModuleContext.
 */
export function useModules() {
  return useContext(ModuleContext) as HspModules
}

/**
 * The following hooks integrate the modules into the React app flow.
 * They all handle the general problem that the modules are plain javascript
 * objects that do not respond to React's life cycle methods.
 */

/**
 * Creates a permalink (href) of a workspace resource.
 */
export function createWorkspacePermalink(type: string, id: string) {
  const url = new URL('/workspace', window.location.origin)
  url.search = new URLSearchParams({ type, id }).toString()
  return url.href
}

/**
 * Helper to trigger rerenderings
 */
export function useForceUpdate() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  return forceUpdate
}

/**
 * Listens to language updates in the i18next object
 * and sets the new language to each module
 */
export function useUpdateLanguage() {
  const forceUpdate = useForceUpdate()
  const modules = useModules()
  const { i18n } = useTranslation()

  useEffect(() => {
    const language = getWebModuleLanguage(i18n.language)
    Object.values(modules).forEach((m: AnyWebModule) => m.setLanguage(language))
    // perform a rerendering
    forceUpdate()
  }, [i18n.language])
}

/**
 * Listens for events dispatched by the modules and performs
 * the respective actions.
 *
 * See: https://code.dev.sbb.berlin/HSP/hsp-web-module#34-events
 * See also the event API documentation of the modules.
 */
export function useWireModules() {
  const { search, workspace } = useModules()
  const dispatch = useDispatch()
  const tracker = useTracker()

  useEffect(() => {
    /**
     * For clarity and documentation purposes
     * the following code is somewhat redundant.
     */

    // Collects all listener removal functions
    const removeFns: (() => void)[] = []

    const selectOrOpenResourceClicked = (e: { detail: any }) => {
      const res = e.detail
      // then create a permalink for that resource
      const permalink = createWorkspacePermalink(res.type, res.id)
      // and add the resource info to the workspace,
      workspace.addResource({ ...res, permalink })
      // and add the resource info to the search module itself
      // so it will be marked as selected
      search.setSelectedResources([
        ...search.getSelectedResources(),
        { ...res, query: undefined }, // reset query after adding to workspace
      ])
      // and update the number in the workspace button in the sidebar.
      dispatch(actions.setWorkspaceBadgeCount(workspace.getResources().length))
    }

    // If the user clicks the select button in the resource action cards
    removeFns.push(
      search.addEventListener(
        'selectResourceClicked',
        selectOrOpenResourceClicked
      )
    )

    // If the user clicks the unselect button in the resource action cards
    removeFns.push(
      search.addEventListener('unselectResourceClicked', (e) => {
        // then remove the resource info from the workspace
        workspace.removeResource(e.detail)
        // and remove the resource info from the search module itself
        // so it becomes unmarked.
        search.setSelectedResources(
          search.getSelectedResources().filter((r) => r.id !== e.detail.id)
        )
        // and update the number in the workspace button in the sidebar.
        dispatch(
          actions.setWorkspaceBadgeCount(workspace.getResources().length)
        )
      })
    )

    /**
     * This basically performs the same actions as the "selectResourceClicked"
     * handler above.
     *
     * The page transition that is intended by the event is performed in the
     * useModuleRouting hook.
     */
    removeFns.push(
      search.addEventListener(
        'openResourceClicked',
        selectOrOpenResourceClicked
      )
    )

    // If a resource was added to Mirador by user action (e.g. album add button)
    removeFns.push(
      workspace.addEventListener('resourceAddedToMirador', (e) => {
        const res = e.detail
        // then prevent the resource from automatically getting added to the workspace state
        e.preventDefault()
        // so we can create a permalink to the resource
        const permalink = createWorkspacePermalink(res.type, res.id)
        // and manually add it to the workspace state
        workspace.addResource({ ...res, permalink })
        // then add the resource to the search module so it will be marked
        search.setSelectedResources([
          ...search.getSelectedResources(),
          e.detail,
        ])
        // and update the number in the workspace button in the sidebar.
        dispatch(
          actions.setWorkspaceBadgeCount(workspace.getResources().length)
        )
      })
    )

    // If a resource was removed form Mirador by user action (e.g. window closed button)
    removeFns.push(
      workspace.addEventListener('resourceRemovedFromMirador', (e) => {
        // then remove the resource info from the search module itself
        // so it becomes unmarked.
        search.setSelectedResources(
          search.getSelectedResources().filter((r) => r.id !== e.detail.id)
        )
        // and update the number in the workspace button in the sidebar.
        const updateBadge = () =>
          dispatch(
            actions.setWorkspaceBadgeCount(workspace.getResources().length)
          )
        // Defer badge update unit the event was processed by the workspace
        setTimeout(updateBadge)
      })
    )

    // If the user clicks the search button to perform a search
    removeFns.push(
      search.addEventListener('searchButtonClicked', (e) => {
        // then track that event and the search term.
        tracker.trackSiteSearch('Search', e.detail)
      })
    )

    // This runs when the calling component will be unmounted.
    return () => {
      // Remove all event listeners added above.
      removeFns.forEach((remove) => remove())
    }
  }, [])
}

/**
 * 1) Listens for routing events dispatched by the modules and
 * routes the app to the respective location.
 *
 * 2) Listens for route updates of the app and updates the web
 * module locations of the modules.
 *
 * See https://code.dev.sbb.berlin/HSP/hsp-web-module#27-routing
 */
export function useModuleRouting() {
  const forceUpdate = useForceUpdate()
  const modules = useModules()
  const { home, search, workspace, cms, projects } = modules
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    // Check that self routing of the modules is turned of.
    // I.e. the app will have full control over routing.
    Object.values(modules).forEach((m: AnyWebModule) => {
      if (m.getConfig().enableRouting) {
        throw new Error(
          'startRouting: routing must be disabled for the modules.'
        )
      }
    })

    // Collects listener removal functions.
    const removeFns: (() => void)[] = []

    Object.values(modules).forEach((m: AnyWebModule) => {
      // If a use clicks on a link (or link button) within a module's ui
      removeFns.push(
        m.addEventListener('linkClicked', (e) => {
          // then prevent the browser from handle the link click
          e.preventDefault()
          // and let React Router change to this route.
          history.push(relative(e.detail.href))
        })
      )
    })

    /**
     * NOTE: This event is handled in useWireModule too.
     *
     * If the user clicks on a resource to open it in the workspace
     */
    removeFns.push(
      search.addEventListener('openResourceClicked', () => {
        // than get the current url of the workspace module
        const workspaceHref = workspace
          .getConfig()
          .createAbsoluteURL(workspace.getLocation()).href
        // and let React Router change to this route.
        history.push(relative(workspaceHref))
      })
    )

    // This runs when the calling component will be unmounted.
    return () => {
      // Remove all event listeners added above.
      removeFns.forEach((remove) => remove())
    }
  }, [])

  // If the route of the app has changed (see the dependency list of this effect)
  // then check what module was targeted and update it's web module location.
  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      search.setLocation({
        // Cut the mount path from the url
        // because this is not relevant to the module.
        pathname: location.pathname.replace('/search', ''),
        hash: location.hash,
        search: location.search,
      })
    } else if (location.pathname.startsWith('/workspace')) {
      const params = new URLSearchParams(location.search)
      const type = params.get('type') as any
      const id = params.get('id')

      if (type && id) {
        const permalink = createWorkspacePermalink(type, id)
        workspace.addResource({ type, id, permalink })
        dispatch(
          actions.setWorkspaceBadgeCount(workspace.getResources().length)
        )
      }

      history.replace('/workspace')
    } else if (location.pathname.startsWith('/info')) {
      cms.setLocation({
        pathname: location.pathname.replace('/info', ''),
        hash: location.hash,
        search: location.search,
      })
    } else if (location.pathname.startsWith('/projects')) {
      projects.setLocation({
        pathname: location.pathname.replace('/projects', ''),
        hash: location.hash,
        search: location.search,
      })
    } else {
      home.setLocation({
        pathname: location.pathname,
        hash: location.hash,
        search: location.search,
      })
    }

    // perform a rerendering
    forceUpdate()
  }, [location.pathname, location.search, location.hash])
}

function useUpdateFeatures() {
  const features = useFeatureFlags()
  const modules = useModules()
  useEffect(() => {
    Object.values(modules).forEach((module) => {
      if (module.setFeatures) {
        module.setFeatures(features)
      }
    })
  }, [features.isLoaded])
}

/**
 * Unmounts all modules if the calling component gets unmounted.
 */
export function useUnmountModulesOnExit() {
  const modules = useModules()

  /**
   * Using the layout effect ensures that the effect performs
   * before the DOM nodes disappears. This is neccesary for the
   * workspace module because Mirador queries for its container
   * node while unmounting.
   *
   * See: https://github.com/ProjectMirador/mirador/blob/master/src/lib/MiradorViewer.js#L43
   */
  useLayoutEffect(() => {
    return () => {
      modules.workspace.unmount()
      modules.search.unmount()
      modules.home.unmount()
      modules.cms.unmount()
      modules.projects.unmount()
    }
  }, [])
}

/**
 * Performs all of the above hooks at once.
 *
 * It is meant to be used by the page components that assemble
 * a page that consists of one or multiple modules and other components.
 *
 * When a page gets unmounted then module related stuff will be cleared:
 *    - listeners will be removed
 *    - all modules will be unmounted
 */
export function useSetupModulesForPage() {
  // order matters
  useUpdateLanguage()
  useUpdateFeatures()
  useWireModules()
  useModuleRouting()
  useUnmountModulesOnExit()
}
