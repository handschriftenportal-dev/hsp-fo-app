const { getPageBySlug } = require('../utils/wordpress')

const HTMLParser = require('node-html-parser')

const templateData = async (req) => {
  const metatags = []
  try {
    const response = await getPageBySlug(req)
    if (response[0]) {
      const {
        title: { rendered: title },
        content: { rendered: html },
        excerpt: { rendered: excerpt },
      } = response[0]

      const root = HTMLParser.parse(html)?.querySelector('img')
      const firstImage = root
      if (firstImage && firstImage.getAttribute) {
        const imageSrc = firstImage.getAttribute('src')
        metatags.push({ key: 'property', value: 'og:image', content: imageSrc })
      }

      const excerptText = HTMLParser.parse(excerpt)?.firstChild?.text
      if (excerptText) {
        metatags.push({
          key: 'property',
          value: 'og:description',
          content: excerptText,
        })
      }
      metatags.push(
        { key: 'property', value: 'og:type', content: 'website' },
        { key: 'property', value: 'og:title', content: title },
      )
    }
  } catch (err) {
    console.error(err)
  }
  return metatags
}

module.exports = templateData
