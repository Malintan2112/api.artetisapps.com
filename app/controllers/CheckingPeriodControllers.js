const { politeName } = require('../misc/Helpers.js')
const { CheckingPeriod, Member } = require('../models/index.js')
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const { getUserByIdFunction } = require('./UserControllers.js')
const { QueryTypes, Op } = require('sequelize')
const moment = require('moment')
const db = require('../config/database.js')
const pkg = require('lodash')
const { isEmpty, chunk } = pkg;

const NumberWithCommas = x =>
    parseInt(x)
        ? String(parseInt(x)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const printReport = async (req, res) => {
    const { enrollmentId, month, year, status } = req.query
    const getLastDate = new Date(year, month, 0).getDate();
    const date = new Date(`${year}-${month}-01`)
    const date2 = new Date(`${year}-${month}-${getLastDate}`)
    let where = {}
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
    const checkingPeriods = await CheckingPeriod.findAll({
        include: [Member],
        where: { ...where },
        order: [
            [{ model: Member }, 'rw', 'ASC'],
            [{ model: Member }, 'rt', 'ASC'],
            [{ model: Member }, 'homeNumber', 'ASC']
        ]
    })
    const renderBodyTable = (data, indexOuter) => {

        return `
        <table>
                <tr style="background-color: #d6d8d9;">
                    <th>No</th>
                    <th>Nama</th>
                    <th>RT/RW</th>
                    <th>No.Rmh</th>
                    <th>P.Awal</th>
                    <th>P.Akhir</th>
                    <th>Konsumsi</th>
                    <th>Rp/m3</th>
                    <th>Biaya</th>
                    <th>Abnmen</th>
                    <th>Denda</th>
                    <th>Total</th>
                    <th>Logs</th>
                </tr>
        ${data.map((x, index) => (
            `
                <tr ${x.paid === 0 && 'style="background-color:#f8d7da;"'}>
                    <td>${(indexOuter * 5) + (index + 1)}</td>
                    <td>${x.member.name}</td>
                    <td style="text-align:center;">${x.member.rt}/${x.member.rw}</td>
                    <td style="text-align:center;">${x.member.homeNumber}</td>
                    <td style="text-align:center;">${x.beforeUtilization}</td>
                    <td style="text-align:center;">${x.utilization}</td>
                    <td style="text-align:center;">${x.utilization - x.beforeUtilization}</td>
                    <td style="text-align:center;">${NumberWithCommas(x.subscription)}</td>
                    <td style="text-align:center;">${NumberWithCommas(x.subscription * (x.utilization - x.beforeUtilization))}</td>
                    <td style="text-align:center;">${NumberWithCommas(x.abonemen)}</td>
                    <td style="text-align:center;">${NumberWithCommas(x.pinalty)}</td>
                    <td style="text-align:center;">${NumberWithCommas((x.subscription * (x.utilization - x.beforeUtilization)) + x.abonemen + x.pinalty)}</td>
                    <td style="font-size:8px; width:100px;"><i>${x.logs}</i></td>
                </tr>
                `
        ))
            }
        </table> 
        <div style="page-break-after:always;"></div>
        <br>
        `
    }

    // res.json(succesResponse(chunk(checkingPeriods, 5)))
    let unPaidTotal = 0
    let paidTotal = 0

    checkingPeriods.filter(x => x.paid !== 0).forEach(element => {
        paidTotal += element.totalPay
    });
    checkingPeriods.filter(x => x.paid === 0).forEach(element => {
        unPaidTotal += element.totalPay
    });
    res.pdfFromHTML({
        filename: 'members.pdf',
        htmlContent: `
        <!DOCTYPE html>
        <html lang="en">
            <style>
            table, th, td{
                border-collapse: collapse;
                border: 1px solid black;
                padding:5px;
                font-size:12px;
            }
            th {
                text-align:center;
              }
              td {
                border: 1px solid black;
                border-collapse: collapse;
                padding:5px;
              }
              .row, .column {
              box-sizing: border-box;
                }
              .column {
                float: left;
                width: 50%;
                padding: 10px;
                height: 300px; 
              }
              .row:after {
                content: "";
                display: table;
                clear: both;
              }
            </style>
            <body>
                <p style="font-size:10px;"><i>Created By : <b>Artetis Apps</b> || Last Update: 20 January 2021 || Updated By : Panut Santosa</i></p>
                ${chunk(checkingPeriods, 15).map((x, index) => renderBodyTable(x, index))}
                <div class="row">
                    <div class="column" style="background-color:#aaa;">
                        <h4>Member Report</h4>
                        <p>Jumlah Tagihan Lunas  (Qty): ${checkingPeriods.filter(x => x.paid !== 0).length}</p>
                        <p>Jumlah Tagihan Belum Lunas (Qty) :  ${checkingPeriods.filter(x => x.paid === 0).length} </p>
                        <p>Jumlah Tagihan (Qty) :  ${checkingPeriods.length} </p>
                    </div>
                    <div class="column" style="background-color:#bbb;">
                        <h4>Financial Report</h4>
                        <p>Jumlah Tagihan Lunas  (Rp): ${NumberWithCommas(paidTotal)}</p>
                        <p>Jumlah Tagihan Belum Lunas (Rp) :  ${NumberWithCommas(unPaidTotal)} </p>
                        <p>Jumlah Tagihan (Rp) :  ${NumberWithCommas(paidTotal + unPaidTotal)} </p>
                    </div>
                    </div>

                </div>
            </body>
        </html>  
        `,
        options: { orientation: "landscape" }
    })
}

const createCheckingPeriod = async (req, res) => {
    try {
        let msg = "Berhasil Memasukan Data"
        const { memberId, status, utilization, total, totalPay, abonemen, subscription, pinalty } = req.body;
        const checkingUser = await getUserByIdFunction(req.body.userId)
        const splitName = checkingUser.dataValues.name.split(' ')
        const dateCurrently = new Date();
        const earlyDate = dateCurrently.getFullYear() + '-' + (dateCurrently.getMonth() + 1) + '-' + '01'
        let date = Date.now();
        let dateNow = moment(new Date(date)).format('YYYY-MM-DD');
        let dateNowLogs = moment(new Date(date)).format('DD-MM-YYYY');

        const logs = `Created By : ${splitName[0]} || ${dateNowLogs} `
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
        const checkingUser = await getUserByIdFunction(req.body.userId)
        const splitName = checkingUser.dataValues.name.split(' ')
        let date = Date.now();
        let dateNowLogs = moment(new Date(date)).format('DD-MM-YYYY');
        const logs = `Received by  : ${splitName[0]} || ${dateNowLogs} `

        await CheckingPeriod.update({ status, isPinalty, total, totalPay, paid, logs }, {
            where: {
                id: idPeriod
            }
        });
        return res.status(201).json(succesResponse({ msg: msg }))
    } catch (error) {
        return res.json(errorResonse(error))
    }
}

module.exports = { createCheckingPeriod, updateCurrentMeterMemberById, checkingExisting, checkingBeforeCreate, getAllCheckingPeriod, paymentPeriodById, printReport }