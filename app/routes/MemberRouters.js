const express = require('express')
const { createMember, getAllMember, getMemberByIdEnrollment, getOrganizationalStructure, printMember } = require('../controllers/MemberControllers.js')
const MemberRouter = express.Router()

MemberRouter.get('/', getAllMember)
MemberRouter.get('/print/:idEnrollment', printMember)
// MemberRouter.get('/:idEnrollment', getMemberByIdEnrollment)
MemberRouter.get('/organizational', getOrganizationalStructure)

MemberRouter.get('/email', getAllMember)

MemberRouter.post('/', createMember)






module.exports = MemberRouter