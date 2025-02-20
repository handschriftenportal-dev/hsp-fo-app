const fetch = require('isomorphic-unfetch')
const { getDiscoveryServiceEndpoint } = require('../discoveryService')
const { imageUrlFor } = require('../utils/images')

const overviewSearchData = async (req) => {
  const { t } = req.i18n
  const metatags = []
  try {
    const response = await (
      await fetch(
        `${getDiscoveryServiceEndpoint()}/hspobjects/${req.query.hspobjectid}`,
      )
    ).json()

    const {
      'settlement-display': settlementDisplay,
      'repository-display': repositoryDisplay,
      'idno-display': idnoDisplay,
      'object-type-display': objectTypeDisplay,
      'orig-date-lang-display': origDateLangDisplay,
      'title-display': titleDisplay,
    } = response.payload.hspObject

    const signatureId = [
      settlementDisplay,
      repositoryDisplay,
      idnoDisplay,
    ].join(', ')
    const objectType = t([
      `data.object-type-display.${objectTypeDisplay}`,
      `data.object-type-display.__MISSING__`,
    ])
    const origDateLang = origDateLangDisplay ? ` (${origDateLangDisplay}):` : ''
    const title = titleDisplay ? ` ${titleDisplay}` : ''
    const desc = [objectType, origDateLang, title].join('')
    metatags.push(
      { key: 'property', value: 'og:title', content: signatureId },
      { key: 'property', value: 'og:description', content: desc },
      { key: 'property', value: 'og:type', content: 'book' },
    )
    const imageUrl = await imageUrlFor(response.payload)
    if (imageUrl) {
      metatags.push({ key: 'property', value: 'og:image', content: imageUrl })
    }
  } catch (err) {
    console.error(err)
  }
  return metatags
}

const listViewSearchData = async (req) => {
  const { t } = req.i18n
  const metatags = []

  const searchParams = {
    q: '*',
    start: 0,
    rows: 10,
    ...req.query,
  }

  try {
    const response = await (
      await fetch(
        getDiscoveryServiceEndpoint() +
          '/hspobjects/search?' +
          new URLSearchParams(searchParams),
      )
    ).json()
    const title = `Handschriftenportal: ${t('searchResults')}`
    const descBeginning = t('filterPanel.filterResult', {
      numFound: response?.metadata?.numFound,
    })
    const pageNumber = Math.floor(searchParams.start / searchParams.rows) + 1
    const searchQuery = searchParams.q !== '*' ? ` - "${searchParams.q}"` : ''

    const description = `${descBeginning}. - ${t(
      'paging.page',
    )} ${pageNumber}.${searchQuery}`

    metatags.push(
      {
        key: 'property',
        value: 'og:title',
        content: title,
      },
      {
        key: 'property',
        value: 'og:description',
        content: description,
      },
    )
  } catch (err) {
    console.error(err)
  }
  return metatags
}

const templateData = async (req) => {
  let metatags = []

  if (req.query && req.query.hspobjectid) {
    metatags = await overviewSearchData(req)
  } else {
    metatags = await listViewSearchData(req)
  }
  return metatags
}

module.exports = templateData
