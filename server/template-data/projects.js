const { getProjectPages } = require('../utils/wordpress')

const templateData = async (req) => {
  const metatags = []
  try {
    if (req.query.projectid) {
      const projects = await getProjectPages()
      const project = projects.find(
        (element) => element.id === req.query.projectid,
      )

      const { image1, projectTitle, descriptionShort } = project
      const title = `Handschriftenportal: ${projectTitle}`

      metatags.push(
        { key: 'property', value: 'og:type', content: 'website' },
        { key: 'property', value: 'og:title', content: title },
        { key: 'property', value: 'og:image', content: image1 },
        {
          key: 'property',
          value: 'og:description',
          content: descriptionShort,
        },
      )
    }
  } catch (err) {
    console.error(err)
  }
  return metatags
}

module.exports = templateData
