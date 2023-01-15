const Sequelize = require('sequelize')
const db = require('../config/database.js')
const { DataTypes } = Sequelize

const OptionExpenditure = db.define('optionExpenditures', {
    title: {
        type: DataTypes.STRING(50)
    },
}, {
    freezeTableName: true
})


module.exports = OptionExpenditure