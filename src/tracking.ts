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

import MatomoTracker from '@datapunt/matomo-tracker-js'
import { TrackEventParams } from '@datapunt/matomo-tracker-js/lib/types'

// Data structure provided by /api/tracking.
// Assembled from environment variables.
export interface TrackingConfig {
  activate: boolean;
  matomoBaseUrl: string;
  matomoSiteId: number;
  // The Matomo test server only recognizes requests
  // from the test environment. If we run the app
  // in a local environment than the origin is `localhost`
  // and Matomo will ignore the requests. If the
  // `clientMockOrgin` prop is set to the origin of
  // the test environment than we can pretent that
  // the app is running in test environment.
  clientMockOrigin?: string;
}


async function fetchTrackingConfig(): Promise<TrackingConfig> {
  const response = await fetch('/api/tracking')
  if (!response.status) {
    throw new Error('error fetching tracking config')
  }
  return response.json()
}

export type Tracker = ReturnType<typeof createTracker>
export function createTracker() {
  let clientMockOrigin: string | undefined
  let matomo: MatomoTracker | undefined

  fetchTrackingConfig().then(config => {
    if (!config.activate || !config.matomoBaseUrl || !config.matomoSiteId) {
      return
    }

    if (config.clientMockOrigin) {
      clientMockOrigin = config.clientMockOrigin
    }

    matomo = new MatomoTracker({
      urlBase: config.matomoBaseUrl,
      siteId: config.matomoSiteId,
      // See: https://www.npmjs.com/package/@datapunt/matomo-tracker-react
      linkTracking: false,
    })
  })


  return {
    trackPageView(title: string) {
      if (matomo) {
        matomo.trackPageView({
          documentTitle: title,
          href: clientMockOrigin &&
            (new URL(location.pathname + location.search, clientMockOrigin)).href
        })
      }
    },

    trackSiteSearch(title: string, q: string) {
      if (matomo) {
        matomo.trackSiteSearch({
          // MatomoTracker would fail with "Error: keyword is required" for empty string
          keyword: q || '*',
          documentTitle: title,
          href: clientMockOrigin &&
            (new URL(location.pathname + location.search, clientMockOrigin)).href
        })
      }
    },

    trackEvent(params: TrackEventParams) {
      if (matomo) {
        matomo.trackEvent({
          ...params,
          href: clientMockOrigin,
        })
      }
    }
  }
}
