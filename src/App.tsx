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

import React from 'react'
import { Provider } from 'react-redux'
import { HspThemeProvider } from 'hsp-web-module'
import { makeStore } from 'src/contexts/state'
import { initI18n } from 'src/contexts/i18n'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { Router } from 'src/contexts/router'
import { Tracker, TrackerContext } from 'src/contexts/tracking'
import { FeatureFlagsContext, FeatureFlags } from 'src/contexts/features'

export function App() {
  initI18n()
  const store = makeStore()
  const featureFlags = new FeatureFlags()
  const tracker = new Tracker()
  const modules = createHspModules()

  return (
    <HspThemeProvider>
      <Provider store={store}>
        <FeatureFlagsContext.Provider value={featureFlags}>
          <TrackerContext.Provider value={tracker}>
            <ModuleContext.Provider value={modules}>
              <Router />
            </ModuleContext.Provider>
          </TrackerContext.Provider>
        </FeatureFlagsContext.Provider>
      </Provider>
    </HspThemeProvider>
  )
}
