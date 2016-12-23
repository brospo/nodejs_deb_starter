var acvs_const = require('./const.js')
var winston = require('winston')
require('winston-syslog').Syslog;

winston.clear()

winston.setLevels(winston.config.syslog.levels);

var syslog_options = 
{
    'path': '/dev/log',
    'protocol':'unix',
    'level':acvs_const.SYSLOG_LEVEL,
    'app_name': acvs_const.APP_NAME,
    'localhost': ''
}

winston.add(winston.transports.Syslog, syslog_options);

if (acvs_const.CONSOLE_LOG)
{
    var console_options = {'colorize': true, 'level': acvs_const.CONSOLE_LOG_LEVEL}
    winston.add(winston.transports.Console, console_options)
}

module.exports =
{
    winston
}
