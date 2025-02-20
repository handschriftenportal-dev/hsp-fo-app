export const gndPlaces = [
  'PlaceOrGeographicName',
  'AdministrativeUnit',
  'BuildingOrMemorial',
  'Country',
  'Place',
  'ExtraterrestrialTerritory',
  'FictivePlace',
  'MemberState',
  'NameOfSmallGeographicUnitLyingWithinAnotherGeographicUnit',
  'NaturalGeographicUnit',
  'ReligiousTerritory',
  'TerritorialCorporateBodyOrAdministrativeUnit',
  'WayBorderOrLine',
]

export const gndCorporateBody = [
  'CorporateBody',
  'Company',
  'FictiveCorporateBody',
  'MusicalCorporateBody',
  'OrganOfCorporateBody',
  'ProjectOrProgram',
  'ReligiousAdministrativeUnit',
  'ReligiousCorporateBody',
]

export const gndPerson = [
  'Person',
  'DifferentiatedPerson',
  'CollectivePseudonym',
  'Gods',
  'LiteraryOrLegendaryCharacter',
  'Pseudonym',
  'RoyalOrMemberOfARoyalHouse',
  'Spirits',
  'UndifferentiatedPerson',
]

export const entityMapping: Record<string, string> = {
  place: 'Place',
  corporateBody: 'CorporateBody',
  person: 'Person',
}
