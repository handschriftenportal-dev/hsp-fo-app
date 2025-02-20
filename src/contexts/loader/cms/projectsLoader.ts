import urlJoin from 'proper-url-join'
import { QueryClient } from 'react-query'
import WPAPI from 'wpapi'

import { getDetailProject } from 'src/components/projects/utils/projectsUtils'
import { AcfProject, wordpressEndpoint } from 'src/contexts/wordpress'

export interface ProjectsLoaderDataProps {
  projects: AcfProject[]
  project: AcfProject
}

interface WPPages {
  pages: AcfProject[]
  _paging: { total: number; totalPages: number }
}

async function getAllPages(id: number, perPage = 100): Promise<WPPages[]> {
  let allPages: WPPages[] = []
  const wp = new WPAPI({
    endpoint: urlJoin(wordpressEndpoint, '/wp-json'),
  })

  function fetchPages(
    id: number,
    page: number,
    perPage = 100,
  ): Promise<WPPages> {
    return wp
      .pages()
      .param('parent', id)
      .param('per_page', perPage)
      .param('page', page)
      .get()
  }
  const firstPage = await fetchPages(id, 1, perPage)

  const totalPages = firstPage._paging.totalPages
  allPages = allPages.concat(firstPage)

  for (let page = 2; page <= totalPages; page++) {
    const fetchedPages = await fetchPages(id, page, perPage)
    allPages = allPages.concat(fetchedPages)
  }

  return allPages
}

function getProjectPages(): Promise<AcfProject[]> {
  const wp = new WPAPI({
    endpoint: urlJoin(wordpressEndpoint, '/wp-json'),
  })

  return wp
    .pages()
    .slug('projekte')
    .then((parentPage) => getAllPages(parentPage[0].id)) // get pages with id
    .then((pages) => pages.map((page: { acf: AcfProject }) => page.acf)) // extract acf information
}

export async function fetchProjects(queryClient: QueryClient) {
  const queryKeyProjects = ['projects']
  const queryFnProjects = () => getProjectPages()

  return (
    queryClient.getQueryData(queryKeyProjects) ??
    (await queryClient.fetchQuery(queryKeyProjects, queryFnProjects))
  )
}

export const projectLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const projects = await fetchProjects(queryClient)
    const projectid = new URL(request.url).searchParams.get('projectid')
    const project = getDetailProject(projects as AcfProject[], projectid)

    if (!projects) {
      const statusText = 'No projects found'
      throw new Response(statusText, { statusText, status: 404 })
    }
    if (projectid && !project) {
      const statusText = 'No project found'
      throw new Response(statusText, { statusText, status: 400 })
    }

    return { projects, project }
  }
