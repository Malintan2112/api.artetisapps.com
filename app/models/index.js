const User = require('./UserModel.js')
const Enrollment = require('./EnrollmentModel.js')
const Member = require('./MemberModel.js')
const CheckingPeriod = require('./CheckingPeriod.js')
const Transaction = require('./Transaction.js')
const Income = require('./Income.js')
const OptionIncome = require('./OptionIncome.js')
const Expenditure = require('./Expenditure.js')
const OptionExpenditure = require('./OptionExpenditure.js')


const db = require('../config/database.js')



const dbAsync = async () => {
    Enrollment.belongsTo(User)
    User.hasMany(Enrollment)

    Enrollment.hasMany(Member)
    Member.belongsTo(Enrollment)

    Enrollment.hasMany(CheckingPeriod)
    CheckingPeriod.belongsTo(Enrollment)

    User.hasMany(CheckingPeriod)
    CheckingPeriod.belongsTo(User)

    Member.hasMany(CheckingPeriod)
    CheckingPeriod.belongsTo(Member)

    Transaction.belongsTo(User)
    User.hasMany(Transaction)

    Income.belongsTo(OptionIncome)
    OptionIncome.hasMany(Income)

    Income.belongsTo(User)
    User.hasMany(Income)

    Income.belongsTo(Enrollment)
    Enrollment.hasMany(Income)

    Expenditure.belongsTo(OptionExpenditure)
    OptionExpenditure.hasMany(Expenditure)

    Expenditure.belongsTo(User)
    User.hasMany(Expenditure)

    Expenditure.belongsTo(Enrollment)
    Enrollment.hasMany(Expenditure)

    await db.sync();
}

dbAsync()


module.exports = { Enrollment, User, Member, CheckingPeriod, Transaction }