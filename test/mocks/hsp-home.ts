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

import { HspHome, Config } from 'hsp-fo-home/types'
import { WebModuleLanguage, WebModuleLocation } from 'hsp-web-module'

export function createHspHome(config: Config): HspHome {
  const eventTarget = new EventTarget()
  let _isMounted = false
  let language: WebModuleLanguage = 'de'
  let location: WebModuleLocation = {
    pathname: '/',
    search: '',
    hash: '',
  }

  return {
    eventTarget,
    addEventListener: (type: string, listener: any) => {
      eventTarget.addEventListener(type, listener)
      return () => {
        eventTarget.removeEventListener(type, listener)
      }
    },

    isMounted: () => _isMounted,

    mount: () => {
      _isMounted = true
      return Promise.resolve()
    },

    unmount: () => {
      _isMounted = false
      return true
    },

    getConfig: () => config as Required<Config>,
    setState: () => {},
    getState: () => undefined as any,

    getLanguage: () => language,
    setLanguage: (lang: WebModuleLanguage) => {
      language = lang
    },

    getLocation: () => location,
    setLocation: (loc: WebModuleLocation) => {
      location = loc
    },
  }
}
