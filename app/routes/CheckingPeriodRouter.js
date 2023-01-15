const express = require('express')
const { createCheckingPeriod, getAllCheckingPeriod, checkingBeforeCreate, paymentPeriodById } = require('../controllers/CheckingPeriodControllers.js')
const CheckingPeriodRouter = express.Router()

CheckingPeriodRouter.get('/', getAllCheckingPeriod)

CheckingPeriodRouter.get('/checkingBeforeCreate', checkingBeforeCreate)

CheckingPeriodRouter.post('/paymentPeriod/:idPeriod', paymentPeriodById)

CheckingPeriodRouter.post('/', createCheckingPeriod)






module.exports= CheckingPeriodRouter