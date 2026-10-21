const express = require('express')
const router = express.Router()

const trackingConfig = {
  activate: process.env.TRACKING_ACTIVATE === 'true',
  matomoBaseUrl: process.env.TRACKING_MATOMO_BASE_URL || '',
  matomoSiteId: parseInt(process.env.TRACKING_MATOMO_SITE_ID) || 0,
  clientMockOrigin: process.env.TRACKING_CLIENT_MOCK_ORIGIN,
}

router.get('/api/tracking', function (_req, res) {
  res.json(trackingConfig)
})

module.exports = router
