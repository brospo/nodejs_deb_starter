var express    = require('express')
var https      = require('https')
var fs         = require('fs')
var bodyParser = require('body-parser')

var mongoose   = require('mongoose')
var db         = mongoose.connect('mongodb://127.0.0.1/db')
var Schema     = mongoose.Schema;

// Local imports
var log        = require('./lib/log.js').winston
var acvs_const = require('./lib/const.js')

// Globals
var app = express();
app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

// Interrupt handlers
process.on('SIGTERM', function()
{
    log.info('SIGTERM: ' + acvs_const.APP_NAME + ' server shutting down')
    process.exit()
});

process.on('SIGINT', function()
{
    log.info('SIGINT: ' + acvs_const.APP_NAME + ' server shutting down')
    process.exit()
});

var main = function()
{
    var options =
    {
        key:  fs.readFileSync(acvs_const.HTTPS_KEY),
        cert: fs.readFileSync(acvs_const.HTTPS_CERT),
    }

    var server = https.createServer(options, app)
    .listen(acvs_const.LISTEN_PORT, function()
    {
        log.info('Service is listening on port ' + acvs_const.LISTEN_PORT)
        return
    })

    server.on('error', function(err)
    {
        log.info(err)
    })


}; main();
