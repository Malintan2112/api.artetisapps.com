const Sequelize = require('sequelize')
const db = require('../config/database.js')


const { DataTypes } = Sequelize

const Transaction = db.define('transactions', {
    qty: {
        type: DataTypes.DOUBLE,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    total: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    evidence: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATE
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    status: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0'
    }
}, {
    freezeTableName: true
})

module.exports = Transaction