/**
 * Render tests for components that currently lack test coverage.
 * Mounts each component with the required providers and asserts it renders
 * without throwing. Catches import errors, missing providers, and runtime crashes.
 */
import { screen } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import { useAsyncValue, useLoaderData } from 'react-router'
import { homeMock, mockHspObjectsByQuery } from 'test/mocks/jestAxeMocks'
import 'test/testutils/mockEmblaCarousel'

import { Carousel } from 'src/components/home/Carousel'
import { Login } from 'src/components/navigation/shared/Login'
import { ImgCarousel } from 'src/components/projects/Detailpage/ImgCarousel'
import { DirectResourceLinks } from 'src/components/search/shared/DirectResourceLinks'
import { ActiveFilters } from 'src/components/shared/Filter/ActiveFilters'
import { FilterChip } from 'src/components/shared/Filter/FilterChip'
import { SearchFilter } from 'src/components/shared/Filter/SearchFilter'
import StackedToast from 'src/components/shared/StackedToast'
import { Paging } from 'src/components/shared/Tools/Paging'
import { WorkspaceToast } from 'src/components/shared/WorkspaceToast'
import { useKeycloak } from 'src/contexts/Keycloak'
import { initI18n } from 'src/contexts/i18n'
import { Workspace } from 'src/pages/Workspace'

import { renderWithProviders } from '../testutils'

// --- Global mocks ---

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
  useAsyncValue: jest.fn(),
}))

jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({
    workspace: {
      mount: jest.fn(),
      getMiradorWorkspaceAddVisible: jest.fn(() => false),
      addAnnotation: jest.fn(),
    },
  })),
  useSetupModulesForPage: jest.fn(),
}))

jest.mock('src/contexts/tracking', () => ({
  useTrackPageView: jest.fn(),
}))

jest.mock('src/contexts/Keycloak', () =>
  jest.requireActual('test/testutils/keycloakMock'),
)

global.scrollTo = jest.fn()

initI18n({ doNotTranslate: true })

describe('Component rendering', () => {
  describe('SearchFilter (react-virtualized)', () => {
    it('renders without throwing', async () => {
      await renderWithProviders(
        <SearchFilter
          filterName="settlement-facet"
          sortedOptions={{ Berlin: 5, Munich: 3 }}
          selected={[]}
          toggleValue={jest.fn()}
        />,
      )
      expect(screen.getByRole('textbox')).toBeTruthy()
    })
  })

  describe('Carousel (embla)', () => {
    it('renders without throwing', async () => {
      jest.mocked(useLoaderData).mockReturnValue(homeMock)
      await renderWithProviders(<Carousel />, homeMock)
      expect(screen.getByTestId('home-carousel')).toBeTruthy()
      expect(screen.getByRole('listbox')).toBeTruthy()
    })
  })

  describe('ImgCarousel (embla)', () => {
    it('renders without throwing', async () => {
      await renderWithProviders(
        <ImgCarousel
          imageSet={[
            {
              img: 'https://example.com/wp-content/uploads/img.jpg',
              imgInfo: 'Test image',
            },
          ]}
        />,
      )
      expect(screen.getByAltText('Test image')).toBeTruthy()
      expect(screen.getByText('Test image')).toBeTruthy()
    })
  })

  describe('Login (keycloak)', () => {
    it('renders unauthenticated state', async () => {
      await renderWithProviders(<Login />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('renders authenticated state', async () => {
      jest.mocked(useKeycloak).mockReturnValue({
        keycloak: {
          authenticated: true,
          login: jest.fn(),
          logout: jest.fn(),
          tokenParsed: { displayName: 'Test User' },
        } as never,
        initialized: true,
      })

      await renderWithProviders(<Login />)
      expect(screen.getByText('Test User')).toBeTruthy()

      // Reset to unauthenticated
      jest.mocked(useKeycloak).mockReturnValue({
        keycloak: {
          authenticated: false,
          login: jest.fn(),
          logout: jest.fn(),
          tokenParsed: undefined,
        } as never,
        initialized: true,
      })
    })
  })

  describe('Workspace (keycloak + modules)', () => {
    it('renders without throwing', async () => {
      const { baseElement } = await renderWithProviders(
        <Workspace hasKeycloak={false} />,
      )
      expect(baseElement).toBeTruthy()
    })
  })

  describe('StackedToast (notistack)', () => {
    it('renders without throwing', async () => {
      await renderWithProviders(
        <SnackbarProvider>
          <StackedToast id="test-toast" message="Test notification" />
        </SnackbarProvider>,
      )
      expect(screen.getByText('Test notification')).toBeTruthy()
    })
  })

  describe('WorkspaceToast', () => {
    it('renders when open', async () => {
      // WorkspaceToast uses Portal targeting #content
      const contentDiv = document.createElement('div')
      contentDiv.id = 'content'
      document.body.appendChild(contentDiv)

      await renderWithProviders(
        <WorkspaceToast
          open={true}
          message="Workspace notification"
          handleClose={jest.fn()}
        />,
      )
      expect(screen.getByText('Workspace notification')).toBeTruthy()

      document.body.removeChild(contentDiv)
    })
  })

  describe('Paging (MUI lab Pagination)', () => {
    it('renders with search results', async () => {
      jest.mocked(useAsyncValue).mockReturnValue({
        searchResult: mockHspObjectsByQuery,
      })
      await renderWithProviders(<Paging />)
      expect(screen.getByRole('navigation')).toBeTruthy()
    })

    it('renders bottom variant', async () => {
      jest.mocked(useAsyncValue).mockReturnValue({
        searchResult: mockHspObjectsByQuery,
      })
      await renderWithProviders(<Paging isBottom />)
      expect(screen.getByRole('navigation')).toBeTruthy()
    })
  })

  describe('FilterChip', () => {
    it('renders with label and close button', async () => {
      await renderWithProviders(
        <FilterChip label="Settlement: Berlin" onRemove={jest.fn()} />,
      )
      expect(screen.getByText('Settlement: Berlin')).toBeTruthy()
      expect(screen.getByRole('button')).toBeTruthy()
    })
  })

  describe('ActiveFilters', () => {
    it('renders null when no filters active', async () => {
      await renderWithProviders(<ActiveFilters />)
      expect(
        screen.queryByTestId('discovery-list-view-active-filters'),
      ).toBeNull()
    })
  })

  describe('DirectResourceLinks', () => {
    it('renders with descriptions and digitizeds', async () => {
      await renderWithProviders(
        <DirectResourceLinks
          linkToDetailView="/search/HSP-123"
          numOfDescriptions={3}
          numOfDigitizeds={2}
          onClick={jest.fn()}
          vertical={false}
        />,
      )
      expect(screen.getByRole('group')).toBeTruthy()
      expect(screen.getByText('3')).toBeTruthy()
      expect(screen.getByText('2')).toBeTruthy()
    })

    it('renders vertical layout with permalink', async () => {
      await renderWithProviders(
        <DirectResourceLinks
          linkToDetailView="/search/HSP-123"
          numOfDescriptions={1}
          numOfDigitizeds={0}
          onClick={jest.fn()}
          vertical={true}
          detailPage
          permalink="https://resolver.example.com/HSP123"
        />,
      )
      expect(screen.getByRole('group')).toBeTruthy()
    })
  })
})
