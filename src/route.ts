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

import { Context, LinkClicked } from './types'


export function startRouting(context: Context) {
  const { modules, appEvents, routingTable } = context

  async function route(url: URL) {
    const matchedMountPath = Object.keys(routingTable)
      .find(path => url.pathname.startsWith(path)) || '/'

    const renderPage = routingTable[matchedMountPath]

    await renderPage(context, {
      // Cut the module prefix from the path.
      // The module receives only it's path.
      path: url.pathname.replace(matchedMountPath, ''),
      params: url.searchParams,
      hash: url.hash,
    })
  }

  Object.values(modules).forEach(m => {
    if (m.getConfig().enableRouting) {
      throw new Error('startRouting: routing must be disabled for the modules.')
    }

    (m as any).addEventListener('linkClicked', (e: LinkClicked) => {
      e.preventDefault()
      history.pushState(null, '', e.detail.href)
      route(e.detail)
    })
  })

  // the host app itself can trigger links
  ; (appEvents as any).addEventListener('linkClicked', (e: LinkClicked) => {
    e.preventDefault()
    history.pushState(null, '', e.detail.href)
    route(e.detail)
  })

  window.addEventListener('popstate', () => {
    route(new URL(window.location.href))
  })

  route(new URL(location.href))
}
