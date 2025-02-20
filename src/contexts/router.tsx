import React from 'react'
import { QueryClient } from 'react-query'
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom'

import { Navigation } from 'src/components/navigation'
import { SkipLink } from 'src/components/navigation/shared/SkipLink'
import { ExtendedSearchView } from 'src/components/search/Main/ExtendedSearchView'
import { ErrorPage } from 'src/components/shared/ErrorPage'
import { AuthorityFile } from 'src/pages/AuthorityFile'
import { Catalogs } from 'src/pages/Catalogs'
import { Cms } from 'src/pages/Cms'
import { Home } from 'src/pages/Home'
import { Projects } from 'src/pages/Projects'
import { Search } from 'src/pages/Search'
import { Workspace } from 'src/pages/Workspace'

import {
  catalogLoader,
  cmsLoader,
  homeLoader,
  menuLoader,
  normLoader,
  projectLoader,
  searchLoader,
} from './loader'

function ErrorBoundary() {
  const error = useRouteError()

  return <ErrorPage id={error as string} />
}

export function Layout() {
  return (
    <>
      <SkipLink />
      <Navigation Outlet={<Outlet />} />
      <ScrollRestoration
        getKey={(location) => {
          const paths = ['/search', '/projects']
          return paths.includes(location.pathname)
            ? location.search
            : location.pathname
        }}
      />
    </>
  )
}

const queryClient = new QueryClient()

function createRouter(hasKeycloak?: boolean) {
  return createBrowserRouter([
    {
      path: '/',
      loader: menuLoader(queryClient),
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
          loader: homeLoader(queryClient),
        },
        {
          path: 'search',
          children: [
            {
              index: true,
              element: <Search />,
              loader: searchLoader(queryClient),
              errorElement: <ErrorBoundary />,
            },
            {
              path: 'extended',
              element: <ExtendedSearchView />,
              errorElement: <ErrorBoundary />,
            },
          ],
        },
        {
          path: 'authority-files/*',
          element: <AuthorityFile />,
          loader: normLoader(queryClient),
          errorElement: <ErrorBoundary />,
        },
        {
          path: 'catalogs/*',
          loader: catalogLoader(queryClient),
          element: <Catalogs />,
          errorElement: <ErrorBoundary />,
        },
        {
          path: 'workspace',
          element: <Workspace hasKeycloak={hasKeycloak} />,
        },
        {
          path: 'projects/*',
          element: <Projects />,
          loader: projectLoader(queryClient),
          errorElement: <ErrorBoundary />,
        },
        {
          path: 'info/:slug',
          element: <Cms />,
          loader: cmsLoader(queryClient),
          errorElement: <ErrorBoundary />,
        },
      ],
    },
  ])
}

export function Router({ hasKeycloak }: { hasKeycloak?: boolean }) {
  const router = createRouter(hasKeycloak)

  return <RouterProvider router={router} />
}
