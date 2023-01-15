const express = require('express')
const { createEnrollment, getAllEnrollment } = require('../controllers/EnrollmentControllers.js')

const EnrollmentRouter = express.Router()

EnrollmentRouter.get('/', getAllEnrollment)
EnrollmentRouter.post('/', createEnrollment)





module.exports= EnrollmentRouter