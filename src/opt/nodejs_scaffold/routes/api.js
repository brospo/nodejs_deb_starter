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
        log.info('Greeted ' + String(people_list.length) + ' people')
    })
}) 

router.get('/hello/:name', function(req, res)
{
    person.findOne({ name: req.params.name }, function(err, found_person)
    {
        if (found_person)
        {
            log.info('Found person ' + found_person.name)
            var msg = found_person.message
            if(found_person.age)
            {
                log.info('Found person ' + found_person.name + ' age: ' + String(found_person.age))
                msg += ' - they are ' + String(found_person.age) + ' years old!'
            }
            
            res.status(200)
            res.send(msg)
        } else
        {
            res.status(404)
            res.send('Sorry, I could not find a person with the name: ' + req.params.name)
            log.error('Could not find person with name ' + req.params.name)
        }
    })
})

router.post('/person/:name', function(req, res)
{
    person.findOne({ name: req.params.name }, function(err, found_person)
    {
        if (found_person)
        {
            
            log.error('Person with name ' + req.params.name + ' already exists, cannot create a new one.')
            res.status(409)
            res.send('Person with that name already exists!')
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

router.put('/person/:name', function(req, res)
{
    if (!req.query.message)
    {
        log.error('Must specify message in query for editing person')
        res.status(400)
        res.send('Must specify message')
        return
    }

    if (!req.query.name)
    {
        log.error('Must specify name in query for editing person')
        res.status(400)
        res.send('Must specify name in query')
        return
    }

    var person_data = 
    {
        name: req.query.name,
        message: req.query.message,
    }
    if (req.query.age)
    {
        log.info('Using age in put request for name ' + req.params.name)
        person_data.age = req.query.age
    }

    person.findOneAndUpdate({ name: req.params.name }, person_data, function(err, doc)
    {
        if (err)
        {
            res.status(500)
            res.send('Error updating person')
            log.error('Error occured when updating person ' + req.params.name + ' ' + err)
            return
        }

        if(!doc)
        {
            res.sendStatus(404)
            return
        }
        
        log.info('Succefully updated entry for person: ' + req.params.name)
        res.sendStatus(200)
    })
    
})

router.delete('/person/:name', function(req, res)
{
    person.remove({ name: req.params.name }, function(err)
    {
        if (!err)
        {
            res.sendStatus(200)
            log.info('Person with name ' + req.params.name + ' was deleted')
        } else
        {
            log.error('Error deleting person' + err)
            res.sendStatus(500)
        }
    })
})

module.exports = router