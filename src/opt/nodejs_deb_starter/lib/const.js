var utils = require('./utils')
exports = module.exports

// Logging Options
exports.APP_NAME          = 'nodejs_deb_starter'
exports.SYSLOG_LEVEL      = 'info'
exports.CONSOLE_LOG       = true
exports.CONSOLE_LOG_LEVEL = 'debug'

exports.LISTEN_PORT = 4242

cert_path = utils.remove_last_directory(__dirname) + '/certs/'
exports.HTTPS_KEY  = cert_path + 'private.pem'
exports.HTTPS_CERT = cert_path + 'nodejs_deb_starter.pem'

exports.DB_URI = 'mongodb://127.0.0.1/db'
exports.CONNECTION_RETRY = 3000 // milliseconds