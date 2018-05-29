const express = require('express')
const router = express.Router()
const mysql = require('../../data/mySQL')
const bcrypt = require('bcryptjs')
const uuid = require('uuid/v4')
const bodyParser = require('body-parser')
const jwt = require('jsonWebToken')
const config = require('../../config')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/login', validateLoginRequest, (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    mysql.getPool.getConnection((err, connection) => {
        connection.query('select id, name, lastName, password from users where email = ?', req.body.email, (err, results, fields) => {
            connection.release()
            if (err) return res.status(500).send('Error searching for user, please try again later and check your parameters')

            const user = results[0]
            if (!user) return res.status(404).send({
                status: 404,
                email: req.body.email,
                message: 'User not found'
            })

            if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(500).send({
                status: 500,
                message: 'User login or password incorrect'
            })

            const token = jwt.sign({ id: user._id }, config.jwtParameters.clientSecret, {
                expiresIn: config.jwtParameters.expiresIn
            })

            res.status(200).send({
                name: user.name,
                lastName: user.lastName,
                email: req.body.email,
                accessToken: token
            });
        })
    })
})

router.get('/me', (req, res) => {

})

router.post('/signup', validateSignupRequest, (req, res) => {
    const user = {
        id: uuid(),
        name: req.body.name,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email
    }

    mysql.getPool.getConnection((err, connection) => {
        connection.query('insert into users set ?', user, (err, results, fields) => {
            connection.release()
            if (err) return res.status(500).send('Error on create user, please try again later and check your parameters')

            res.status(200).send({
                name: user.name,
                email: user.email
            });
        })
    })
})

function validateLoginRequest(req, res, next) {
    if (!req.body.email || !validateEmail(req.body.email)) return res.status(400).send({
        status: 400,
        email: req.body.email,
        message: 'Invalid user email or bad format'
    })

    if (!req.body.password) return res.status(400).send({
        status: 400,
        message: 'Invalid user password'
    })

    next()
}

function validateSignupRequest(req, res, next) {
    if (!req.body) return res.status(400).send({
        status: 400,
        message: 'Invalid Body'
    })

    if (!req.body.name) return res.status(400).send({
        status: 400,
        message: 'Invalid user name'
    })

    if (!req.body.lastName) return res.status(400).send({
        status: 400,
        message: 'Invalid user lastName'
    })

    if (!req.body.email || !validateEmail(req.body.email)) return res.status(400).send({
        status: 400,
        email: req.body.email,
        message: 'Invalid user email or bad format'
    })

    if (!req.body.password) return res.status(400).send({
        status: 400,
        message: 'Invalid user password'
    })

    mysql.getPool.getConnection((err, connection) => {
        connection.query('select count(*) as count from users where email = ?', req.body.email, (err, results, fields) => {
            connection.release()
            if (err) return res.status(500).send('Error on find user')
            console.log(results)
            if (results[0].count || results[0].count > 0)
                return res.status(400).send({
                    status: 400,
                    login: req.body.email,
                    message: 'User already exists'
                })

            next()
        })
    })
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router