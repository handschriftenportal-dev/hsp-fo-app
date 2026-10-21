const express = require('express')
const router = express.Router()

const featureFlags = {
  catalogs: process.env.FEATURE_CATALOGS === 'true',
  annotation: process.env.FEATURE_ANNOTATION === 'true',
}
router.get('/api/features', function (_req, res) {
  res.json(featureFlags)
})

module.exports = router
