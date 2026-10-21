import { QueryClient } from '@tanstack/react-query'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import {
  Await,
  Link,
  Outlet,
  RouterProvider,
  useAsyncValue,
  useLoaderData,
  useLocation,
  useParams,
  useRouteError,
} from 'react-router'
import { createTestRouter } from 'test/testutils'
import 'whatwg-fetch'

import { normLoader } from 'src/contexts/loader/authorityLoader'
import { catalogLoader } from 'src/contexts/loader/catalogLoader'
import {
  DiscoveryLoaderDataProps,
  searchLoader,
} from 'src/contexts/loader/searchLoader'

// Exercises the real (de-`defer`ed) promise-returning loaders and the splat
// routes through actual router data flow instead of mocked loader data.

const deferred = () => {
  let resolvePromise!: (value: Response) => void
  let rejectPromise!: (error: unknown) => void
  const promise = new Promise<Response>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })
  return { promise, resolve: resolvePromise, reject: rejectPromise }
}

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

const hspObjectsPayload = (numFound: number) => ({
  payload: [],
  metadata: { numFound, start: 0, rows: 10 },
})

const ResultProbe = () => {
  const { searchResult } = useAsyncValue() as {
    searchResult: { metadata: { numFound: number } }
  }
  return <div>numFound:{searchResult.metadata.numFound}</div>
}

const SearchProbe = () => {
  const loaderData = useLoaderData() as Partial<DiscoveryLoaderDataProps>
  if (loaderData.resultList) {
    return <div>detail-view</div>
  }
  return (
    <Suspense fallback={<div>streaming-fallback</div>}>
      <Await resolve={loaderData.searchResult}>
        <ResultProbe />
      </Await>
    </Suspense>
  )
}

const ErrorProbe = () => {
  const error = useRouteError()
  return <div>error-page:{error instanceof Error ? error.message : ''}</div>
}

const setupSearchRoute = (url: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createTestRouter(
    [
      {
        path: '/search',
        element: <SearchProbe />,
        errorElement: <ErrorProbe />,
        loader: searchLoader(queryClient),
      },
    ],
    { initialEntries: [url] },
  )
  render(<RouterProvider router={router} />)
  return router
}

