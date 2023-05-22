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

// because cypress shadows some jest globals by mocha/chai globals
import { expect, test, describe } from '@jest/globals'

import React, { useState } from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'

import '../../mocks'

import { initI18n, useTranslation } from 'src/contexts/i18n'
import { TrackerContext, Tracker } from 'src/contexts/tracking'
import { makeStore } from 'src/contexts/state'

import {
  ModuleContext,
  createHspModules,
  useUpdateLanguage,
  useUnmountModulesOnExit,
  useModuleRouting,
  useWireModules,
} from 'src/contexts/modules'
import { WorkspaceResource } from 'hsp-fo-workspace/declaration/src/contexts/state'

test('createHspModules creates all hsp modules', function () {
  const { home, search, workspace, cms, projects } = createHspModules()
  expect(home.getConfig().classNamePrefix).toBe('hsp-home')
  expect(search.getConfig().classNamePrefix).toBe('hsp-search')
  expect(workspace.getConfig().classNamePrefix).toBe('hsp-workspace')
  expect(cms.getConfig().classNamePrefix).toBe('hsp-cms')
  expect(projects.getConfig().classNamePrefix).toBe('hsp-projects')
})

test('createHspModules passes the modules the createAbsoluteURL callback', function () {
  const { home, search, workspace, cms, projects } = createHspModules()
  const location = {
    pathname: '/foo',
    search: 'q=bar',
    hash: 'baz',
  }
  expect(home.getConfig().createAbsoluteURL(location).href).toBe(
    'http://localhost/foo?q=bar#baz'
  )
  expect(search.getConfig().createAbsoluteURL(location).href).toBe(
    'http://localhost/search/foo?q=bar#baz'
  )
  expect(workspace.getConfig().createAbsoluteURL(location).href).toBe(
    'http://localhost/workspace/foo?q=bar#baz'
  )
  expect(cms.getConfig().createAbsoluteURL(location).href).toBe(
    'http://localhost/info/foo?q=bar#baz'
  )
  expect(projects.getConfig().createAbsoluteURL(location).href).toBe(
    'http://localhost/projects/foo?q=bar#baz'
  )
})

test('useUpdateLanguage updates language of all modules if i18next changes', function () {
  const modules = createHspModules()
  initI18n({ lng: 'de' })

  function Test() {
    useUpdateLanguage()
    const { i18n } = useTranslation()
    return (
      <button onClick={() => i18n.changeLanguage('en')}>set to english</button>
    )
  }

  render(
    <ModuleContext.Provider value={modules}>
      <Test />
    </ModuleContext.Provider>
  )

  const { home, search, workspace, cms, projects } = modules

  // initial language was set to 'de'
  expect(home.getLanguage()).toBe('de')
  expect(search.getLanguage()).toBe('de')
  expect(workspace.getLanguage()).toBe('de')
  expect(cms.getLanguage()).toBe('de')
  expect(projects.getLanguage()).toBe('de')

  // set to 'en' via button click
  fireEvent.click(screen.getByRole('button', { name: 'set to english' }))
  expect(home.getLanguage()).toBe('en')
  expect(search.getLanguage()).toBe('en')
  expect(workspace.getLanguage()).toBe('en')
  expect(cms.getLanguage()).toBe('en')
  expect(projects.getLanguage()).toBe('en')
})

test('useModuleRouting updates the web module location of the modules', async function () {
  const modules = createHspModules()
  const store = makeStore()

  function Test() {
    useModuleRouting()
    return <Link to="/search/foo?bar=3#baz">click</Link>
  }

  render(
    <Provider store={store}>
      <ModuleContext.Provider value={modules}>
        <BrowserRouter>
          <Test />
        </BrowserRouter>
      </ModuleContext.Provider>
    </Provider>
  )

  const { search } = modules

  // inital module location
  expect(search.getLocation().pathname).toBe('/')
  expect(search.getLocation().hash).toBe('')
  expect(search.getLocation().search).toBe('')

  // click link to dispatch new route
  fireEvent.click(screen.getByRole('link', { name: 'click' }))

  await waitFor(() => {
    expect(search.getLocation().pathname).toBe('/foo')
    expect(search.getLocation().hash).toBe('#baz')
    expect(search.getLocation().search).toBe('?bar=3')
  })
})

test('useModuleRouting changes the app`s route if a module dispatches a link.', async function () {
  const modules = createHspModules()
  const store = makeStore()
  type Location = { pathname: string; search: string; hash: string }
  let location: Location

  function Test() {
    location = useLocation()
    useModuleRouting()
    return null
  }

  render(
    <Provider store={store}>
      <ModuleContext.Provider value={modules}>
        <BrowserRouter>
          <Test />
        </BrowserRouter>
      </ModuleContext.Provider>
    </Provider>
  )

  modules.search.eventTarget.dispatchEvent(
    new CustomEvent('linkClicked', {
      detail: new URL('http://localhost/baz?foo=3#bar'),
    })
  )

  await waitFor(() => {
    expect((location as Location).pathname).toBe('/baz')
    expect((location as Location).search).toBe('?foo=3')
    expect((location as Location).hash).toBe('#bar')
  })
})

