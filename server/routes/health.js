const express = require('express')
const { getServicesHealth } = require('../utils/health')

const router = express.Router()

router.get('/api/health', async function (_req, res) {
  const packageJson = require('../../package.json')
  res.json({
    app: "I'm fine.",
    version: packageJson.version,
    // services: await getServicesHealth(_req),
  })
})

module.exports = router
