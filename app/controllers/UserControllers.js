const { Enrollment, User } = require('../models/index.js')
const { errorResonse, succesResponse } = require('./JsonDefault.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

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
        to: 'malintanhernawanputra.net@gmail.com',   // list of receivers
        subject: 'OTP Verifikasi ',
        text: 'OTP Verifikasi',
        html: 'Berikut kode OTP Anda <b>40375</b> ',
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err)
            res.json(errorResonse(err))

        else
            res.json(succesResponse(info))

    });
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

module.exports = { getAllUsers, checkEmail, createUser, updateUser, deleteUser, getUserByIdFunction, getUserById, login, loginFromGoogle, logout, sendMail }