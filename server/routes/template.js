const express = require('express')
const nocache = require('nocache')
const generateTemplateData = require('../template-data')

const router = express.Router()

const catalogFeature = process.env.FEATURE_CATALOGS === 'true'

const indexHtmlPaths = [
  '/',
  '/search*',
  '/info*',
  '/projects*',
  '/workspace*',
  '/authority-files*',
  // '/catalogs*',
]
if (catalogFeature) {
  indexHtmlPaths.push('/catalogs*')
}

router.use(indexHtmlPaths, nocache())

router.get(indexHtmlPaths, async (req, res) => {
  const templateData = await generateTemplateData(req)
  res.render('index', templateData)
})

module.exports = router
