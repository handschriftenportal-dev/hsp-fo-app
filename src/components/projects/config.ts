import { AcfProject } from 'src/contexts/wordpress'

export const dataTableFieldsLeft: (keyof AcfProject)[] = [
  'id',
  'runningTime',
  'support',
  'links',
]

export const dataTableFieldsRight: (keyof AcfProject)[] = [
  'involvedInstitutions',
  'involved',
  'contact',
]
