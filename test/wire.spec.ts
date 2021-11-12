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

// because cypress shadows some jest globals by mocha/chai globals
import { expect, test } from '@jest/globals'
import './mocks'
import { setup } from '../src/setup'
import { wireModules } from 'src/wire'


test('initialy set language of all modules', async function() {
  const context = await setup()
  context.i18n.changeLanguage('en')

  Object.values(context.modules)
    .forEach(m => jest.spyOn(m, 'setLanguage'))

  wireModules(context)

  Object.values(context.modules)
    .forEach(m => expect(m.setLanguage).toHaveBeenCalledWith('en'))
})

test('if hsp-navigation fires "languageChange"', async function() {
  const context = await setup()
  const { navigation } = context.modules

  wireModules(context)

  Object.values(context.modules)
    .forEach(m => jest.spyOn(m, 'setLanguage'))

  navigation.eventTarget.dispatchEvent(new CustomEvent('languageChanged', {
    detail: 'en'
  }))

  Object.values(context.modules)
    .forEach(m => expect(m.setLanguage).toHaveBeenCalledWith('en'))
})

test('if hsp-navigation fires "menuItemClicked" with detail "fullscreen"', async function() {
  const context = await setup()
  const { navigation, workspace } = context.modules
  const event = new CustomEvent('menuItemClicked', {
    detail: { id: 'fullscreen' }
  })
  wireModules(context)
  jest.spyOn(workspace, 'setFullscreen')
  navigation.eventTarget.dispatchEvent(event)
  expect(workspace.setFullscreen).toHaveBeenCalled()
})

test('if hsp-navigation fires "menuItemClicked" with detail "toggleAlbum"', async function() {
  const context = await setup()
  const { navigation, workspace } = context.modules
  const event = new CustomEvent('menuItemClicked', {
    detail: { id: 'addContent' }
  })
  wireModules(context)
  jest.spyOn(workspace, 'toggleAlbum')
  navigation.eventTarget.dispatchEvent(event)
  expect(workspace.toggleAlbum).toHaveBeenCalled()
})

test('if hsp-navigation fires "menuItemClicked" with detail "viewMode"', async function() {
  const context = await setup()
  const { navigation, workspace } = context.modules
  const event = new CustomEvent('menuItemClicked', {
    detail: { id: 'viewMode' }
  })
  wireModules(context)
  jest.spyOn(workspace, 'setWindowTypeDialogOpen')
  navigation.eventTarget.dispatchEvent(event)
  expect(workspace.setWindowTypeDialogOpen).toHaveBeenCalledWith(true)
})

test('if hsp-navigation fires "menuItemClicked" with detail "search"', async function() {
  const context = await setup()
  const { navigation } = context.modules
  const event = new CustomEvent('menuItemClicked', {
    detail: { id: 'search' }
  })
  wireModules(context)
  jest.spyOn(context.tracker, 'trackEvent')
  navigation.eventTarget.dispatchEvent(event)
  expect(context.tracker.trackEvent).toHaveBeenCalledWith({
    action: 'Change page via sidebar button',
    category: 'Navigation',
    name: 'Search'
  })
})

test('if hsp-search fires "selectResourceClicked"', async function() {
  const context = await setup()
  const { navigation, search, workspace } = context.modules

  wireModules(context)

  jest.spyOn(workspace, 'addResource')
  jest.spyOn(search, 'setSelectedResources')
  jest.spyOn(navigation, 'setMenus')
  jest.spyOn(navigation, 'getMenus').mockReturnValue([
    {
      id: 'workspace',
      label: 'workspace',
      badgeCount: 0,
    }
  ])

  const event = new CustomEvent('selectResourceClicked', {
    detail: 'resource info'
  })

  search.eventTarget.dispatchEvent(event)

  expect(workspace.addResource).toHaveBeenCalled()
  expect(search.setSelectedResources).toHaveBeenCalled()
  expect(navigation.setMenus).toHaveBeenCalled()
})

test('if hsp-search fires "unselectResourceClicked"', async function() {
  const context = await setup()
  const { navigation, search, workspace } = context.modules

  wireModules(context)

  jest.spyOn(workspace, 'removeResource')
  jest.spyOn(search, 'setSelectedResources')
  jest.spyOn(navigation, 'setMenus')
  jest.spyOn(navigation, 'getMenus').mockReturnValue([
    {
      id: 'workspace',
      label: 'workspace',
      badgeCount: 0,
    }
  ])

  const event = new CustomEvent('unselectResourceClicked', {
    detail: 'resource info'
  })

  search.eventTarget.dispatchEvent(event)

  expect(workspace.removeResource).toHaveBeenCalled()
  expect(search.setSelectedResources).toHaveBeenCalled()
  expect(navigation.setMenus).toHaveBeenCalled()
})

test('if hsp-search fires "searchButtonClicked"', async function() {
  const context = await setup()
  const { search } = context.modules
  wireModules(context)
  const event = new CustomEvent('searchButtonClicked', { detail: 'elephantastic' })
  jest.spyOn(context.tracker, 'trackSiteSearch')
  search.eventTarget.dispatchEvent(event)
  expect(context.tracker.trackSiteSearch).toHaveBeenCalledWith('Search', 'elephantastic')
})

test('if hsp-search fires "openResourceClicked"', async function() {
  const context = await setup()
  const { search, workspace } = context.modules

  wireModules(context)

  jest.spyOn(workspace, 'addResource')
  jest.spyOn(search, 'setSelectedResources')
  jest.spyOn(context.appEvents, 'dispatchEvent')

  const event = new CustomEvent('openResourceClicked', {
    detail: 'resource info'
  })

  search.eventTarget.dispatchEvent(event)

  expect(workspace.addResource).toHaveBeenCalled()
  expect(search.setSelectedResources).toHaveBeenCalled()
  expect(context.appEvents.dispatchEvent).toHaveBeenCalled()
})

test('if hsp-workspace fires "resourceAdded"', async function() {
  const context = await setup()
  const { navigation, search, workspace } = context.modules

  wireModules(context)

  jest.spyOn(search, 'setSelectedResources')
  jest.spyOn(navigation, 'setMenus')
  jest.spyOn(navigation, 'getMenus').mockReturnValue([
    {
      id: 'workspace',
      label: 'workspace',
      badgeCount: 0,
    }
  ])

  const event = new CustomEvent('resourceAdded', {
    detail: 'resource info'
  })

  workspace.eventTarget.dispatchEvent(event)

  expect(search.setSelectedResources).toHaveBeenCalled()
  expect(navigation.setMenus).toHaveBeenCalled()
})

test('if hsp-workspace fires "resourceRemoved"', async function() {
  const context = await setup()
  const { navigation, search, workspace } = context.modules

  wireModules(context)

  jest.spyOn(search, 'setSelectedResources')
  jest.spyOn(navigation, 'setMenus')
  jest.spyOn(navigation, 'getMenus').mockReturnValue([
    {
      id: 'workspace',
      label: 'workspace',
      badgeCount: 0,
    }
  ])

  const event = new CustomEvent('resourceRemoved', {
    detail: 'resource info'
  })

  workspace.eventTarget.dispatchEvent(event)

  expect(search.setSelectedResources).toHaveBeenCalled()
  expect(navigation.setMenus).toHaveBeenCalled()
})
