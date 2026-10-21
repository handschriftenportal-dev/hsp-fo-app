import { FeatureFlagConfig } from 'src/contexts/features'
import { TrackingConfig } from 'src/contexts/tracking'

function createReponseMock<T>(data: T, status = 200) {
  return Promise.resolve({
    status,
    json() {
      return Promise.resolve(data)
    },
  })
}

export function mockBackend() {
  ;(global.fetch as any) = jest.fn((url: string) => {
    switch (url) {
      case '/api/features':
        return createReponseMock<FeatureFlagConfig>({
          catalogs: true,
          annotation: true,
        })
      case '/api/tracking':
        return createReponseMock<TrackingConfig>({
          activate: false,
          matomoBaseUrl: '/',
          matomoSiteId: 333,
        })
      default:
        return createReponseMock(undefined, 404)
    }
  })
}
