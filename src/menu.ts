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

import { i18n } from 'i18next'
import { Modules, MenuController } from './types'
import { Menu as NavMenu } from 'hsp-fo-navigation/types'
import { Menu as CmsMenu } from 'hsp-fo-cms/types'
import { FeatureFlags } from './features'


type MenuTest = (menu: NavMenu) => boolean

export function createMenuController(
  modules: Modules,
  i18n: i18n,
  featureFlags: FeatureFlags,
): MenuController {

  /**
   * This are the menus that we know up front in contrast to the cms menus
   * that are fetched at runtime.
   */
  function createStaticMenus(): NavMenu[] {
    const { search, workspace } = modules
    return [
      {
        id: 'home',
        link: '/',
        icon: 'home',
        label: {
          de: i18n.t('pages.home', { lng: 'de' }),
          en: i18n.t('pages.home', { lng: 'en' }),
        },
        tooltip: {
          de: i18n.t('pages.home', { lng: 'de' }),
          en: i18n.t('pages.home', { lng: 'en' }),
        }
      },
      {
        id: 'search',
        link: search.getConfig().createAbsoluteURL(search.getLocation()).href,
        icon: 'search',
        label: {
          de: i18n.t('pages.search', { lng: 'de' }),
          en: i18n.t('pages.search', { lng: 'en' }),
        },
        tooltip: {
          de: i18n.t('pages.search', { lng: 'de' }),
          en: i18n.t('pages.search', { lng: 'en' }),
        }
      },
      {
        id: 'workspace',
        link: '/workspace',
        icon: 'dashboard',
        badgeCount: workspace.getResources().length,
        label: {
          de: i18n.t('pages.workspace', { lng: 'de' }),
          en: i18n.t('pages.workspace', { lng: 'en' }),
        },
        tooltip: {
          de: i18n.t('pages.workspace', { lng: 'de' }),
          en: i18n.t('pages.workspace', { lng: 'en' }),
        },
        children: [
          {
            id: 'addContent',
            icon: 'collections',
            label: {
              de: i18n.t('workspaceTools.addContent', { lng: 'de' }),
              en: i18n.t('workspaceTools.addContent', { lng: 'en' }),
            },
            tooltip: {
              de: i18n.t('workspaceTools.addContent', { lng: 'de' }),
              en: i18n.t('workspaceTools.addContent', { lng: 'en' }),
            }
          },
          {
            id: 'viewMode',
            icon: 'more_vert',
            label: {
              de: i18n.t('workspaceTools.viewMode', { lng: 'de' }),
              en: i18n.t('workspaceTools.viewMode', { lng: 'en' }),
            },
            tooltip: {
              de: i18n.t('workspaceTools.viewMode', { lng: 'de' }),
              en: i18n.t('workspaceTools.viewMode', { lng: 'en' }),
            }
          },
          {
            id: 'fullscreen',
            icon: 'fullscreen',
            label: {
              de: i18n.t('workspaceTools.fullscreen', { lng: 'de' }),
              en: i18n.t('workspaceTools.fullscreen', { lng: 'en' }),
            },
            tooltip: {
              de: i18n.t('workspaceTools.fullscreen', { lng: 'de' }),
              en: i18n.t('workspaceTools.fullscreen', { lng: 'en' }),
            }
          },
        ]
      },
    ]
  }

  function recursivelyFindMenuById(menu: NavMenu, menuTest: MenuTest): NavMenu | undefined {
    if (menuTest(menu)) {
      return menu
    }
    for (const child of menu.children || []) {
      const menu = recursivelyFindMenuById(child, menuTest)
      if (menu) {
        return menu
      }
    }
  }

  function recursivelyExpandMenu(menu: NavMenu): NavMenu {
    return {
      ...menu,
      expand: true,
      children: menu.children?.map(recursivelyExpandMenu)
    }
  }

  function expand(menus: NavMenu[], menuTest?: MenuTest): NavMenu[] {
    if (menuTest === undefined) {
      return menus
    }

    return menus.map(menu => {
      return recursivelyFindMenuById(menu, menuTest)
        ? recursivelyExpandMenu(menu)
        : menu
    })
  }

  function processCmsMenus(cmsMenus: CmsMenu[]): NavMenu[] {
    return cmsMenus.map(cmsMenu => ({
      ...cmsMenu,
      childrenLevel: 2,
      icon: 'info'
    }))
  }

  function resetMenu(shouldExpandMenu?: MenuTest) {
    const { navigation, cms } = modules

    // Synchronously set the static menus to the sidebar.
    navigation.setMenus(expand(
      createStaticMenus(),
      shouldExpandMenu
    ))

    if (featureFlags.cms) {
      // Asynchronously set the static AND the cms menus to the sidebar.
      cms.getMenus().then(processCmsMenus).then(cmsMenus => {
        navigation.setMenus(expand(
          [...createStaticMenus(), ...cmsMenus],
          shouldExpandMenu
        ))
      })
    }
  }

  return {
    resetMenu,
  }
}

