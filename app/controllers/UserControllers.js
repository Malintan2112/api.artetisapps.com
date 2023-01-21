const { Enrollment, User } = require('../models/index.js')
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const excelJS = require("exceljs");

const printExcell = async (req, res) => {
    const UserData = [{
        fname: "Amir",
        lname: "Mustafa",
        email: "amir@gmail.com",
        gender: "Male"
    }, {
        fname: "Ashwani",
        lname: "Kumar",
        email: "ashwani@gmail.com",
        gender: "Male",
    }, {
        fname: "Nupur",
        lname: "Shah",
        email: "nupur@gmail.com",
        gender: "Female"
    }, {
        fname: "Himanshu",
        lname: "Mewari",
        email: "himanshu@gmail.com",
        gender: "Male",
    }, {
        fname: "Vankayala",
        lname: "Sirisha",
        email: "sirisha@gmail.com",
        gender: "Female",
    },];
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Users");
    const path = "./tempData";
    worksheet.columns = [{ header: "S no.", key: "s_no", width: 10 },
    { header: "First Name", key: "fname", width: 10 },
    { header: "Last Name", key: "lname", width: 10 },
    { header: "Email Id", key: "email", width: 10 },
    { header: "Gender", key: "gender", width: 10 },];

    let counter = 1;
    UserData.forEach((user) => {
        user.s_no = counter; worksheet.addRow(user);
        counter++;
    });
    worksheet.getRow(1).eachCell((cell) => { cell.font = { bold: true }; });
    try {
        const data = await workbook.xlsx.writeFile(`${path}/users.xlsx`).then(() => {
            res.send({ status: "success", message: "file successfully downloaded", path: `${path}/users.xlsx`, });
            // res.download(`${path}/users.xlsx`)
        });
    } catch (err) {
        res.send({ status: "error", message: "Something went wrong", });
    }
}

const sendMail = async (req, res) => {
    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: 'artetismail@gmail.com',
            pass: 'yvtzsttxrxaqypkr',
        },
        secure: true,
    });
    const mailData = {
        from: 'artetismail@gmail.com',  // sender address
        to: 'novasetyaningrum.ns@gmail.com',   // list of receivers
        subject: 'OTP Verifikasi ',
        text: 'OTP Verifikasi',
        html: 'Klik tautan berikut untuk verifikasi email anda, <b><a href="https://artetisapps.com/">verifikasi email</a>.</b>',

    };
    transporter.sendMail(mailData, function (err, info) {
        if (err)
            res.json(errorResonse(err))

        else
            res.json(succesResponse(info))

    });
}

const generatePassword = () => {
    var length = 6,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
const sendEmailTemplate = (email, subject, body, res) => {
    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: 'artetismail@gmail.com',
            pass: 'yvtzsttxrxaqypkr',
        },
        secure: true,
    });
    const mailData = {
        from: 'artetismail@gmail.com',  // sender address
        to: email,   // list of receivers
        subject: subject,
        text: subject,
        html: body,

    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            return res.json(errorResonse(`${subject} gagal mengirim email`))

        } else {
            return res.status(200).json(succesResponse({ msg: `${subject} berhasil` }))

        }
    });
}
const updatePassword = async (req, res) => {
    try {
        const isEmailExisting = await checkEmail(req.body.email)
        if (isEmailExisting) {
            const password = generatePassword()
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            await User.update({ password: hashPassword }, {
                where: {
                    email: req.body.email
                }
            });
            const desc = `Berikut merupakan password baru anda, mohon jangan sebarkan ke orang yg tidak berkepentingan. password = <b>${password}</b>`
            sendEmailTemplate(req.body.email, 'Reset Password', desc, res)

        } else {
            return res.json(errorResonse('Akun Email tidak ditemukan'))
        }
    } catch (error) {
        return res.json(errorResonse('error server'))
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Enrollment,
                    as: 'enrollments',
                    attributes: { exclude: [] }
                }
            ],
            attributes: { exclude: ['password', 'refresh_token',] }
        })
        res.json(succesResponse(users))
    } catch (error) {
        res.json(errorResonse(error))
    }
}
const checkEmail = async (email) => {
    try {
        const response = await User.findOne({
            where: {
                email: email
            }
        });
        return response.dataValues
    } catch (error) {
        return null
    }
}
const createUser = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { name, email, gender, phone, password, confPassword } = req.body;
        if (password !== confPassword) return res.json(errorResonse('password not same'));
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const isEmailExisting = await checkEmail(email)
        if (!isEmailExisting) {
            await User.create({ ...req.body, password: hashPassword });
            return res.status(201).json(succesResponse({ msg: "Akun Berhasil Register, Silahkan Login Kembali !" }))
        } else return res.json(errorResonse('Akun Sudah Terdaftar '))
    } catch (error) {
        return res.json(errorResonse('Terjadi Kesalahan Server Saat Register'))
    }
}

const updateUser = async (req, res) => {
    try {
        await User.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json(succesResponse({ msg: "User Updated" }))
    } catch (error) {
        return res.json(errorResonse('error server'))
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(succesResponse({ msg: "User Deleted" }))
    } catch (error) {
        res.json(errorResonse('error server'))
    }
}
const getUserByIdFunction = async (id) => {
    try {
        const response = await User.findOne({
            where: {
                id: id
            },
            attributes: { exclude: ['password', 'refresh_token'] }
        });
        return response
    } catch (error) {
        return null
    }
}
const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes: { exclude: ['password', 'refresh_token'] }
        });
        return res.status(200).json(succesResponse(response))
    } catch (error) {
        return res.json(errorResonse('error server'))
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const isEmailExisting = await checkEmail(email)
        if (!isEmailExisting) return res.json(errorResonse('Email Tidak Ditemukan'))
        const match = await bcrypt.compare(password, isEmailExisting.password)
        if (!match) return res.json(errorResonse('Kombinasi Password Tidak Sesuai'))
        const name = isEmailExisting.name
        const userId = isEmailExisting.id

        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30d'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await User.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json(succesResponse({ token: accessToken, user: { id: isEmailExisting.id, name: isEmailExisting.name, email: isEmailExisting.email } }))

    } catch (error) {
        return res.json(errorResonse(`Terjadi Kesalahan Server Saat Login`))
    }
}
const loginFromGoogle = async (req, res) => {
    try {
        const { email, name: nameBody, img } = req.body
        let isEmailExisting = await checkEmail(email)
        if (!isEmailExisting) {
            await User.create({ ...req.body });
            isEmailExisting = await checkEmail(email)
        }
        const name = isEmailExisting.name
        const userId = isEmailExisting.id

        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30d'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await User.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json(succesResponse({ token: accessToken, user: { ...isEmailExisting } }))

    } catch (error) {
        return res.json(errorResonse(`error server : ${error}`))
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(204)
        const user = await User.findAll({
            where: {
                refresh_token: refreshToken
            }
        })
        if (!user[0]) return res.sendStatus(204)
        const userId = user[0].id;
        await User.update({ refresh_token: null }, {
            where: {
                id: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (error) {

    }
}

module.exports = {
    getAllUsers,
    checkEmail,
    createUser,
    updateUser,
    deleteUser,
    getUserByIdFunction,
    getUserById,
    login,
    loginFromGoogle,
    logout,
    sendMail,
    updatePassword,
    printExcell
}