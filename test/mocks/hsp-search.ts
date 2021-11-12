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

import { HspSearch, Config } from 'hsp-fo-search/types'

export function createHspSearch(config: Config): HspSearch {
  const eventTarget = new EventTarget()

  return {
    eventTarget,
    addEventListener: (type: string, listener: any) => {
      eventTarget.addEventListener(type, listener)
    },
    mount: () => Promise.resolve(),
    unmount: () => Promise.resolve(),
    isMounted: () => false,
    getConfig: () => config as Required<Config>,
    setState: () => {},
    getState: () => undefined as any,
    setLanguage: () => {},
    getLanguage: () => 'de',
    setLocation: () => {},
    getLocation: () => ({
      path: '/',
      params: new URLSearchParams(),
      hash: ''
    }),
    setSelectedResources: () => {},
    getSelectedResources: () => []
  }
}
