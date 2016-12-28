var express    = require('express')
var https      = require('https')
var fs         = require('fs')
var bodyParser = require('body-parser')

// Local imports
var log    = require('./lib/log.js')
var _const = require('./lib/const.js')
var db     = require('./models/db.js')

// Express setup
var app = express()
app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())

// Routers
var api = require('./routes/api.js')
app.use('/api/', api)

// Interrupt handlers
process.on('SIGTERM', function()
{
    log.info('SIGTERM: ' + _const.APP_NAME + ' server shutting down')
    process.exit()
})

process.on('SIGINT', function()
{
    log.info('SIGINT: ' + _const.APP_NAME + ' server shutting down')
    process.exit()
})

var start_server = function()
{
    var options =
    {
        key:  fs.readFileSync(_const.HTTPS_KEY),
        cert: fs.readFileSync(_const.HTTPS_CERT),
    }

    var server = https.createServer(options, app)
    .listen(_const.LISTEN_PORT, function()
    {
        log.info('Service is listening on port ' + _const.LISTEN_PORT)
        return
    })

    server.on('error', function(err)
    {
        log.info(err)
    })

}; start_server();
