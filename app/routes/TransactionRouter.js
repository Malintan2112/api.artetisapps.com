const express = require('express')
const { createTransaction, getAllTransaction } = require('../controllers/TransactionControllers.js')
const TransactionRouter = express.Router()

TransactionRouter.get('/', getAllTransaction)
TransactionRouter.post('/', createTransaction)





module.exports= TransactionRouter