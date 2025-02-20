import { Config, HspWorkspace } from 'hsp-fo-workspace/declaration/types'
import { WebModuleLanguage, WebModuleLocation } from 'hsp-web-module'

type WorkspaceResource = ReturnType<HspWorkspace['getResources']>[0]

export function createHspWorkspace(config: Config): HspWorkspace {
  const eventTarget = new EventTarget()
  let resources: WorkspaceResource[] = []
  let _isMounted = false
  let language: WebModuleLanguage = 'de'
  let location: WebModuleLocation = {
    pathname: '/',
    search: '',
    hash: '',
  }

  return {
    eventTarget,
    addEventListener: (type: string, listener: any) => {
      eventTarget.addEventListener(type, listener)
      return () => {
        eventTarget.removeEventListener(type, listener)
      }
    },

    isMounted: () => _isMounted,

    mount: () => {
      _isMounted = true
      return Promise.resolve()
    },

    unmount: () => {
      _isMounted = false
      return true
    },

    getConfig: () => config as Required<Config>,
    setState: () => {},
    getState: () => undefined as any,

    getLanguage: () => language,
    setLanguage: (lang: WebModuleLanguage) => {
      language = lang
    },

    getLocation: () => location,
    setLocation: (loc: WebModuleLocation) => {
      location = loc
    },

    getResources: () => resources,
    addResource: (resource: WorkspaceResource) => {
      resources.push(resource)
    },
    removeResource: (resource: WorkspaceResource) => {
      resources = resources.filter((r) => r.id !== resource.id)
    },
    removeResources: (manifestId) => {
      resources = resources.filter((r) => r.manifestId !== manifestId)
    },

    createArea: () => {},
    deleteArea: () => {},
    setCurrentArea: () => {},
    getAreaNames: () => undefined as any,
    addAnnotation: () => {},
    getAnnotation: () => undefined as any,
    getCurrentAreaName: () => undefined as any,
    setFullscreen: () => {},
    toggleAlbum: () => {},
    setJumpToWindowDialogOpen: () => {},
    setWindowType: () => {},
    setWindowTypeDialogOpen: () => {},
  }
}
