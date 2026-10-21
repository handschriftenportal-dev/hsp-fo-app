import { describe, expect, test } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { WorkspaceResource } from 'hsp-fo-workspace/declaration/types'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { makeStore } from 'test/testutils/makeStore'

import { initI18n, useTranslation } from 'src/contexts/i18n'
import {
  ModuleContext,
  createHspModules,
  useUnmountModulesOnExit,
  useUpdateLanguage,
  useWireModules,
} from 'src/contexts/modules'
import { searchSelectors } from 'src/contexts/selectors'
import { TrackerProvider } from 'src/contexts/tracking'

import '../../mocks'

test('createHspModules creates all hsp modules', function () {
  const { workspace } = createHspModules()
  expect(workspace.getConfig().classNamePrefix).toBe('hsp-workspace')
})

test('createHspModules passes the modules the createAbsoluteURL callback', function () {
  const { workspace } = createHspModules()
  const location = {
    pathname: '/foo',
    search: 'q=bar',
    hash: 'baz',
  }

  expect(workspace.getConfig().createAbsoluteURL(location).href).toBe(
    'http://localhost/workspace/foo?q=bar#baz',
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
    </ModuleContext.Provider>,
  )

  const { workspace } = modules

  // initial language was set to 'de'
  expect(workspace.getLanguage()).toBe('de')

  // set to 'en' via button click
  fireEvent.click(screen.getByRole('button', { name: 'set to english' }))
  expect(workspace.getLanguage()).toBe('en')
})

describe('useWireModules', function () {
  function renderAndWire() {
    const modules = createHspModules()
    const store = makeStore()

    function Test() {
      useWireModules()
      return null
    }

    render(
      <Provider store={store}>
        <TrackerProvider>
          <ModuleContext.Provider value={modules}>
            <BrowserRouter>
              <Test />
            </BrowserRouter>
          </ModuleContext.Provider>
        </TrackerProvider>
      </Provider>,
    )

    return { modules, store }
  }

  test('Fire workspace resource added to mirador event and see if it is in search state', async function () {
    const { modules, store } = renderAndWire()
    const { workspace } = modules
    const resource: WorkspaceResource = {
      id: '456',
      type: 'iiif:manifest',
      manifestId: '456',
    }

    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('resourceAddedToMirador', {
          detail: resource,
        }),
      )
    })

    await waitFor(() => {
      expect(
        searchSelectors.getSelectedResources(store.getState() as any),
      ).toEqual([{ id: resource.id, type: resource.type, query: undefined }])
      expect((store.getState() as any).app.workspaceBadgeCount).toBe(1)
      expect(workspace.getResources()).toEqual([
        {
          ...resource,
          manifestId: resource.id,
          id: workspace.getResources()[0].id,
          permalink: 'http://localhost/workspace?type=iiif%3Amanifest&id=456',
        },
      ])
    })

    // We need to manually remove the resource from workspace and our state
    // because we only pretend the remove event happened. Both calls must be
    // in the same waitFor so that act() flushes the scheduled badge-count
    // update after the resource is already removed.
    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('resourceRemovedFromMirador', {
          detail: resource,
        }),
      )
      workspace.removeResource(resource)
    })

    expect(
      searchSelectors.getSelectedResources(store.getState() as any),
    ).toEqual([])

    await waitFor(() => {
      expect((store.getState() as any).app.workspaceBadgeCount).toBe(0)
    })
  })

  test('if hsp-workspace is in sync with search while firing multiple "resourceAddedToMirador" or "resourceRemovedFromMirador', async function () {
    const { modules, store } = renderAndWire()
    const { workspace } = modules
    const description: WorkspaceResource = {
      id: '234',
      type: 'hsp:description',
      manifestId: '234',
    }

    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('resourceAddedToMirador', {
          detail: description,
        }),
      )
    })

    const manifest: WorkspaceResource = {
      id: '345',
      type: 'iiif:manifest',
      manifestId: '345',
    }

    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('resourceAddedToMirador', {
          detail: manifest,
        }),
      )
    })

    await waitFor(() => {
      expect(
        searchSelectors.getSelectedResources(store.getState() as any),
      ).toEqual([
        { id: description.id, type: description.type, query: undefined },
        { id: manifest.id, type: manifest.type, query: undefined },
      ])
      expect((store.getState() as any).app.workspaceBadgeCount).toBe(2)
      expect(workspace.getResources()).toEqual([
        {
          ...description,
          manifestId: description.id,
          id: workspace.getResources()[0].id,
          permalink: 'http://localhost/workspace?type=hsp%3Adescription&id=234',
        },
        {
          ...manifest,
          manifestId: manifest.id,
          id: workspace.getResources()[1].id,
          permalink: 'http://localhost/workspace?type=iiif%3Amanifest&id=345',
        },
      ])
    })

    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('resourceRemovedFromMirador', {
          detail: manifest,
        }),
      )
      workspace.removeResource(manifest)
    })

    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('resourceRemovedFromMirador', {
          detail: description,
        }),
      )
      workspace.removeResource(description)
    })

    expect(
      searchSelectors.getSelectedResources(store.getState() as any),
    ).toEqual([])
    await waitFor(() => {
      expect((store.getState() as any).app.workspaceBadgeCount).toBe(0)
    })
  })

  test('cancels "openAuthorityIdInSearchClicked" and navigates to the authority page', async function () {
    const { modules } = renderAndWire()
    const { workspace } = modules

    let notPrevented = true
    await waitFor(() => {
      notPrevented = workspace.eventTarget.dispatchEvent(
        new CustomEvent('openAuthorityIdInSearchClicked', {
          detail: { authorityfileid: 'NORM-123' },
          cancelable: true,
        }),
      )
    })

    // The workspace's authority links fall back to opening the portal's
    // authority page in a new tab unless the app cancels the event (refs #22401).
    expect(notPrevented).toBe(false)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/authority-files')
      expect(window.location.search).toBe(
        '?authorityfileid=NORM-123&fromWorkspace=true',
      )
    })
  })

  test('if hsp-workspace updates search while firing "miradorResourceUpdated"', async function () {
    const { modules, store } = renderAndWire()
    const { workspace } = modules

    const manifest: WorkspaceResource = {
      id: '789',
      type: 'iiif:manifest',
      manifestId: '789',
    }

    await waitFor(() => {
      workspace.eventTarget.dispatchEvent(
        new CustomEvent('miradorResourceUpdated', {
          detail: manifest,
        }),
      )
    })

    await waitFor(() => {
      expect(
        searchSelectors.getSelectedResources(store.getState() as any),
      ).toEqual([{ id: manifest.id, type: manifest.type, query: undefined }])
    })
  })
})

test('useUmountModulesOnExits unmounts all modules if the calling component unmounts', async function () {
  const modules = createHspModules()

  function Inner() {
    useUnmountModulesOnExit()

    modules.workspace.mount({ main: document.createElement('div') })

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
    </ModuleContext.Provider>,
  )

  const { workspace } = modules

  expect(workspace.isMounted()).toBe(true)

  fireEvent.click(screen.getByRole('button', { name: 'click' }))

  await waitFor(() => {
    expect(workspace.isMounted()).toBe(false)
  })
})
