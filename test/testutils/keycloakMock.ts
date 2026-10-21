import { jest } from '@jest/globals'
import { ReactNode } from 'react'

/**
 * Shared jest mock for `src/contexts/Keycloak`, used by the specs whose
 * components call `useKeycloak()` (e.g. <Login> in the sidebar) so they do not
 * have to wire up a real KeycloakProvider. Apply it with:
 *
 *   jest.mock('src/contexts/Keycloak', () =>
 *     jest.requireActual('test/testutils/keycloakMock'),
 *   )
 *
 * `useKeycloak` is a jest.fn so a test can override it per case via
 * `jest.mocked(useKeycloak).mockReturnValue(...)`.
 */
export default jest.fn()

export const KeycloakProvider = ({ children }: { children: ReactNode }) =>
  children

export const useKeycloak = jest.fn(() => ({
  keycloak: {
    authenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    tokenParsed: undefined,
  },
  initialized: true,
}))
