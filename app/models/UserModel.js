const Sequelize = require('sequelize')
const db = require('../config/database.js')

const { DataTypes } = Sequelize
const User = db.define('users', {
    email: {
        type: DataTypes.STRING(100)
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    name: {
        type: DataTypes.STRING(100)
    },
    gender: {
        type: Sequelize.ENUM,
        values: ['MEN', 'WOMEN', 'OTHERS'],
        defaultValue: 'OTHERS'
    },
    password: {
        type: DataTypes.STRING
    },
    img: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
})

module.exports = User;

