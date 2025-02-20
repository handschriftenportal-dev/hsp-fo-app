const path = require('path')
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const i18nextMiddleware = require('i18next-http-middleware')

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'en',
    preload: ['en', 'de'],
    ns: ['backend'],
    defaultNS: 'backend',
    // debug: true,
  })

module.exports = {
  i18next,
  i18nextMiddleware,
}
