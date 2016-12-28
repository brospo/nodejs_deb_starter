var mongoose = require( 'mongoose' ) 
var _const   = require('../lib/const.js')
var log      = require('../lib/log.js')

mongoose.connect(_const.DB_URI)



// CONNECTION EVENTS
mongoose.connection.on('connected', function () 
{  
    log.info('Mongoose default connection open to ' + _const.DB_URI)
})

// If the connection throws an error
mongoose.connection.on('error',function (err) 
{  
    log.error(String(err))
}) 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () 
{  
    log.error('Mongoose default connection disconnected') 
    setTimeout(function()
    {
        mongoose.connect(_const.DB_URI)
    }, _const.CONNECTION_RETRY)
})

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() 
{
    mongoose.connection.close(function () 
    { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    })
})