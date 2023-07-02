const Sequelize=require('sequelize');
const sequelize=require('../util/database')
const user=require('./user')
const group=require('./group')

const userGroup=sequelize.define('usergroup',{
    userId: {
        type: Sequelize.INTEGER,
        references: {
          model: user, 
          key: 'id'
        }
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: group, 
          key: 'id'
        }
      },
      admin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      }
})

module.exports=userGroup;