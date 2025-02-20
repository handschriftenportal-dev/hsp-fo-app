import { gndCorporateBody, gndPerson, gndPlaces } from '../config'

export const getAuthorityEntityType = (typeName: string) => {
  if (gndPlaces.includes(typeName)) {
    return 'place'
  }
  if (gndPerson.includes(typeName)) {
    return 'person'
  }
  if (gndCorporateBody.includes(typeName)) {
    return 'corporateBody'
  }
}
