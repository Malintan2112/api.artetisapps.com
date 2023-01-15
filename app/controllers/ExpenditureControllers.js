
const Expenditure = require('../models/Expenditure.js')
const OptionExpenditure = require('../models/OptionExpenditure.js')
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const moment = require('moment')
const User = require('../models/UserModel.js')
const Enrollment = require('../models/EnrollmentModel.js')

const createExpenditure = async (req, res) => {
    try {
        let date = Date.now();
        let dateNow = moment(new Date(date)).format('YYYY-MM-DD');
        await Expenditure.create({ ...req.body, date: dateNow });
        return res.status(201).json(succesResponse({ msg: "Berhasil Menambahkan Pengeluaran" }))
    } catch (error) {
        return res.json(errorResonse(`Terjadi Kesalahan Server Saat Menambahkan Pengeluaran`))
    }
}

const getAllExpenditureOption = async (req, res) => {
    try {
        const expenditureOption = await OptionExpenditure.findAll()
        res.json(succesResponse(expenditureOption))
    } catch (error) {
        res.json(errorResonse(error))
    }
}

const printReport = async (req, res) => {
    try {
        const expenditureReport = await Expenditure.findAll({
            include: [OptionExpenditure, Enrollment, User],
        })
        // res.json(succesResponse(expenditureReport))
        let number = 0
        res.pdfFromHTML({
            filename: 'expenditure.pdf',
            htmlContent: `<!doctype html>
            <html lang="en">
              <head>
                <!-- Required meta tags -->
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            
                <!-- Bootstrap CSS -->
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
            
                <style>

                /* default styling. Nothing to do with freexing first row and column */
                main {display: flex;}
                main > * {border: 1px solid;}
                table {border-collapse: collapse; font-family: helvetica; margin-left:18px}
                td, th {border:  1px solid;
                    padding: 10px;
                    width: 100px;
                    background: white;
                    box-sizing: border-box;
                    text-align: left;
                    font-size: 12px;
                }
                .table-container {
                position: relative;
                max-height:  200px;
                }

                thead th {
                position: -webkit-sticky;
                position: sticky;
                font-size: 13px;
                top: 0;
                z-index: 2;
                background: hsl(20, 50%, 70%);
                }

                thead th:first-child {
                left: 0;
                z-index: 3;
                }

                #qty {
                    width: 25px;
                }

                /* MAKE LEFT COLUMN FIXEZ */
                tr > :first-child {
                position: -webkit-sticky;
                position: sticky; 
                background: hsl(180, 50%, 70%);
                width: 20px;
                left: 0; 
                }
                /* don't do this */
                tr > :first-child {
                box-shadow: inset 0px 1px black;
                }

                </style>



              </head>
              <body>
                <h4 style="padding-left:20px; padding-top:20px" >Laporan Pengeluaran Bulanan</h4>
                <h6 style="padding-left:20px;" >Periode</h5>
                <div class="table-container">
                <div class="table-horizontal-container">
                    <table class="unfixed-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Opsi Pengeluaran</th>
                                <th>Judul / Nama</th>
                                <th>Deskripsi / Jabatan</th>
                                <th>Harga</th>
                                <th id='qty'>Qty</th>
                                <th>Total</th>
                                <th>Dilaporkan Oleh</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${expenditureReport.map(data => {
                return (`
                                <tr>
                                    <th>${number += 1}</th>
                                    <td>${data.date}</td>
                                    <td>${data.optionExpenditure.title || 'Option Tidak Tersedia'}</td>
                                    <td>${data.title}</td>
                                    <td>${data.desc}</td>
                                    <td>Rp ${data.price}</td>
                                    <td id='qty'>${data.qty}</td>
                                    <td>Rp ${data.price * data.qty}</td>
                                    <td>${data.user.name || 'User Tidak Ditemukan'}</td>
                                </tr>
                                `)
            })
                }
                        ${expenditureReport.map(data => {
                    return (`
                                <tr>
                                    <th>${number += 1}</th>
                                    <td>${data.date}</td>
                                    <td>${data.optionExpenditure.title || 'Option Tidak Tersedia'}</td>
                                    <td>${data.title}</td>
                                    <td>${data.desc}</td>
                                    <td>Rp ${data.price}</td>
                                    <td id='qty'>${data.qty}</td>
                                    <td>Rp ${data.price * data.qty}</td>
                                    <td>${data.user.name || 'User Tidak Ditemukan'}</td>
                                </tr>
                                `)
                })
                }
                        ${expenditureReport.map(data => {
                    return (`
                                <tr>
                                    <th>${number += 1}</th>
                                    <td>${data.date}</td>
                                    <td>${data.optionExpenditure.title || 'Option Tidak Tersedia'}</td>
                                    <td>${data.title}</td>
                                    <td>${data.desc}</td>
                                    <td>Rp ${data.price}</td>
                                    <td id='qty'>${data.qty}</td>
                                    <td>Rp ${data.price * data.qty}</td>
                                    <td>${data.user.name || 'User Tidak Ditemukan'}</td>
                                </tr>
                                `)
                })
                }
                        </tbody>
                    </table>
                </div>
            </div>
                <!-- Optional JavaScript -->
                <!-- jQuery first, then Popper.js, then Bootstrap JS -->
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
              </body>
            </html>`,
            options: { orientation: "landscape" }
        })
    } catch (error) {
        res.json(errorResonse(error))
    }
}

module.exports = { createExpenditure, getAllExpenditureOption, printReport }