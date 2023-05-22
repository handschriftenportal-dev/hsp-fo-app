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

import { createContext, useContext, useState, useEffect } from 'react'
import MatomoTracker from '@datapunt/matomo-tracker-js'
import { TrackEventParams } from '@datapunt/matomo-tracker-js/lib/types'

// Data structure provided by /api/tracking.
// Assembled from environment variables.
export interface TrackingConfig {
  activate: boolean
  matomoBaseUrl: string
  matomoSiteId: number
  // The Matomo test server only recognizes requests
  // from the test environment. If we run the app
  // in a local environment than the origin is `localhost`
  // and Matomo will ignore the requests. If the
  // `clientMockOrgin` prop is set to the origin of
  // the test environment than we can pretend that
  // the app is running in test environment.
  clientMockOrigin?: string
}

/**
 * Tracker class with methods to track different user events.
 *
 * This is an async class, meaning that the object will perform
 * a network request right after newing the class. While the API
 * is ready to use after newing the class, the method calls will
 * silently perform no operations until all properties (tracking
 * config and matomo client) have been loaded.
 *
 * The reason for this pattern is to not block the app for the
 * setup network requests. In other words the tracker is allowed
 * to be late to the party.
 *
 * The object exposes an `addEventListener` method where consumers
 * can listen for the `loaded` event.
 */
export class Tracker {
  public isLoaded = false
  private eventTarget = new EventTarget()
  private matomo: MatomoTracker | undefined = undefined
  private config: TrackingConfig | undefined = undefined

  constructor() {
    this.load()
  }

  addEventListener(type: string, handler: () => void) {
    this.eventTarget.addEventListener(type, handler)

    return () => {
      this.eventTarget.removeEventListener(type, handler)
    }
  }

  async load() {
    const response = await fetch('/api/tracking')
    if (!response.status) {
      throw new Error('error fetching tracking config')
    }

    const config = (await response.json()) as TrackingConfig

    if (!config.activate || !config.matomoBaseUrl || !config.matomoSiteId) {
      return
    }

    this.config = config

    this.matomo = new MatomoTracker({
      urlBase: config.matomoBaseUrl,
      siteId: config.matomoSiteId,
      // See: https://www.npmjs.com/package/@datapunt/matomo-tracker-react
      linkTracking: false,
      configurations: {
        disableCookies: true,
      },
    })

    this.isLoaded = true
    this.eventTarget.dispatchEvent(new CustomEvent('loaded'))
  }

  trackPageView(title: string) {
    if (this.matomo && this.config) {
      this.matomo.trackPageView({
        documentTitle: title,
        href:
          this.config.clientMockOrigin &&
          new URL(
            location.pathname + location.search,
            this.config.clientMockOrigin
          ).href,
      })
    }
  }

  trackSiteSearch(title: string, q: string) {
    if (this.matomo && this.config) {
      this.matomo.trackSiteSearch({
        // MatomoTracker would fail with "Error: keyword is required" for empty string
        keyword: q || '*',
        documentTitle: title,
        href:
          this.config.clientMockOrigin &&
          new URL(
            location.pathname + location.search,
            this.config.clientMockOrigin
          ).href,
      })
    }
  }

  trackEvent(params: TrackEventParams) {
    if (this.matomo && this.config) {
      this.matomo.trackEvent({
        ...params,
        href:
          this.config.clientMockOrigin &&
          new URL(
            location.pathname + location.search,
            this.config.clientMockOrigin
          ).href,
      })
    }
  }
}

export const TrackerContext = createContext<Tracker | undefined>(undefined)

export function useTracker() {
  return useContext(TrackerContext) as Tracker
}

/**
 * The app will render a page before the tracker is ready to use,
 * i.e. the initial page will miss the ready state of the tracker
 * and calls to `tracker.trackPageView` will perform no operation.
 *
 * To solve this problem this hook will:
 *   - check if the tracker is ready
 *   - if so then call `tracker.trackPageView`
 *   - else register for the tracker's `loaded` event and rerender if this event was fires.
 */
export function useTrackPageView(title: string) {
  const tracker = useTracker()
  const [loaded, setLoaded] = useState(tracker.isLoaded)

  useEffect(() => {
    if (!loaded) {
      return tracker.addEventListener('loaded', () => setLoaded(true))
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      tracker.trackPageView(title)
    }
  }, [loaded])
}
