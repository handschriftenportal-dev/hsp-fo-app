import React, { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import { Projects as ProjectsModule } from 'src/components/projects/index'
import { ProjectsLoaderDataProps } from 'src/contexts/loader/cms'
import { useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'

export function Projects() {
  useSetupModulesForPage()
  useTrackPageView('Projects')

  const { projects } = useLoaderData() as ProjectsLoaderDataProps

  return (
    <Suspense fallback={null}>
      <Await resolve={projects}>
        <ProjectsModule />
      </Await>
    </Suspense>
  )
}
