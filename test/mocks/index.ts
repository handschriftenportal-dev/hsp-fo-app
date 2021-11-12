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

import { createHspNavigation } from './hsp-navigation'
import { createHspHome } from './hsp-home'
import { createHspSearch } from './hsp-search'
import { createHspWorkspace } from './hsp-workspace'
import { createHspCms } from './hsp-cms'
import { mockBackend } from './backend'

const _window = window as any
_window.createHspNavigation = jest.fn(createHspNavigation)
_window.createHspHome = jest.fn(createHspHome)
_window.createHspSearch = jest.fn(createHspSearch)
_window.createHspWorkspace = jest.fn(createHspWorkspace)
_window.createHspCms = jest.fn(createHspCms)

mockBackend()

const appContainer = document.createElement('div')
appContainer.id = 'app'
document.body.append(appContainer)
