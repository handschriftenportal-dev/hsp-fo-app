export const wordpressEndpoint = '/api/wordpress'

export interface WordpressPage {
  id: number
  title: {
    rendered?: string
  }
  content: {
    rendered: string
  }
}

export interface MenuProps {
  id: string
  link: string
  label: string
  children: MenuProps[]
  error?: string
}

export interface MenusProps {
  de: MenuProps[]
  en: MenuProps[]
}

// what we have is page = [{WPPAge}, {object containing paging and co}]
export interface WordpressMenuItem {
  ID: number
  title: string
  url: string
  // eslint-disable-next-line camelcase
  child_items?: WordpressMenuItem[]
}

export interface AcfProject {
  id: string
  descriptionShort: string
  start: string
  end: string
  description: string
  publications: string
  links: string
  contact: string
  involved: string
  involvedInstitutions: string
  support: string
  projectName: string
  projectTitle: string
  thumbnail: string
  thumbnailInfo: string
  image1: string
  image1Info: string
  image2?: string
  image2Info?: string
  image3?: string
  image3Info?: string
  runningTime?: string
  status?: boolean
  manuscriptListing?: string
  kodLink?: string
  className?: string
}

export interface ImageSet {
  url: string
  ident: string
  info: string
}
