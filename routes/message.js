const express = require('express')
const router = express.Router()
const {invite} = require('../controller/message')


router.post('/invite', invite)

module.exports  = router