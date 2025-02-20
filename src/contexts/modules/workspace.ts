import { Config, CreateHspWorkspace } from 'hsp-fo-workspace/declaration/types'
import fetch from 'isomorphic-unfetch'

declare global {
  const createHspWorkspace: CreateHspWorkspace
}

export function createWorkspace(
  createAbsoluteURL: Config['createAbsoluteURL'],
) {
  return createHspWorkspace({
    customFetch: fetch,
    classNamePrefix: 'hsp-workspace',
    createAbsoluteURL,
    enableRouting: false,
    hspTeiEndpoint: '/api/tei',
    manifestEndpoint: '/api/digitizeds/search?',
    kodEndpoint: '/api/kods',
    theme: {},
    persistStore: true,
  })
}
