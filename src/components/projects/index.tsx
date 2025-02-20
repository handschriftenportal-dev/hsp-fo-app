import React from 'react'
import { useSelector } from 'react-redux'
import { useLoaderData, useSearchParams } from 'react-router-dom'

import {
  getRunningTime,
  isFinished,
  sortDateDesc,
} from 'src/components/projects/utils/projectsUtils'
import { ProjectsLoaderDataProps } from 'src/contexts/loader'
import { selectors } from 'src/contexts/selectors'

import { DetailPage } from './Detailpage/index'
import { EntryPage } from './EntryPage/index'

interface Props {
  className?: string
}

export function Projects({ className }: Readonly<Props>) {
  const [searchParams] = useSearchParams()
  const projectid = searchParams.get('projectid')

  const projectStatus = useSelector(selectors.getProjectStatus)

  const { projects } = useLoaderData() as ProjectsLoaderDataProps

  projects.forEach((projectEntry) => {
    projectEntry.status = isFinished(projectEntry.end)
    projectEntry.runningTime = getRunningTime(
      projectEntry.start,
      projectEntry.end,
    )
    return projectEntry
  })
  projects.sort(sortDateDesc)

  // add running time and status to projects
  projects.forEach((projectEntry) => {
    projectEntry.status = isFinished(projectEntry.end)
    projectEntry.runningTime = getRunningTime(
      projectEntry.start,
      projectEntry.end,
    )
    return projectEntry
  })
  projects.sort(sortDateDesc)

  return (
    <div id="hsp-projects-main">
      {projectid ? (
        <DetailPage className={className} />
      ) : (
        <EntryPage
          className={className}
          projects={projects}
          projectStatus={projectStatus}
        />
      )}
    </div>
  )
}
