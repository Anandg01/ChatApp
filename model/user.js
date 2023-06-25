const Sequilize=require('sequelize');
const sequelize=require('../util/database')

const user=sequelize.define('user',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement:true,
        alowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequilize.STRING,
        alowNull:false
        },
    
        email:{
        type:Sequilize.STRING,
        alowNull:false,
        unique:true
        },
        phone:{
            type:Sequilize.INTEGER,
            alowNull:false,
        },
        password:{
            type:Sequilize.STRING,
            alowNull:false,
        }

}
)

module.exports=user