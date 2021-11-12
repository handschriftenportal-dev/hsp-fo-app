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

import { RenderPage } from '../types'
import { clearPage } from './clear'
import { renderAlphaDialog } from 'src/components/AlphaDialog'
import { renderFeedbackButton } from 'src/components/FeedbackButton'


export const renderSearchPage: RenderPage = async (context, location) => {
  const { modules, appContainer, tracker, i18n, menuController } = context
  const { search, navigation } = modules

  await clearPage(context)
  search.setLocation(location)

  menuController.resetMenu()

  renderAlphaDialog(i18n)
  renderFeedbackButton(i18n)

  await navigation.mount({ main: appContainer })

  await search.mount({
    main: navigation.getConfig().anchors.main,
    searchBar: null,
    overviewNavigation: null,
    searchBarOrOverviewNavigation: navigation.getConfig().anchors.topBarTools,
  })

  tracker.trackPageView('Search')
}
