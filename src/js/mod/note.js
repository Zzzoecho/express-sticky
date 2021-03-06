require('less/note.less')

var Toast = require('./Toast').Toast
var Event = require('./events')

function Note(opts){
    this.initOpts(opts)
    this.createNote(opts)
    this.setStyle()
    this.bindEvent()
}

Note.prototype = {
    colors: [
        ['#f05e1c', '#f68657'],
        ['#de7e73', '#f7aa97'],
        ['#ffc952', '#f6ea8c'],
        ['#c24226', '#d15a39'],
        ['#77919d', '#9baec8'],
        ['#1f4e5f', '#79a8a9']
    ],

    defaultOpts: {
        id: '',
        $ct: $('#content').length>0 ? $('#content'):$('body'),  //默认存放note的容器
        context: 'input here',
        time: 'Date',
        username: ''
    },

    initOpts: function(opts){
        var _this = this
        this.opts = $.extend({}, this.defaultOpts, opts||{})
        if(this.opts.id){
            this.id = this.opts.id
        }
        if(this.opts.time === 'Date'){
            _this.opts.time = new Date().toLocaleDateString()
        }else {
            _this.opts.time = new Date(_this.opts.time).toLocaleDateString()
        }
        
    },

    createNote: function(opts){
        var tpl = '<div class="note">'
                + '<div class="note-head"><span class="delete">&times;</span></div>'
                + '<div class="note-ct" contenteditable="true"></div>' //contenteditable es5的语法 可编辑
                + '<div class="note-footer"><span class="username"></span><span class="time"></span></div>'
                + '</div>'
        this.$note = $(tpl)
        this.$note.find('.note-ct').html(this.opts.context)
        this.$note.find('.note-footer .time').text(this.opts.time)
        this.$note.find('.note-footer .username').text(this.opts.username)
        this.opts.$ct.append(this.$note)
        if(!this.id) this.$note.css('bottom', '10px')
    },
    
    setStyle: function(){
        var color = this.colors[Math.floor(Math.random() * 6)]
        this.$note.find('.note-head').css('background-color', color[0])
        this.$note.find('.note-ct').css('background-color', color[1])
        this.$note.find('.note-footer').css('background-color', color[1])
    },

    setLayout: function(){
        var _this = this
        if(_this.clk){
            clearTimeout(_this.clk)
        }
        _this.clk = setTimeout(function(){
            Event.fire('waterfall')
        }, 100)
    },

    bindEvent: function(){
        var _this = this,
            $note = this.$note,
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-ct'),
            $delete = $note.find('.delete'),
            $addNote = $noteHead.find('.add-note')

        $delete.on('click', function(){
            _this.delete()
        })

        $noteCt.on('focus', function(){
            if($noteCt.html() == 'input here') $noteCt.html('')
            $noteCt.data('before', $noteCt.html())
        }).on('blur paste', function(){
            if($noteCt.data('before') != $noteCt.html()){
                $noteCt.data('before', $noteCt.html())
                _this.setLayout()
                if(_this.id){
                    _this.edit($noteCt.html())
                }else{
                    _this.add($noteCt.html())
                }
            }
        })

        $noteHead.on('mousedown', function(e){
            var evtX = e.pageX - $note.offset().left,  //计算事件的触发点在dialog内部到dialog左边缘的距离
                evtY = e.pageY - $note.offset().top
            $note.addClass('draggable').data('evtPos', {x: evtX, y:evtY})  //添加class代表note被鼠标选中在移动状态
        }).on('mouseup', function(){
            $note.removeClass('draggable').removeData('pos')
        })

        $('body').on('mousemove', function(e){
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY-$('.draggable').data('evtPos').y,
                left: e.pageX-$('.draggable').data('evtPos').x
            })
        })
    },

    edit: function(msg){
        var _this = this
        $.post('/api/notes/edit', {
            id: this.id,
            note: msg
        }).done(function(ret){
            if(ret.status === 0){
                Toast('update success')
            }else{
                Toast(ret.errorMsg)
            }
        })
    },

    add:function(msg){
        console.log('add....')
        var _this = this
        $.post('/api/notes/add', {
            note:msg
        }).done(function(ret){
            if(ret.status === 0){
                Toast('add success')
            }else{
                _this.$note.remove()
                Event.fire('waterfall')
                Toast(ret.errorMsg)
            }
        })
    },

    delete: function(){
        var _this = this
        $.post('/api/notes/delete', {
            id: this.id
        }).done(function(ret){
            if(ret.status === 0){
                Toast('delete success')
                _this.$note.remove()
                Event.fire('waterfall')
            }else{
                Toast(ret.errorMsg)
            }
        })
    }
}

module.exports.Note = Note