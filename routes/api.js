var express = require('express')
var router = express.Router()
var Note = require('../model/note').Note

router.get('/notes', function(req, res, next){
    Note.findAll({raw: true}).then(function(notes){
         res.send({status: 0, data: notes})
    })
})

router.post('/notes/add', function(req, res, next){
    console.log(req.session.user)
    if(!req.session.user){
        return res.send({status:1, errorMsg: '请先登录'})
    }
    
    var note = req.body.note
    Note.create({text: note}).then(function(){
        res.send({status: 0})
    }).catch(function(){
        res.send({status: 1,errorMsg:'数据库出错'})
    })
    console.log('/add', note)
})

router.post('/notes/edit', function(req, res, next){
    if(!req.session.user){
        return res.send({status:1, errorMsg: '请先登录'})
    }

    var noteId = req.body.id;
    var note = req.body.note;
    var uid = req.session.user.id;
    Note.update({text: note}, {where:{id:noteId, uid: uid}}).then( () => {
        res.send({status: 0})
    })
})

router.post('/notes/delete', function(req, res, next){
    if(!req.session.user){
        return res.send({status:1, errorMsg: '请先登录'})
    }

    Note.destroy({where: {id:req.body.id}}).then( () => {
        res.send({status: 0})
    })
    console.log('/delete')
})

module.exports = router