/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import urlJoin from 'proper-url-join'
import { WebModuleLocation } from 'hsp-web-module'
import { Context, Modules } from './types'
import { createTracker } from './tracking'
import { createI18n } from './i18n'
import { fetchFeatureFlags } from './features'
import { createNavigation } from './modules/navigation'
import { createHome } from './modules/home'
import { createSearch } from './modules/search'
import { createWorkspace } from './modules/workspace'
import { createCms } from './modules/cms'
import { renderHomePage } from './pages/home'
import { renderSearchPage } from './pages/search'
import { renderWorkspacePage } from './pages/workspace'
import { renderCmsPage } from './pages/cms'
import { createMenuController } from './menu'


function makeCreateAbsoluteURL(mountPath: string) {
  return function({ path, params, hash }: WebModuleLocation) {
    const url = new URL(urlJoin(mountPath, path), location.origin)
    url.search = params.toString()
    url.hash = hash
    return url
  }
}

export async function setup(): Promise<Context> {
  const appEvents = new EventTarget()
  const i18n = await createI18n()
  const tracker = createTracker()
  const appContainer = document.getElementById('app')
  const featureFlags = await fetchFeatureFlags()

  const modules: Modules = {
    navigation: createNavigation(makeCreateAbsoluteURL('')),
    home: createHome(makeCreateAbsoluteURL('/')),
    search: createSearch(makeCreateAbsoluteURL('/search')),
    workspace: createWorkspace(makeCreateAbsoluteURL('/workspace')),
    cms: createCms(makeCreateAbsoluteURL('/cms'))
  }

  const menuController = createMenuController(modules, i18n, featureFlags)

  // Order matters: Route matching works with `startswith`.
  // The most general route should come last.
  const routingTable: Context['routingTable'] = {}
  routingTable['/search'] = renderSearchPage
  routingTable['/workspace'] = renderWorkspacePage
  if (featureFlags.cms) {
    routingTable['/cms'] = renderCmsPage
  }
  routingTable['/'] = renderHomePage

  if (!appContainer) {
    throw new Error('setup: could not find app container elemente.')
  }

  const context: Context = {
    modules,
    routingTable,
    appContainer,
    appEvents,
    tracker,
    i18n,
    featureFlags,
    menuController,
  }

  return context
}
