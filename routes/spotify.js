const express = require('express')
const router = express.Router()
const {login, callback} = require('../controller/spotify')


router.get('/spotify/login', login)
router.get('/spotify/callback', callback)

module.exports  = router