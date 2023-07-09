const Sequilize=require('sequelize');
const sequelize=require('../util/database')

const message= sequelize.define('chatmessage',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement:true,
        alowNull:false,
        primaryKey:true
    },
    message:{
        type:Sequilize.STRING,
        alowNull:false
        },
        url:{
            type:Sequilize.STRING
        }
})

module.exports=message;