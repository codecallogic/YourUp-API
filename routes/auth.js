const express = require('express')
const router = express.Router()
const {login, loginStrict} = require('../controller/auth')


router.post('/login', login)

module.exports  = router