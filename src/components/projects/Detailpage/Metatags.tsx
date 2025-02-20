import { useSetMetatag } from 'src/contexts/Metatags'
import { AcfProject } from 'src/contexts/wordpress'

interface Props {
  project: AcfProject
}

// based on https://projects.dev.sbb.berlin/projects/praesentation-und-suche/wiki/SEO_und_Metatag_M%C3%B6glichkeiten#Einzelne-Projektseiten-dynamisch
export function Metatags({ project }: Props) {
  const { descriptionShort } = project

  useSetMetatag({
    key: 'name',
    value: 'description',
    content: descriptionShort,
  })

  return null
}
