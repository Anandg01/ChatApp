const Sequilize=require('sequelize')

 const sequelize=new Sequilize('chatapp','root','pk123',{
   dialect: 'mysql',
   host: 'localhost'
 })

module.exports=sequelize;