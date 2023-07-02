const Sequilize = require('sequelize');
const sequelize = require('../util/database')


const group = sequelize.define('group', {
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        alowNull: false,
        primaryKey: true
    },
    groupName: {
        type: Sequilize.STRING,
        alowNull: false
    },
    description: {
        type: Sequilize.STRING,
        alowNull: false
    }
})

module.exports = group;