const searchTemplateData = require('./search.js')
const infoTemplateData = require('./info.js')
const projectsTemplateData = require('./projects.js')
const emptyTemplateData = require('./empty.js')
const packageJson = require('../../package.json')

const indexTemplateData = async (req) => {
  const title = `Handschriftenportal: ${req.i18n.t('topBar.logoLink')}`
  const desc = req.i18n.t('description')
  const metatags = [
    { key: 'property', value: 'og:type', content: 'website' },
    { key: 'property', value: 'og:title', content: title },
    { key: 'property', value: 'og:description', content: desc },
  ]
  return metatags
}

async function generateTemplateData(req) {
  const templateData = { metatags: [], version: packageJson.version }
  if (req.path === '/') {
    templateData.metatags.push(...(await indexTemplateData(req)))
  } else if (/\/search(.*)/.test(req.path)) {
    templateData.metatags.push(...(await searchTemplateData(req)))
  } else if (/\/info(.*)/.test(req.path)) {
    templateData.metatags.push(...(await infoTemplateData(req)))
  } else if (/\/projects(.*)/.test(req.path)) {
    templateData.metatags.push(...(await projectsTemplateData(req)))
  } else if (/\/workspace(.*)/.test(req.path)) {
    templateData.metatags.push(...(await emptyTemplateData(req)))
  } else if (/\/authority-files(.*)/.test(req.path)) {
    templateData.metatags.push(...(await emptyTemplateData(req)))
  } else if (/\/catalogs(.*)/.test(req.path)) {
    templateData.metatags.push(...(await emptyTemplateData(req)))
  }
  const hasImageOgTag = templateData.metatags.some(
    ({ value }) => value === 'og:image',
  )
  if (!hasImageOgTag) {
    templateData.metatags.push({
      key: 'property',
      value: 'og:image',
      content: '/img/hsp_01.jpg',
    })
  }
  return templateData
}
module.exports = generateTemplateData
