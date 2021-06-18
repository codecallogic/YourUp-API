const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const {addOnlineUser, addMixerUser, removeOnlineUser, removeMixerUser, removeRoom, addRoom, getUserInRoom, getMixerUsers} = require('./services/roomService')
require('dotenv').config()
var ip = require("ip");
console.dir ( ip.address() );

const app = express()

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json())
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))

// ROUTES
const messageRoutes = require('./routes/message')
const spotifyRoutes = require('./routes/spotify')
const authRoutes = require('./routes/auth')

// API
app.use('/api/message', messageRoutes)
app.use('/api', spotifyRoutes)
app.use('/api/auth', authRoutes)

const port = process.env.PORT || 3001

const server = app.listen(port, () => console.log(`Server is currently running on port ${port}`))

const io = require('socket.io')(server, {cookie: false })

io.on('connection', (socket) => {
  // socket.disconnect();
  
  socket.on('online', ({displayName, photoURL, email}, callback) => {
    const {error, onlineUsers} = addOnlineUser({id: socket.id, name: displayName, email: email, photoURL: photoURL})

    if(error) io.emit('online', onlineUsers)

    io.emit('online', onlineUsers)

    callback(socket.id)
  })

  socket.on('remove-user', ({user, from}) => {
    const onlineUsers = removeOnlineUser(user ? user.id : newUser.id)
    io.to(from.id).emit('addToGroup', user)
    io.emit('online', onlineUsers)
  })

  socket.on('group-invite', ({user, newUser}) => {
    io.to(user.id).emit('invite', {msg: `${newUser.displayName} has added you to a group.`, from: newUser, currentUser: user})
  })

  socket.on('remove-pending', ({user, from}) => {
    io.to(from.id).emit('pending', {id: user.id})
  })

  socket.on('rooms', ({room}, callback) => {
    const {error, rooms} = addRoom({id: socket.id, room})

    if(error) return callback({error: error})

    io.emit('rooms', rooms)

    callback({room: room})
  })

  socket.on('redirect', (id) => {
    io.to(id).emit('redirect', {redirect: true})
  })

  socket.on('online-mixer', ({displayName, photoURL, email}, callback) => {
    console.log(socket.id, displayName, photoURL, email)
    const {error, mixerUsers} = addMixerUser({id: socket.id, name: displayName, email: email, photoURL: photoURL})

    if(error) io.emit('online-mixer', mixerUsers)

    io.emit('online-mixer', mixerUsers)

    callback(mixerUsers)
  })

  socket.on('send-room', ({id, room, group}, callBack) => {
    io.to(id).emit('get-room', {room, group})
  })

  socket.on('join-room', (room) => {
    socket.join(room)
  })

  socket.on('send-song', ({userInGroup, uri, newCounter}) => {
    const clients = io.sockets.adapter.rooms.get('room1');
    console.log(clients)
    socket.broadcast.to(userInGroup.room).emit('play-song', {uri, newCounter})
  })

  socket.on('disconnect', () => {
    const onlineUsers = removeOnlineUser(socket.id)
    const mixerUsers = removeMixerUser(socket.id)
    const rooms = removeRoom(socket.id)
    io.emit('online', onlineUsers)
    io.emit('online-mixer', mixerUsers)
    io.emit('rooms', rooms)
    if(onlineUsers) console.log('User has left')
    if(mixerUsers) console.log('Mixer user has left')
    if(rooms) console.log('Room is closed')
  })
})

