var Toast = require('./Toast').Toast
var Event = require('./events')
var Note = require('./note').Note

var NoteManager = (function(){
    function load (){
        $.get('/api/notes')
            .done(function(ret){
                if(ret.status == 0){
                    $.each(ret.data, function(idx, article){
                        new Note({
                            id: article.id,
                            context: article.text
                        })
                    })

                    Event.fire('waterfall')
              }else{
                  Toast(ret.errorMsg)
              }
            })
            .fail(function(){
                Toast('网络异常')
            })
    }
    
    function add (){
        new Note()
    }

    return{
        load: load,
        add: add
    }
})()

module.exports.NoteManager = NoteManager