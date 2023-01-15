const Sequelize = require('sequelize')
const db = require('../config/database.js')


const { DataTypes } = Sequelize

const OptionIncome = db.define('optionIncomes', {
    title: {
        type: DataTypes.STRING(50)
    },
}, {
    freezeTableName: true
})

module.exports = OptionIncome