
const express = require('express')
const { createIncome, getAllIncome, getAllIncomeOption } = require('../controllers/IncomeControllers.js')
const IncomeRouter = express.Router()

IncomeRouter.get('/', getAllIncome)
IncomeRouter.get('/option', getAllIncomeOption)

IncomeRouter.post('/', createIncome)




module.exports= IncomeRouter