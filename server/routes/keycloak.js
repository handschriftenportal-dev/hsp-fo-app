const express = require('express')
const router = express.Router()

const keycloak = {
  url: process.env.KEYCLOAK_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
}
router.get('/api/keycloak', function (_req, res) {
  res.json(keycloak)
})

module.exports = router
