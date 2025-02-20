// from here: https://regex101.com/library/8ZjAYC
const IIIFImageURLRegex =
  /^\/([a-zA-Z0-9_\-!./]+)\/{0,1}((\/(full|square|([1-9]\d*|0),([1-9]\d*|0),([1-9]\d*),([1-9]\d*)|pct:(([1-9]\d*|0)(\.\d+)?),(([1-9]\d*|0)(\.\d+)?),([1-9]\d{0,1}(\.\d*)?|0\.[0]*[1-9]+|100(\.0+)?),([1-9]\d{0,1}(\.\d*)?|0\.[0]*[1-9]+|100(\.0+)?)|(\w+))\/(full|max|([1-9]\d*),|,([1-9]\d*)|(!)?([1-9]\d*),([1-9]\d*)|pct:(([1-9]\d*)(\.\d+)?)|(\w+))\/(!)?([1-9]\d*|0|(\w+))(\.\d+)?\/(default|color|gray|bitonal|(\w+))\.(jpg|tif|png|webp|pdf|jp2|(\w+)))){0,1}$/gim

const isIIIFImageUrl = async (url) => {
  // slice -5, because then we only have the required IIIF-Image API part: {identifier}/{region}/{size}/{rotation}/{quality}.{format}
  const iiifPartCandidate = `/${url.split('/').slice(-5).join('/')}`
  // filter out "undefined" matches
  const matches = [...iiifPartCandidate.matchAll(IIIFImageURLRegex)][0].filter(
    (match) => !!match,
  )
  /*
  This 7 is abritrary at the moment. e.g. for the input URL
  https://api.digitale-sammlungen.de/iiif/image/v2/bsb00087339_00003/full/280,/0/default.jpg
  the regex will return 10 filteredMatches
  see issue https://projects.dev.sbb.berlin/issues/17130 for a starting with a better way going forward
  */
  return matches.length > 7
}

const SEOifyIIIFImageUrl = (url) => {
  // see https://iiif.io/api/image/3.0/#image-request-uri-syntax
  // same for 2.1 and 3.0: {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
  const parts = url.split('/').reverse()
  parts[2] = '1200,'
  const newUrl = parts.reverse().join('/')
  return newUrl
}

/* 
siehe https://projects.dev.sbb.berlin/projects/praesentation-und-suche/wiki/SEO_und_Metatag_M%C3%B6glichkeiten#Auswahl-des-Images
1.  Bei mehreren am KOD vorhandenen Digitalisaten: Digitalisat mit explizit angegebenem Thumbnail -> wenn kein Digitalist über Thumbails verfügt, Default-Image.
// example: https://handschriftenportal.de/search?hspobjectid=HSP-d19c9832-98e7-3a22-a21a-6cf2ab6a1c0b&q=clm+14466&hl=true
2.  Bei mehreren Digitalisaten mit Thumbnail: IIIF-Digitalisat -> wenn keines der verbliebenen Digitalisate IIIF unterstützt, vorhandenes Thumbnail des jüngsten Digitalisats nutzen (Noch zu testen. Falls zu pixelig, stattdessen Default-Image)
3.  Bei mehreren IIIF-Digitalisate, das jüngste (Daten sollten angegeben sein(?), sonst random)
4.  IIIF-URL des Thumbnails manipulieren (Image API 2.0 und 3.0 ggf. separat), z. B.:
  - Original: https://iiif.ub.uni-leipzig.de/iiif/j2k/0000/0098/0000009810/00000005.jpx/full/,200/0/default.jpg
  - Neu: https://iiif.ub.uni-leipzig.de/iiif/j2k/0000/0098/0000009810/00000005.jpx/full/1200,/0/default.jpg (oder wie es gefordert ist)
    --> wenn keine korrekte Antwort vom Server, kleines Thumbnail behalten (Noch zu testen. Falls zu pixelig, stattdessen Default-Image)
*/

const imageUrlFor = async (payload) => {
  let imageUrl

  if (
    Array.isArray(payload?.hspDigitizeds) &&
    payload.hspDigitizeds.length > 0
  ) {
    const { hspDigitizeds } = payload
    const sortedHspDigitized = hspDigitizeds
      .sort(
        (
          { 'issuing-date-display': issuingDateDisplayA }, // könnte auch im IIIF stehen, Lutz fragen
          { 'issuing-date-display': issuingDateDisplayB },
        ) => {
          return new Date(issuingDateDisplayB) - new Date(issuingDateDisplayA)
        },
      )
      .sort(
        (
          { 'manifest-uri-display': IIIFA },
          { 'manifest-uri-display': IIIFB },
        ) => {
          const isIIIFA = !!IIIFA
          const isIIIFB = !!IIIFB
          // based on https://stackoverflow.com/a/17387454
          return isIIIFA === isIIIFB ? 0 : isIIIFA ? -1 : 1
        },
      )
      .sort(
        (
          { 'thumbnail-uri-display': thumbnailA },
          { 'thumbnail-uri-display': thumbnailB },
        ) => {
          const isThumbnailA = !!thumbnailA
          const isThumbnailB = !!thumbnailB
          // based on https://stackoverflow.com/a/17387454
          return isThumbnailA === isThumbnailB ? 0 : isThumbnailA ? -1 : 1
        },
      )

    const imageUrlCandidate = sortedHspDigitized[0]
    if (imageUrlCandidate?.['thumbnail-uri-display']) {
      imageUrl = imageUrlCandidate['thumbnail-uri-display']
      if (
        imageUrlCandidate['manifest-uri-display'] &&
        (await isIIIFImageUrl(imageUrl))
      ) {
        const candidateImageUrl = SEOifyIIIFImageUrl(imageUrl)
        if (await isIIIFImageUrl(candidateImageUrl)) {
          imageUrl = candidateImageUrl
        }
      }
    }
  }
  return imageUrl
}

module.exports = {
  imageUrlFor,
}
