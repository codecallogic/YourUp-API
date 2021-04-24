const express = require('express')
const router = express.Router()
const {login, callback, playSong, setCookie, test} = require('../controller/spotify')


router.get('/spotify/login', login)
router.get('/spotify/callback', callback)
router.post('/spotify/play', playSong)
router.get('/test', test)

module.exports  = router