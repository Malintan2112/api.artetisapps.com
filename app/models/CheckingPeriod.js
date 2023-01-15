const Sequelize = require('sequelize')
const db = require('../config/database.js')


const { DataTypes } = Sequelize

const CheckingPeriod = db.define('checkingPeriods', {
    utilization: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    beforeUtilization: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATEONLY
    },
    total: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    totalPay: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    abonemen: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    subscription: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    pinalty: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    paid: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    evidence: {
        type: DataTypes.STRING
    },
    status: {
        type: Sequelize.ENUM,
        values: ['0', '1', '2']
    },
    logs: {
        type: DataTypes.STRING
    },
    isPinalty: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
}, {
    freezeTableName: true
})

module.exports = CheckingPeriod