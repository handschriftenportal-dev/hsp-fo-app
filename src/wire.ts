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

import { WebModuleLanguage } from 'hsp-web-module'
import { Context, LinkClicked } from './types'
import { getWebModuleLanguage } from './i18n'
import { deepCopy } from './utils'


export function wireModules(context: Context): void {
  const { modules, i18n, tracker, appEvents, menuController } = context
  const { navigation, search, workspace } = modules

  function setLanguage(language: WebModuleLanguage) {
    Object.values(modules).forEach(m => m.setLanguage(language))
  }

  function updateResourceCountBadge() {
    const menus = deepCopy(navigation.getMenus())
    for (const menu of menus) {
      if (menu.id === 'workspace') {
        menu.badgeCount = workspace.getResources().length
        break
      }
    }
    navigation.setMenus(menus)
  }

  setLanguage(getWebModuleLanguage(i18n.language))

  navigation.addEventListener('languageChanged', e => {
    setLanguage(e.detail)
    i18n.changeLanguage(e.detail)
    // Necessary to reload the cms menus
    // because they are different for each language.
    menuController.resetMenu()
    tracker.trackEvent({
      category: 'Language',
      action: 'Change Language',
      name: e.detail,
    })
  })

  navigation.addEventListener('menuItemClicked', e => {
    if (e.detail.id === 'fullscreen') {
      workspace.setFullscreen()
    } else if (e.detail.id === 'addContent') {
      workspace.toggleAlbum()
    } else if (e.detail.id === 'viewMode') {
      workspace.setWindowTypeDialogOpen(true)
    } else if (e.detail.id === 'search') {
      tracker.trackEvent({
        category: 'Navigation',
        action: 'Change page via sidebar button',
        name: 'Search'
      })
    }
  })

  search.addEventListener('selectResourceClicked', e => {
    workspace.addResource(e.detail)
    search.setSelectedResources([
      ...search.getSelectedResources(),
      e.detail,
    ])
    updateResourceCountBadge()
  })

  search.addEventListener('unselectResourceClicked', e => {
    workspace.removeResource(e.detail)
    search.setSelectedResources(
      search.getSelectedResources().filter(r => r.id !== e.detail.id))
    updateResourceCountBadge()
  })

  search.addEventListener('searchButtonClicked', e => {
    tracker.trackSiteSearch('Search', e.detail)
  })

  search.addEventListener('openResourceClicked', e => {
    workspace.addResource(e.detail)
    search.setSelectedResources([
      ...search.getSelectedResources(),
      e.detail,
    ])

    // open workspace

    const workspaceUrl = workspace.getConfig()
      .createAbsoluteURL(workspace.getLocation())

    const linkClicked: LinkClicked = new CustomEvent('linkClicked', {
      detail: workspaceUrl,
      cancelable: true,
    })

    appEvents.dispatchEvent(linkClicked)
  })

  workspace.addEventListener('resourceAdded', e => {
    search.setSelectedResources([
      ...search.getSelectedResources(),
      e.detail,
    ])
    updateResourceCountBadge()
  })

  workspace.addEventListener('resourceRemoved', e => {
    search.setSelectedResources(
      search.getSelectedResources().filter(r => r.id !== e.detail.id))
    updateResourceCountBadge()
  })
}
