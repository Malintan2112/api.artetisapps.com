
const express = require('express')
const ExpenditureRouter = express.Router()
const { createExpenditure, getAllExpenditureOption, printReport } = require('../controllers/ExpenditureControllers.js')

ExpenditureRouter.post('/', createExpenditure)
ExpenditureRouter.get('/option', getAllExpenditureOption)
ExpenditureRouter.get('/printReport', printReport)


module.exports = ExpenditureRouter