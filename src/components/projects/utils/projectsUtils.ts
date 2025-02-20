import urlJoin from 'url-join'

import { AcfProject, wordpressEndpoint } from 'src/contexts/wordpress'

export interface ImageSet {
  img: string
  imgInfo: string
}

export function replaceImageUrl(url: string) {
  return urlJoin(
    wordpressEndpoint,
    'wp-content',
    url.replace(/^.*\/wp-content\//, ''),
  )
}

export function getImageSet(props: AcfProject): ImageSet[] {
  const imageSet: ImageSet[] = []
  let i = 1
  let imageKey = `image${i}`
  let imageInfoKey = `image${i}Info`
  while (imageKey && imageInfoKey in props) {
    imageSet.push({
      img: props[imageKey as keyof AcfProject] as string,
      imgInfo: props[imageInfoKey as keyof AcfProject] as string,
    })
    i = i + 1
    imageKey = `image${i}`
    imageInfoKey = `image${i}Info`
  }
  return imageSet
}

export function getProjects(projects: AcfProject[], status?: string) {
  if (status === 'finished') {
    const wantedProjects = projects.filter((element) => {
      return element.status === false
    })
    return wantedProjects
  } else if (status === 'running') {
    const wantedProjects = projects.filter((element) => {
      return element.status === true
    })
    return wantedProjects
  } else {
    return projects
  }
}

export function getDetailProject(
  projects: AcfProject[],
  projectid: string | null,
) {
  return projects.find((element) => element.id === projectid)
}

export function getPublications(publications: string): string[] {
  return publications.split('\r\n\r\n').filter((x) => x !== '')
}

export function getRunningTime(start: string, end: string) {
  const [, startMonth, startYear] = start.split('/')
  const [, endMonth, endYear] = end.split('/')
  return startMonth + '/' + startYear + ' - ' + endMonth + '/' + endYear
}

export function getTableObject(
  fields: string[],
  project: AcfProject | undefined,
) {
  if (project) {
    project.runningTime = getRunningTime(project.start, project.end)

    return fields.reduce((acc, field) => {
      const value = project[field as keyof AcfProject]
      return { ...acc, [field]: value }
    }, {})
  } else {
    return {}
  }
}

export function isFinished(end: string) {
  const [day, month, year] = end.split('/')
  const endDate = new Date(+year, parseInt(month) - 1, +parseInt(day))
  const today = new Date(Date.now())

  return today < endDate
}

export function sortDateDesc(a: AcfProject, b: AcfProject) {
  const [startDay, startMonth, startYear] = a.start.split('/')
  const [endDay, endMonth, endYear] = b.start.split('/')

  const dateA = new Date(
    +startYear,
    parseInt(startMonth) - 1,
    +parseInt(startDay),
  )
  const dateB = new Date(+endYear, parseInt(endMonth) - 1, +parseInt(endDay))

  let comparison = 0
  if (dateA > dateB) {
    comparison = -1
  } else if (dateA < dateB) {
    comparison = 1
  }
  return comparison
}
