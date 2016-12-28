var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var person_schema = new Schema(
{
    name:    { type: String, required: true },
    message: { type: String, required: true },
    age:       Number
})

var person = mongoose.model('person', person_schema)

module.exports = person