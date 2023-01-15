const Sequelize = require('sequelize')
const db = require('../config/database.js')
const { DataTypes } = Sequelize

const Expenditure = db.define('expenditures', {
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
    qty: {
        type: DataTypes.DOUBLE,
        defaultValue: 1
    },
    total: {
        type: DataTypes.DOUBLE,
        defaultValue: 1
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

module.exports = Expenditure