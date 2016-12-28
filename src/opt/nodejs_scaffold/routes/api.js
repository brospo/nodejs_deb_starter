var log    = require('../lib/log.js')
var router = require('express').Router()
var db     = require('../models/db.js') 
var person = db.model('person')

router.get('/hello', function(req, res)
{
    person.find({}, function(err, people_list)
    {
        if (people_list.length === 0)
        {
            res.status(404)
            res.send('Oh no! There is nobody to say hello to!')
            return
        }

        var list_of_names = ''
        for (var i = 0; i < people_list.length; i++)
        {
            list_of_names += people_list[i].name
            if(i !== people_list.length - 1)
            {
                list_of_names += ', '
            }
        }
        res.status(201)
        res.send('Hello: ' + list_of_names)
    })
})

router.get('/hello/:name', function(req, res)
{
    person.findOne({ name: req.params.name }, function(err, found_person)
    {
        if(found_person)
        {
            var msg = found_person.message
            if(found_person.age)
            {
                msg += ' - they are ' + String(found_person.age) + ' years old!'
            }
            
            res.status(200)
            res.send(msg)
        } else
        {
            res.status(404)
            res.send('Sorry, I could not find a person with the name: ' + req.params.name)
        }
    })
})

router.post('/person/:name', function(req, res)
{
    // Look if someone already exists
    person.findOne({ name: req.params.name }, function(err, found_person)
    {
        if (found_person)
        {
            var msg = "Person with that name already exists!" 
            log.info(msg)
            res.status(409)
            res.send(msg)
        } else
        {
            log.info('Creating new person with the name: ' + req.params.name)
            
            var new_person = new person(
            {
                name:    req.params.name,
                message: req.query.message,
                age:     req.query.age
            })
            new_person.save(function(err)
            {
                if (err)
                {
                    log.error(err)
                }
            })

            res.sendStatus(201)
        }
    })
})


router.delete('/person/:name', function(req, res)
{
    person.remove({ name: req.params.name }, function(err)
    {
        if(!err)
        {
            res.sendStatus(200)
        } else
        {
            log.error(err)
            res.sendStatus(500)
        }
    })
})
module.exports = router