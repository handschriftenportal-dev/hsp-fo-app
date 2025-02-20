const express = require('express')
const { sitemapScheme, getSitemaps } = require('../middleware/sitemaps.js')

const router = express.Router()

router.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  const fullUrl = req.protocol + '://' + req.get('host')
  res.send(`User-agent: *
Sitemap: ${fullUrl}/sitemap.xml
`)
})

router.get(sitemapScheme, getSitemaps)

module.exports = router
