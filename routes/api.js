var express = require('express')
var router = express.Router()

router.get('/notes', function(req, res, next){
    console.log('/notes')
})

router.post('/notes/add', function(req, res, next){
    var note = req.body.note
    console.log('/add', note)
})

router.post('/notes/edit', function(req, res, next){
    console.log('/edit')
})

router.post('/notes/delete', function(req, res, next){
    console.log('/delete')
})

module.exports = router