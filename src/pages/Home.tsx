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
import { useSetupModulesForPage, useModules } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'
import { PageNameProvider } from 'src/contexts/pageName'
import { Navigation } from 'src/components/navigation'
import { useSetMetatag, useSetTitle } from 'src/contexts/Metatags'
import { useTranslation } from 'src/contexts/i18n'

export function Home() {
  const modules = useModules()
  const { t } = useTranslation()

  useSetupModulesForPage()
  useTrackPageView('Home')

  const mainContainer = useRef(document.createElement('div'))
  mainContainer.current.style.width = '100%'
  mainContainer.current.style.display = 'flex'

  useEffect(() => {
    modules.home.mount({ main: mainContainer.current })
    modules.search.mount({
      searchBar: modules.home.getConfig().anchors.searchBar,
    })
  }, [])

  const title = `Handschriftenportal: ${t('topBar.logoLink')}`
  const desc = t('description')

  useSetTitle(title)
  useSetMetatag({ key: 'name', value: 'description', content: desc })

  return (
    <PageNameProvider value="home">
      <Navigation main={mainContainer.current} topBarTools={undefined} />
    </PageNameProvider>
  )
}
