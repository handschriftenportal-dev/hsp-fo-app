const fetch = require('isomorphic-unfetch')

const templateData = async (req) => {
  const metatags = []
  // if (req.query && req.query.hspobjectid) {
  //   // TODO maybe use a graphql endpoint here
  //   // TODO, fix after https://projects.dev.sbb.berlin/issues/16970
  //   const response = await (
  //     await fetch(
  //       `http://localhost:8080/api/search/hspobjects/${req.query.hspobjectid}`
  //     )
  //   ).json()
  //   const metatag = {
  //     key: 'name',
  //     value: 'description',
  //     content: response.data.payload.hspObject['title-display'],
  //   }
  //   metatags.push(metatag)
  // }
  return metatags
}

module.exports = templateData
