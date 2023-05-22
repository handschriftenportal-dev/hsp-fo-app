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

import { HspWorkspace, Config } from 'hsp-fo-workspace/types'
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

    createArea: () => {},
    deleteArea: () => {},
    setCurrentArea: () => {},
    getAreaNames: () => undefined as any,
    getCurrentAreaName: () => undefined as any,
    setFullscreen: () => {},
    toggleAlbum: () => {},
    setWindowType: () => {},
    setWindowTypeDialogOpen: () => {},
  }
}
