const { politeName } = require('../misc/Helpers.js')
const { CheckingPeriod, Member } = require('../models/index.js')
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const { getUserByIdFunction } = require('./UserControllers.js')
const { QueryTypes, Op } = require('sequelize')
const moment = require('moment')
const db = require('../config/database.js')
const pkg = require('lodash')
const { isEmpty } = pkg;

const createCheckingPeriod = async (req, res) => {
    try {
        let msg = "Berhasil Memasukan Data"
        const { memberId, status, utilization, total, totalPay, abonemen, subscription, pinalty } = req.body;
        const checkingUser = await getUserByIdFunction(req.body.userId)
        const logs = `Created by ${politeName(checkingUser.dataValues.gender)}${checkingUser.dataValues.name},`
        const dateCurrently = new Date();
        const earlyDate = dateCurrently.getFullYear() + '-' + (dateCurrently.getMonth() + 1) + '-' + '01'
        let date = Date.now();
        let dateNow = moment(new Date(date)).format('YYYY-MM-DD');
        const checkingByMemberId = await checkingExisting(earlyDate, dateNow, memberId, status)
        if (!isEmpty(checkingByMemberId)) {
            await CheckingPeriod.update({ utilization, logs, date: dateNow, total, totalPay, abonemen, subscription, pinalty }, {
                where: {
                    id: checkingByMemberId[0].id
                }
            });
            await updateCurrentMeterMemberById(memberId, utilization)

            msg = "Berhasil Memperbarui Data"
        }
        else {
            await CheckingPeriod.create({ ...req.body, logs: logs, date: dateNow })
            await updateCurrentMeterMemberById(memberId, utilization)
        }
        return res.status(201).json(succesResponse({ msg: msg }))
    } catch (error) {
        return res.json(errorResonse(error))
    }
}
const updateCurrentMeterMemberById = async (id, utilization) => {
    try {
        await Member.update({ currentMeter: utilization }, {
            where: {
                id: id
            }
        });
    } catch (error) {

    }
}
const checkingExisting = async (date1, date2, memberId, status) => {
    try {
        const checking = await db.query(
            'SELECT * FROM checkingPeriods WHERE date BETWEEN :date1 AND :date2 AND memberID = :memberId AND status =:status',
            {
                replacements: { date1: date1, date2: date2, memberId: memberId, status: status },
                type: QueryTypes.SELECT
            }
        )
        //  return  [
        //     {
        //       id: 1,
        //       utilization: 2.3,
        //       date: 2022-03-01T00:00:00.000Z,
        //       total: 2300,
        //       penalty: 0,
        //       paid: 3000,
        //       evidence: null,
        //       status: '0',
        //       logs: 'Created by sdr/i Malintan,',
        //       createdAt: 2022-06-15T22:53:36.000Z,
        //       updatedAt: 2022-06-15T22:53:36.000Z,
        //       userId: 1,
        //       memberId: 2
        //     }
        //   ]
        return checking
    } catch (error) {
        res.json(errorResonse(error))
    }
}
const checkingBeforeCreate = async (req, res) => {
    try {
        const { date1, date2, memberId, status } = req.query
        const dateCurrently = new Date();
        const earlyDate = dateCurrently.getFullYear() + '-' + (dateCurrently.getMonth() + 1) + '-' + '01'
        const dateNow = dateCurrently.getFullYear() + '-' + (dateCurrently.getMonth() + 1) + '-' + `${dateCurrently.getDate() > 9 ? dateCurrently.getDate() : `0${dateCurrently.getDate()}`}`
        if (memberId) {
            const checkingByMemberId = await checkingExisting(earlyDate, dateNow, memberId, status || '0')
            res.json(succesResponse(checkingByMemberId[0] || null))
        } else {
            res.json(errorResonse('Member ID not found'))
        }
    } catch (error) {
        res.json(errorResonse(error))
    }
}
const getAllCheckingPeriod = async (req, res) => {
    try {
        const { enrollmentId, month, year, status, memberId, id } = req.query
        const getLastDate = new Date(year, month, 0).getDate();
        const date = new Date(`${year}-${month}-01`)
        const date2 = new Date(`${year}-${month}-${getLastDate}`)
        let where = {}
        if (!isEmpty(id)) {
            where = {
                ...where,
                id: id
            }
        }
        if (!isEmpty(year) && !isEmpty(month)) {
            where = {
                ...where,
                date: {
                    [Op.between]: [date, date2]
                }
            }
        }
        if (!isEmpty(enrollmentId)) {
            where = {
                ...where,
                enrollmentId: enrollmentId
            }
        }
        if (!isEmpty(status)) {
            where = {
                ...where,
                status: status
            }
        }
        if (!isEmpty(memberId)) {
            where = {
                ...where,
                memberId: memberId
            }
        }
        const checkingPeriods = await CheckingPeriod.findAll({
            include: [Member],
            where: { ...where }
        })
        res.json(succesResponse(checkingPeriods))
    } catch (error) {
        res.json(errorResonse(error))
    }
}

const paymentPeriodById = async (req, res) => {
    try {
        let msg = "Berhasil Memasukan Data"
        const { status, isPinalty, total, totalPay, paid } = req.body;
        const { idPeriod } = req.params

        await CheckingPeriod.update({ status, isPinalty, total, totalPay, paid }, {
            where: {
                id: idPeriod
            }
        });
        return res.status(201).json(succesResponse({ msg: msg }))
    } catch (error) {
        return res.json(errorResonse(error))
    }
}

module.exports = { createCheckingPeriod, updateCurrentMeterMemberById, checkingExisting, checkingBeforeCreate, getAllCheckingPeriod, paymentPeriodById }