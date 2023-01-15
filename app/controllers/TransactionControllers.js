
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const { Transaction} = require('../models/index.js')

const createTransaction = async (req, res) => {
    try {
        await Transaction.create(req.body);
        return res.status(201).json(succesResponse({ msg: "Transaction Created" }))
    } catch (error) {
        return res.json(errorResonse('error server'))
    }
}

const getAllTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [{
                model: User,
                as: 'user'
            },
            {
                model: Member,
                as: 'members'
            }],
        })
        res.json(succesResponse(transactions))
    } catch (error) {
        res.json(errorResonse(error))
    }
}

module.exports = {createTransaction, getAllTransaction}