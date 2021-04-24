const express = require('express')
const router = express.Router()
const {login, callback, playSong} = require('../controller/spotify')


router.get('/spotify/login', login)
router.get('/spotify/callback', callback)
router.post('/spotify/play', playSong)

module.exports  = router