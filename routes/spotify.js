const express = require('express')
const router = express.Router()
const {login, callback, playSong, activateDevice, removeCookie, increaseVolume, decreaseVolume, test} = require('../controller/spotify')


router.get('/spotify/login', login)
router.get('/spotify/callback', callback)
router.post('/spotify/play', playSong)
router.put('/spotify/activate-device', activateDevice)
router.post('/spotify/remove-cookie', removeCookie)
router.put('/spotify/volume/increase', increaseVolume)
router.put('/spotify/volume/decrease', decreaseVolume)
router.get('/test', test)

module.exports  = router