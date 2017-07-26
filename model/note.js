var Sequelize = require('sequelize')
var path = require('path')

var sequelize = new Sequelize(undefined, undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.join(__dirname,'../database/database.sqlite')
});

/* 测试用
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function(err) {
    console.error('Unable to connect to the database:', err);
  });
*/

const Note = sequelize.define('note', {
  text: {
    type: Sequelize.STRING
  },
  uid: {
    type: Sequelize.STRING
  }
});
// Note.drop()
// Note.sync({force: true})

// Note.sync().then(function(){  //if表不存在 创建 存在 不管
//     Note.create({text: 'hello world'})
// }).then(function(){
//     Note.findAll({raw: true}).then(notes => {  //查找  raw: true 只显示输入的数据
//     console.log(notes)
//     })
// })

// Note.findAll({where:{id:2}, raw: true}).then(function(notes){
//     console.log(notes)
// })

module.exports.Note = Note

