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
import { WebModule, WebModuleConfig, WebModuleEvents, WebModuleLocation, WebModuleUnit } from 'hsp-web-module'
import { Tracker } from './tracking'
import { FeatureFlags } from './features'
import { HspNavigation, Menu } from 'hsp-fo-navigation/types'
import { HspHome } from 'hsp-fo-home/types'
import { HspSearch } from 'hsp-fo-search/types'
import { HspWorkspace } from 'hsp-fo-workspace/types'
import { HspCms } from 'hsp-fo-cms/types'


export type ModuleConstructor<T> = (createAbsoluteURL: WebModuleConfig['createAbsoluteURL']) => T
export type RenderPage = (context: Context, currentLocaction: WebModuleLocation) => Promise<void>

export interface Modules {
  navigation: HspNavigation
  home: HspHome
  search: HspSearch
  workspace: HspWorkspace
  cms: HspCms
}

export interface MenuController {
  resetMenu(shouldExpandMenu?: (menu: Menu) => boolean): void
}

export interface Context {
  modules: Modules
  routingTable: Record<string, RenderPage>
  appContainer: HTMLElement
  appEvents: EventTarget
  tracker: Tracker
  i18n: i18n
  featureFlags: FeatureFlags
  menuController: MenuController
}

export type LinkClicked = WebModuleEvents<unknown>['linkClicked']
