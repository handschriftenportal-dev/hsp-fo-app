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

import React, { useEffect, useRef } from 'react'
import { useModules, useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'
import { PageNameProvider } from 'src/contexts/pageName'
import { Navigation } from 'src/components/navigation'

export function Workspace() {
  const modules = useModules()
  const topBarToolsContainer = useRef(document.createElement('div'))
  topBarToolsContainer.current.style.width = '100%'
  const mainContainer = useRef(document.createElement('div'))
  mainContainer.current.style.width = '100%'
  mainContainer.current.style.position = 'absolute'
  mainContainer.current.style.top = '0'
  mainContainer.current.style.right = '0'
  mainContainer.current.style.left = '0'
  mainContainer.current.style.bottom = '0'

  useSetupModulesForPage()
  useTrackPageView('Workspace')

  useEffect(() => {
    modules.workspace.mount({ main: mainContainer.current })
    modules.search.mount({ searchBar: topBarToolsContainer.current })
  }, [])

  return (
    <PageNameProvider value="workspace">
      <Navigation
        main={mainContainer.current}
        topBarTools={topBarToolsContainer.current}
      />
    </PageNameProvider>
  )
}