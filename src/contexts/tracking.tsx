import MatomoTracker from '@datapunt/matomo-tracker-js'
import { TrackEventParams } from '@datapunt/matomo-tracker-js/lib/types'
import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

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
type TrackerContextType = {
  addEventListener: (type: string, handler: () => void) => () => void
  isLoaded: boolean
  trackPageView: (title: string) => void
  trackSiteSearch: (title: string, q: string) => void
  trackEvent: (params: TrackEventParams) => void
}

type TrackingOptionsType = {
  isLoaded: boolean
  config?: TrackingConfig
  matomo?: MatomoTracker
}

const defaultTrackingOptions: TrackingOptionsType = {
  isLoaded: false,
}

export const TrackerContext = createContext<TrackerContextType | undefined>(
  undefined,
)

export function TrackerProvider({
  children,
}: Readonly<{ children: ReactElement }>) {
  const eventTarget = new EventTarget()
  const [trackingOptions, setTrackingOptions] = useState<TrackingOptionsType>(
    defaultTrackingOptions,
  )

  const addEventListener = (type: string, handler: () => void) => {
    eventTarget.addEventListener(type, handler)

    return () => {
      eventTarget.removeEventListener(type, handler)
    }
  }

  const trackPageView = (title: string) => {
    const { config, matomo } = trackingOptions
    if (matomo && config) {
      matomo.trackPageView({
        documentTitle: title,
        href:
          config.clientMockOrigin &&
          new URL(location.pathname + location.search, config.clientMockOrigin)
            .href,
      })
    }
  }

  const trackSiteSearch = (title: string, q: string) => {
    const { config, matomo } = trackingOptions
    if (matomo && config) {
      matomo.trackSiteSearch({
        // MatomoTracker would fail with "Error: keyword is required" for empty string
        keyword: q || '*',
        documentTitle: title,
        href:
          config.clientMockOrigin &&
          new URL(location.pathname + location.search, config.clientMockOrigin)
            .href,
      })
    }
  }
  const trackEvent = (params: TrackEventParams) => {
    const { config, matomo } = trackingOptions
    if (matomo && config) {
      matomo.trackEvent({
        ...params,
        href:
          config.clientMockOrigin &&
          new URL(location.pathname + location.search, config.clientMockOrigin)
            .href,
      })
    }
  }

  useEffect(() => {
    async function loadFeatureFlags() {
      const response = await fetch('/api/tracking')

      const config = (await response.json()) as TrackingConfig
      if (!config.activate || !config.matomoBaseUrl || !config.matomoSiteId) {
        return
      }

      const matomo = new MatomoTracker({
        urlBase: config.matomoBaseUrl,
        siteId: config.matomoSiteId,
        // See: https://www.npmjs.com/package/@datapunt/matomo-tracker-react
        linkTracking: false,
        configurations: {
          disableCookies: true,
        },
      })
      setTrackingOptions({
        isLoaded: true,
        config,
        matomo,
      })

      eventTarget.dispatchEvent(new CustomEvent('loaded'))
    }

    loadFeatureFlags()
  }, [])

  const value = useMemo(
    () => ({
      isLoaded: trackingOptions.isLoaded,
      trackEvent,
      trackSiteSearch,
      trackPageView,
      addEventListener,
    }),
    [
      trackingOptions,
      trackEvent,
      trackSiteSearch,
      trackPageView,
      addEventListener,
    ],
  )

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  )
}

export function useTracker() {
  return useContext(TrackerContext) as TrackerContextType
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
