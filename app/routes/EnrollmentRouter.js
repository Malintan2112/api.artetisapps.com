const express = require('express')
const { createEnrollment, getAllEnrollment, updateEnrollment } = require('../controllers/EnrollmentControllers.js')

const EnrollmentRouter = express.Router()

EnrollmentRouter.get('/', getAllEnrollment)
EnrollmentRouter.post('/', createEnrollment)
EnrollmentRouter.put('/:id', updateEnrollment)







module.exports = EnrollmentRouter