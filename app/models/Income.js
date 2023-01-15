const Sequelize = require('sequelize')
const db = require('../config/database.js')


const { DataTypes } = Sequelize

const Income = db.define('incomes', {
    title: {
        type: DataTypes.STRING(50)
    },
    desc: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATEONLY
    },
}, {
    freezeTableName: true
})

module.exports = Income