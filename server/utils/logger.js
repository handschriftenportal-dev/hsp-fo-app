/************************************************
 * Simple stdout logger
 ***********************************************/

const logger = (type, message) => {
  const date = new Date().toUTCString()
  const _message = message.replace(/\n/g, ' ')
  console.log(`${date}: ${type}: ${_message}`)
}

module.exports = logger
