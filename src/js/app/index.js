var Toast = require('mod/Toast').Toast
var NoteManager = require('mod/note-manager').NoteManager
var Event = require('mod/events')
var WaterFall = require('mod/waterfall')
require('less/normal.less')

NoteManager.load()

$('.add-note').on('click', function(){
    NoteManager.add()
})

Event.on('waterfall', function(){
    WaterFall.init($('#content'))
})