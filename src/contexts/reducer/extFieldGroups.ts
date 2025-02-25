import { searchBarOptions } from 'src/components/search/config'

export const extFieldGroups = [
  ...searchBarOptions.map((name, index) => ({
    group: 0,
    groupCategory: index,
    name,
    type: 'text',
  })),
  { group: 1, groupCategory: 1, name: 'settlement-search' },
  { group: 1, groupCategory: 2, name: 'repository-search' },
  { group: 1, groupCategory: 3, name: 'idno-search' },
  { group: 1, groupCategory: 4, name: 'idno-alternative-search' },
  {
    group: 1,
    groupCategory: 5,
    name: 'former-ms-identifier-search',
  },
  {
    group: 2,
    groupCategory: 1,
    name: 'object-type-search',
  },
  { group: 2, groupCategory: 2, name: 'material-search' },
  { group: 2, groupCategory: 3, name: 'leaves-count-search' },
  {
    group: 2,
    groupCategory: 4,
    name: 'format-search',
  },
  { group: 2, groupCategory: 5, name: 'height-search' },
  { group: 2, groupCategory: 6, name: 'width-search' },
  { group: 3, groupCategory: 1, name: 'orig-place-search' },
  { group: 3, groupCategory: 2, name: 'orig-date-from-search' },
  { group: 3, groupCategory: 3, name: 'orig-date-to-search' },
  { group: 3, groupCategory: 4, name: 'orig-date-when-search' },
  {
    group: 3,
    groupCategory: 5,
    name: 'orig-date-type-search',
  },
  { group: 4, groupCategory: 1, name: 'person-author-search' },
  { group: 4, groupCategory: 2, name: 'person-scribe-search' },
  {
    group: 4,
    groupCategory: 3,
    name: 'person-mentioned-in-search',
  },
  {
    group: 4,
    groupCategory: 4,
    name: 'person-previous-owner-search',
  },
  {
    group: 4,
    groupCategory: 5,
    name: 'person-translator-search',
  },
  {
    group: 4,
    groupCategory: 6,
    name: 'person-illuminator-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 7,
    name: 'person-bookbinder-search',
  },
  {
    group: 4,
    groupCategory: 8,
    name: 'person-commissioned-by-search',
  },
  {
    group: 4,
    groupCategory: 9,
    name: 'person-conservator-search',
  },
  { group: 4, groupCategory: 10, name: 'person-other-search' },

  { group: 5, groupCategory: 1, name: 'language-search' },
  { group: 5, groupCategory: 2, name: 'work-title-search' },
  { group: 5, groupCategory: 3, name: 'title-in-ms-search' },
  { group: 5, groupCategory: 4, name: 'initium-search' },
  { group: 5, groupCategory: 5, name: 'incipit-search' },
  { group: 5, groupCategory: 6, name: 'explicit-search' },
  { group: 5, groupCategory: 7, name: 'colophon-search' },
  { group: 5, groupCategory: 8, name: 'quotation-search' },
  {
    group: 5,
    groupCategory: 9,
    name: 'illuminated-search',
  },
  {
    group: 5,
    groupCategory: 10,
    name: 'has-notation-search',
  },
  {
    group: 6,
    groupCategory: 1,
    name: 'physical-description-search',
  },
  { group: 6, groupCategory: 2, name: 'binding-search' },
  { group: 6, groupCategory: 3, name: 'fragment-search' },
  { group: 6, groupCategory: 4, name: 'history-search' },
  { group: 6, groupCategory: 5, name: 'fulltext-search' },

  { group: 7, groupCategory: 1, name: 'author-search' },
  {
    group: 7,
    groupCategory: 2,
    name: 'publish-year-search',
  },
  {
    group: 8,
    groupCategory: 1,
    name: 'described-object-search',
  },
  {
    group: 8,
    groupCategory: 2,
    name: 'digitized-object-search',
  },
  {
    group: 8,
    groupCategory: 3,
    name: 'digitized-iiif-object-search',
  },
  {
    group: 9,
    groupCategory: 1,
    name: 'institution-producing-search',
  },
  {
    group: 9,
    groupCategory: 2,
    name: 'institution-previously-owning-search',
  },
  {
    group: 9,
    groupCategory: 3,
    name: 'institution-mentioned-search',
  },
]
