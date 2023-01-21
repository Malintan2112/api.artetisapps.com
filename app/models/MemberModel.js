const Sequelize = require('sequelize')
const db = require('../config/database.js')


const { DataTypes } = Sequelize

const Member = db.define('members', {
    rw: {
        type: DataTypes.INTEGER(3),
        allowNull: true
    },
    rt: {
        type: DataTypes.INTEGER(3),
        allowNull: true
    },
    homeNumber: {
        type: DataTypes.DOUBLE(4),
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    noWA: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    firstMeter: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },
    currentMeter: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },
    qrcode: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
    },
    role: {
        type: Sequelize.ENUM,
        values: ['MEMBER', 'BENDAHARA', 'PETUGAS', 'KETUA', 'ADMIN'],
        defaultValue: 'MEMBER'
    },
    isSupervision: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    logs: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})

module.exports = Member