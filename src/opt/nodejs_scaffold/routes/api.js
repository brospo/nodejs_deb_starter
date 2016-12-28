var router  = require('express').Router()

router.get('/helloworld', function(req, res)
{
    res.send('helloworld!')
})

module.exports = router