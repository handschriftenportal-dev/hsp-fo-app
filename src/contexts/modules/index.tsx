/**
 * This file sets up the web modules (search, workspace, projects) and provides
 * functions to integrate the modules into the app flow.
 */
import {
  HspWorkspace,
  WorkspaceResource,
} from 'hsp-fo-workspace/declaration/types'
import { AnyWebModule, WebModuleLocation } from 'hsp-web-module'
import urlJoin from 'proper-url-join'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import { getWebModuleLanguage, useTranslation } from 'src/contexts/i18n'
import { searchSelectors } from 'src/contexts/selectors'
import { relative } from 'src/utils'

import { actions } from '../actions/actions'
import { searchActions } from '../actions/searchActions'
import { useFeatureFlags } from '../features'
import { createWorkspace } from './workspace'

export interface HspModules {
  workspace: HspWorkspace
}

/**
 * Creates instances of the web modules used in the app.
 */
export function createHspModules(): HspModules {
  /**
   * Callback function for the modules that determines how
   * absolute urls are built.
   *
   * See: https://code.dev.sbb.berlin/HSP/hsp-web-module#47-routing
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
    workspace: createWorkspace(makeCreateAbsoluteURL('/workspace')),
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
 * Listens for events dispatched by the workspace and performs
 * the respective actions.
 *
 * See: https://code.dev.sbb.berlin/HSP/hsp-web-module#34-events
 * See also the event API documentation of the modules.
 */
export function useWireModules() {
  const { workspace } = useModules()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const selectedResources = useSelector(searchSelectors.getSelectedResources)
  const [selectedRes, setSelectedRes] = useState(selectedResources)

  useEffect(() => {
    setSelectedRes(selectedResources)
  }, [selectedResources])

  /**
   * Helper function to add a resource to search if not already selected.
   */
  function addResourceToSearch({ manifestId, type }: WorkspaceResource): void {
    if (!manifestId) return

    const ids = selectedRes.map(({ id }) => id)
    if (!ids.includes(manifestId)) {
      const newResources = [
        ...selectedRes,
        { id: manifestId, query: undefined, type },
      ]
      setSelectedRes(newResources)
      dispatch(searchActions.setSelectedResources(newResources))
    }
  }

  /**
   * A helper function that validates if the resource is not already present
   * in the selected resources of the search module, otherwise add it.
   */
  function removeResourceFromSearch(resourceId: string | undefined) {
    const updatedResources = selectedRes.filter((r) => r.id !== resourceId)
    setSelectedRes(updatedResources)
    dispatch(searchActions.setSelectedResources(updatedResources))
  }

  /**
   * Helper function to update the workspace badge count.
   */
  function updateBadgeCount() {
    dispatch(actions.setWorkspaceBadgeCount(workspace.getResources().length))
  }

  useEffect(() => {
    function handleResourceAdded(e: CustomEvent) {
      const res = e.detail
      e.preventDefault()
      if (res.manifestId) {
        const permalink = createWorkspacePermalink(res.type, res.manifestId)
        workspace.addResource({ ...res, permalink })
        addResourceToSearch(res)
        updateBadgeCount()
      }
    }

    function handleResourceUpdated(e: CustomEvent) {
      const res = e.detail
      e.preventDefault()
      addResourceToSearch(res)
    }

    function handleResourceRemoved(e: CustomEvent) {
      dispatch(actions.setIsMiradorMaximized(false))
      const resources = workspace.getResources()
      const isLastInstanceOfResourceRemoved =
        resources.filter(({ manifestId }) => e.detail.manifestId === manifestId)
          .length === 1

      if (e.detail.type.includes('description')) {
        removeResourceFromSearch(e.detail.id)
      } else if (isLastInstanceOfResourceRemoved) {
        removeResourceFromSearch(e.detail.manifestId)
      }

      setTimeout(updateBadgeCount)
    }

    // Function to handle window size changes in Mirador
    function handleWindowSizeChanged(e: CustomEvent) {
      const isMiradorMaximized = e.detail === 'maximized'
      dispatch(actions.setIsMiradorMaximized(isMiradorMaximized))
    }

    function navigateToKodPage(e: CustomEvent) {
      const { hspobjectid } = e.detail
      navigate(`/search?hspobjectid=${hspobjectid}&fromWorkspace=true`, {
        preventScrollReset: true,
      })
    }

    function navigateToAuthorityPage(e: CustomEvent) {
      const { authorityfileid } = e.detail
      navigate(
        `/authority-files?authorityfileid=${authorityfileid}&fromWorkspace=true`,
        {
          preventScrollReset: true,
        },
      )
    }
    // Add event listeners
    const removeFns = [
      workspace.addEventListener(
        'openResourceInSearchClicked',
        navigateToKodPage,
      ),
      workspace.addEventListener(
        'openAuthorityIdInSearchClicked',
        navigateToAuthorityPage,
      ),
      workspace.addEventListener('resourceAddedToMirador', handleResourceAdded),
      workspace.addEventListener(
        'miradorResourceUpdated',
        handleResourceUpdated,
      ),
      workspace.addEventListener(
        'resourceRemovedFromMirador',
        handleResourceRemoved,
      ),
      workspace.addEventListener(
        'miradorWindowSizeChanged',
        handleWindowSizeChanged,
      ),
    ]

    // Cleanup listeners on unmount
    return () => {
      removeFns.forEach((removeFn) => removeFn())
    }
  }, [selectedRes, workspace])
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
  const { workspace } = modules
  const selectedResources = useSelector(searchSelectors.getSelectedResources)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    // Check that self routing of the modules is turned off.
    // I.e. the app will have full control over routing.
    Object.values(modules).forEach((m: AnyWebModule) => {
      if (m.getConfig().enableRouting) {
        throw new Error(
          'startRouting: routing must be disabled for the modules.',
        )
      }
    })

    // Collects listener removal functions.
    const removeFns: (() => void)[] = []

    Object.values(modules).forEach((m: AnyWebModule) => {
      // If a user clicks on a link (or link button) within a module's ui
      removeFns.push(
        m.addEventListener('linkClicked', (e) => {
          // then prevent the browser from handle the link click
          e.preventDefault()
          // and let React Router change to this route.
          navigate(relative(e.detail.href), { preventScrollReset: true })
        }),
      )
    })

    removeFns.push(() =>
      workspace.addEventListener('openResourceInSearchClicked', (e: any) => {
        const { hspobjectid } = e.detail
        navigate(`/search?hspobjectid=${hspobjectid}&fromWorkspace=true`, {
          preventScrollReset: true,
        })
      }),
    )

    removeFns.push(() =>
      workspace.addEventListener('openAuthorityIdInSearchClicked', (e: any) => {
        const { authorityfileid } = e.detail
        navigate(`/authority-files?authorityfileid=${authorityfileid}`, {
          preventScrollReset: true,
        })
      }),
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
    if (location.pathname.startsWith('/workspace')) {
      const params = new URLSearchParams(location.search)
      const type = params.get('type') as
        | 'hsp:description'
        | 'hsp:description_retro'
        | 'iiif:manifest'
      const id = params.get('id')
      const page = params.get('page') as unknown as number

      if (type && id) {
        const permalink = createWorkspacePermalink(type, id)
        if (type.includes('description')) {
          workspace.addResource({ id, type, permalink })
        } else {
          workspace.addResource({
            type,
            manifestId: id,
            // canvasIndex is zero-based, page is 1-based
            canvasIndex: page ? page - 1 : undefined,
            permalink,
            id: 'hsp-window-' + uuidv4(),
          })
        }

        dispatch(
          actions.setWorkspaceBadgeCount(workspace.getResources().length),
        )
      }

      navigate('/workspace', { preventScrollReset: true })
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
