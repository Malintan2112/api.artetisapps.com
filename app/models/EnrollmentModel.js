const Sequelize = require('sequelize')
const db = require('../config/database.js')


const { DataTypes } = Sequelize

const Enrollment = db.define('enrollments', {
    province: {
        type: DataTypes.STRING(50)
    },
    city: {
        type: DataTypes.STRING(50)
    },
    district: {
        type: DataTypes.STRING(50)
    },
    subDistrict: {
        type: DataTypes.STRING(50)
    },
    subscription: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    abonemen: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    memberFee: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    pinalty: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    pinaltyPeriode: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    usePinalty: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0'
    },
    accountNumber: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true
})

module.exports = Enrollment