describe('useWireModules', function () {
  function renderAndWire() {
    const modules = createHspModules()
    const store = makeStore()
    const tracker = new Tracker()

    function Test() {
      useWireModules()
      return null
    }

    render(
      <Provider store={store}>
        <TrackerContext.Provider value={tracker}>
          <ModuleContext.Provider value={modules}>
            <Test />
          </ModuleContext.Provider>
        </TrackerContext.Provider>
      </Provider>
    )

    return { modules, store, tracker }
  }

  test('if hsp-search fires "selectResourceClicked" or "unselectResourceClicked"', function () {
    const { modules, store } = renderAndWire()
    const { search, workspace } = modules
    const resource = { id: '123', type: 'iiif:manifest' }

    search.eventTarget.dispatchEvent(
      new CustomEvent('selectResourceClicked', {
        detail: resource,
      })
    )

    expect(workspace.getResources()).toEqual([
      {
        ...resource,
        permalink: 'http://localhost/workspace?type=iiif%3Amanifest&id=123',
      },
    ])

    expect(search.getSelectedResources()).toEqual([resource])
    expect(store.getState().workspaceBadgeCount).toBe(1)

    search.eventTarget.dispatchEvent(
      new CustomEvent('unselectResourceClicked', {
        detail: resource,
      })
    )

    expect(workspace.getResources()).toEqual([])
    expect(search.getSelectedResources()).toEqual([])
    expect(store.getState().workspaceBadgeCount).toBe(0)
  })

  test('if hsp-search fires "openResourceClicked"', function () {
    const { modules, store } = renderAndWire()
    const { search, workspace } = modules
    const resource = { id: '456', type: 'iiif:manifest' }

    search.eventTarget.dispatchEvent(
      new CustomEvent('openResourceClicked', {
        detail: resource,
      })
    )

    expect(workspace.getResources()).toEqual([
      {
        ...resource,
        permalink: 'http://localhost/workspace?type=iiif%3Amanifest&id=456',
      },
    ])
    expect(search.getSelectedResources()).toEqual([resource])
    expect(store.getState().workspaceBadgeCount).toBe(1)
  })

  test('if hsp-workspace fires "resourceAddedToMirador" or "resourceRemovedFromMirador', async function () {
    const { modules, store } = renderAndWire()
    const { search, workspace } = modules
    const resource: WorkspaceResource = { id: '456', type: 'iiif:manifest' }

    workspace.eventTarget.dispatchEvent(
      new CustomEvent('resourceAddedToMirador', {
        detail: resource,
      })
    )

    expect(search.getSelectedResources()).toEqual([resource])
    expect(store.getState().workspaceBadgeCount).toBe(1)
    expect(workspace.getResources()).toEqual([
      {
        ...resource,
        permalink: 'http://localhost/workspace?type=iiif%3Amanifest&id=456',
      },
    ])

    workspace.eventTarget.dispatchEvent(
      new CustomEvent('resourceRemovedFromMirador', {
        detail: resource,
      })
    )

    // We need to manually remove the resource from workspace
    // because be only pretend the remove event was happened.
    workspace.removeResource(resource)

    expect(search.getSelectedResources()).toEqual([])

    await waitFor(() => {
      expect(store.getState().workspaceBadgeCount).toBe(0)
    })
  })

  test('if hsp-search fires "searchButtonClicked"', function () {
    const { modules, tracker } = renderAndWire()

    jest.spyOn(tracker, 'trackSiteSearch')

    modules.search.eventTarget.dispatchEvent(
      new CustomEvent('searchButtonClicked', {
        detail: 'search term',
      })
    )

    expect(tracker.trackSiteSearch).toHaveBeenCalledWith(
      'Search',
      'search term'
    )
  })
})

test('useUmountModulesOnExits unmounts all modules if the calling component unmounts', async function () {
  const modules = createHspModules()

  function Inner() {
    useUnmountModulesOnExit()

    modules.home.mount({ main: document.createElement('div') })
    modules.workspace.mount({ main: document.createElement('div') })
    modules.cms.mount({ main: document.createElement('div') })
    modules.search.mount({ main: document.createElement('div') })
    modules.projects.mount({ main: document.createElement('div') })

    return null
  }

  function Test() {
    const [show, setShow] = useState(true)
    return (
      <>
        <button onClick={() => setShow(false)}>click</button>
        {show && <Inner />}
      </>
    )
  }

  render(
    <ModuleContext.Provider value={modules}>
      <Test />
    </ModuleContext.Provider>
  )

  const { home, search, workspace, cms, projects } = modules

  expect(home.isMounted()).toBe(true)
  expect(search.isMounted()).toBe(true)
  expect(workspace.isMounted()).toBe(true)
  expect(cms.isMounted()).toBe(true)
  expect(projects.isMounted()).toBe(true)

  fireEvent.click(screen.getByRole('button', { name: 'click' }))

  await waitFor(() => {
    expect(home.isMounted()).toBe(false)
    expect(search.isMounted()).toBe(false)
    expect(workspace.isMounted()).toBe(false)
    expect(cms.isMounted()).toBe(false)
    expect(projects.isMounted()).toBe(false)
  })
})
