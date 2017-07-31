var express = require('express')
var router = express.Router()
var Note = require('../model/note').Note

router.get('/notes', function(req, res, next){
    var query = {raw: true}
    if(req.session.user){
        query.where = {
            uid: req.session.user.id
        }
    }
    Note.findAll(query).then(function(notes){
        console.log(notes)
        res.send({status: 0, data: notes})
    }).catch(function(){
        res.send({status: 1, errorMsg: '数据库异常'})
    })
})

/*新增note*/
router.post('/notes/add', function(req, res, next){
    if(!req.session.user){
        return res.send({status:1, errorMsg: '请先登录'})
    }
    var uid = req.session.user.id
    var note = req.body.note
    
    Note.create({text: note, uid:uid}).then(function(){
        // var Ctime = notes.createdAt
        // console.log(Ctime)
        res.send({status: 0})
    }).catch(function(){
        res.send({status: 1,errorMsg:'数据库出错'})
    })
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
    }).catch(function(){
        res.send({status: 1,errorMsg:'数据库出错'})
    })
})

router.post('/notes/delete', function(req, res, next){
    if(!req.session.user){
        return res.send({status:1, errorMsg: '请先登录'})
    }

    var uid = req.session.user.id;
    Note.destroy({where: {id:req.body.id, uid: uid}}).then( () => {
        res.send({status: 0})
    }).catch(function(){
        res.send({status: 1,errorMsg:'数据库出错'})
    })
    console.log('/delete')
})

module.exports = router