const Sequilize=require('sequelize')

console.log(process.env.DB_HOST, process.env.DB_PASSWORD)
 const sequelize=new Sequilize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
   dialect: 'mysql',
   host: process.env.DB_HOST
 })

module.exports=sequelize;