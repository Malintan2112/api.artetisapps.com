const moment = require('moment')
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const OptionIncome = require('../models/OptionIncome.js')
const Income = require('../models/Income.js')

const createIncome = async (req, res) => {
    try {
        let date = Date.now();

        let dateNow = moment(new Date(date)).format('YYYY-MM-DD');

        await Income.create({ ...req.body, date: dateNow });
        return res.status(201).json(succesResponse({ msg: "Berhasil Menambahkan Pemasukan" }))
    } catch (error) {
        return res.json(errorResonse(`Terjadi Kesalahan Server Saat Menambahkan Pemasukan`))
    }
}

const getAllIncome = async (req, res) => {
    try {
        const { incomeId } = req.query
        let where = {}
        if (incomeId) {
            where = { ...where, id: incomeId }
        }
        const incomes = await Income.findAll({
            where: { ...where }
        })
        res.json(succesResponse(incomes))
    } catch (error) {
        res.json(errorResonse(error))
    }
}

const getAllIncomeOption = async (req, res) => {
    try {
        const incomesOption = await OptionIncome.findAll()
        res.json(succesResponse(incomesOption))
    } catch (error) {
        res.json(errorResonse(error))
    }
}

module.exports = { createIncome, getAllIncome, getAllIncomeOption }