describe('promise-returning loaders (de-deferred)', () => {
  let fetchSpy: jest.SpyInstance

  beforeEach(() => {
    fetchSpy = jest.spyOn(window, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  it('streams the search result: fallback first, content after resolution', async () => {
    const requests = [deferred(), deferred()]
    let call = 0
    fetchSpy.mockImplementation(() => requests[call++].promise)

    setupSearchRoute('/search?q=test')

    // Loader returns before its promise settles, so Suspense shows first
    expect(await screen.findByText('streaming-fallback')).toBeTruthy()

    // Main result and unfiltered rows=1 result
    requests[0].resolve(jsonResponse(hspObjectsPayload(12)))
    requests[1].resolve(jsonResponse(hspObjectsPayload(42)))

    expect(await screen.findByText('numFound:12')).toBeTruthy()
  })

  it('routes a rejected result promise to the route errorElement', async () => {
    // Silence React's error-boundary logging for the expected rejection
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    fetchSpy.mockRejectedValue(new Error('backend down'))

    setupSearchRoute('/search?q=test')

    expect(await screen.findByText(/error-page:.*backend down/)).toBeTruthy()
    consoleError.mockRestore()
  })

  it('routes a loader-thrown error (awaited detail fetch) to the errorElement', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    fetchSpy.mockRejectedValue(new Error('not found'))

    setupSearchRoute('/search?hspobjectid=HSP-123')

    expect(await screen.findByText(/error-page:.*not found/)).toBeTruthy()
    consoleError.mockRestore()
  })

  it('renders the detail view when the awaited detail fetch resolves', async () => {
    fetchSpy.mockResolvedValue(jsonResponse({ hspObject: {} }))

    setupSearchRoute('/search?hspobjectid=HSP-123')

    expect(await screen.findByText('detail-view')).toBeTruthy()
  })
})

const AwaitKeyProbe = ({ dataKey }: { dataKey: string }) => {
  const loaderData = useLoaderData() as Record<string, Promise<unknown>>
  return (
    <Suspense fallback={<div>streaming-fallback</div>}>
      <Await resolve={loaderData[dataKey]}>
        <div>resolved</div>
      </Await>
    </Suspense>
  )
}

describe('catalog and authority loader rejection', () => {
  const cases = [
    {
      name: 'catalogLoader',
      path: '/catalogs',
      url: '/catalogs?q=x',
      dataKey: 'searchResult',
      makeLoader: catalogLoader,
    },
    {
      name: 'normLoader',
      path: '/authority-files',
      url: '/authority-files?authorityfileid=GND-1',
      dataKey: 'authorityData',
      makeLoader: normLoader,
    },
  ]

  it.each(cases)(
    'routes a rejected $name promise to the route errorElement',
    async ({ path, url, dataKey, makeLoader }) => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const fetchSpy = jest
        .spyOn(window, 'fetch')
        .mockRejectedValue(new Error('backend down'))
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
      const router = createTestRouter(
        [
          {
            path,
            element: <AwaitKeyProbe dataKey={dataKey} />,
            errorElement: <ErrorProbe />,
            loader: makeLoader(queryClient),
          },
        ],
        { initialEntries: [url] },
      )
      render(<RouterProvider router={router} />)

      expect(await screen.findByText(/error-page:.*backend down/)).toBeTruthy()
      fetchSpy.mockRestore()
      consoleError.mockRestore()
    },
  )
})

const SplatProbe = ({ name }: { name: string }) => {
  const params = useParams()
  const location = useLocation()
  return (
    <div>
      <div>page:{name}</div>
      <div>splat:{params['*'] ?? ''}</div>
      <div>url:{location.pathname + location.search + location.hash}</div>
    </div>
  )
}

const SplatLayout = () => (
  <div>
    <Link to="/catalogs?fq=%7B%7D#list">catalogs-link</Link>
    <Outlet />
  </div>
)

const setupSplatRoutes = (initialUrl: string) => {
  const router = createTestRouter(
    [
      {
        path: '/',
        element: <SplatLayout />,
        children: [
          { index: true, element: <div>page:home</div> },
          {
            path: 'authority-files/*',
            element: <SplatProbe name="authority" />,
          },
          { path: 'catalogs/*', element: <SplatProbe name="catalogs" /> },
          { path: 'projects/*', element: <SplatProbe name="projects" /> },
        ],
      },
    ],
    { initialEntries: [initialUrl] },
  )
  render(<RouterProvider router={router} />)
  return router
}

describe('splat-route navigation smoke', () => {
  it.each([
    [
      '/authority-files?authorityfileid=GND-1',
      'page:authority',
      'url:/authority-files?authorityfileid=GND-1',
    ],
    ['/catalogs/HSP-a1/page-2', 'page:catalogs', 'splat:HSP-a1/page-2'],
    ['/projects/proj-x', 'page:projects', 'splat:proj-x'],
  ])('renders %s on direct entry', async (url, page, detail) => {
    setupSplatRoutes(url)

    expect(await screen.findByText(page)).toBeTruthy()
    expect(screen.getByText(detail)).toBeTruthy()
  })

  it('absolute link from a splat page preserves query and hash', async () => {
    setupSplatRoutes('/catalogs/HSP-a1')
    expect(await screen.findByText('splat:HSP-a1')).toBeTruthy()

    fireEvent.click(screen.getByText('catalogs-link'))

    expect(await screen.findByText('url:/catalogs?fq=%7B%7D#list')).toBeTruthy()
    expect(screen.getByText('splat:')).toBeTruthy()
  })

  it('back and forward restore the previous splat-route views', async () => {
    const router = setupSplatRoutes('/authority-files?authorityfileid=GND-1')
    expect(await screen.findByText('page:authority')).toBeTruthy()

    fireEvent.click(screen.getByText('catalogs-link'))
    expect(await screen.findByText('page:catalogs')).toBeTruthy()

    await act(async () => {
      await router.navigate(-1)
    })
    expect(
      await screen.findByText('url:/authority-files?authorityfileid=GND-1'),
    ).toBeTruthy()

    await act(async () => {
      await router.navigate(1)
    })
    expect(await screen.findByText('url:/catalogs?fq=%7B%7D#list')).toBeTruthy()
  })
})
