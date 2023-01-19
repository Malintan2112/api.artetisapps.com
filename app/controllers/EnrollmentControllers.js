
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const { User, Enrollment, Member } = require('../models/index.js')
const createEnrollment = async (req, res) => {
    try {
        const a = await Enrollment.create(req.body);
        if (a.dataValues.id) {
            const memberData = { ...req.body, enrollmentId: a.dataValues.id }
            await Member.create(memberData)
        }
        return res.status(201).json(succesResponse({ msg: "Wilayah Berhasil di Daftarkan" }))
    } catch (error) {
        return res.json(errorResonse(`Terjadi Kesalahan Server Saat Wilayah`))
    }
}

const updateEnrollment = async (req, res) => {
    try {

        const a = await Enrollment.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        return res.status(201).json(succesResponse({ msg: "Wilayah Berhasil di Update" }))
    } catch (error) {
        return res.json(errorResonse(`Terjadi Kesalahan Server Saat Wilayah`))
    }
}
const getAllEnrollment = async (req, res) => {
    try {
        const { enrollmentId } = req.query
        let where = {}
        if (enrollmentId) {
            where = { ...where, id: enrollmentId }
        }
        const enrollments = await Enrollment.findAll({
            include: [{
                model: User,
                as: 'user'
            },
                // {
                //     model: Member,
                //     as: 'members'
                // }
            ],
            where: { ...where }
        })
        res.json(succesResponse(enrollments))
    } catch (error) {
        res.json(errorResonse(error))
    }
}

module.exports = { createEnrollment, getAllEnrollment, updateEnrollment }