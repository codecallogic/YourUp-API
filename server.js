const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const {addOnlineUser, addMixerUser, removeOnlineUser, removeMixerUser, removeRoom, addRoom, enterRoom, allRooms, getUsersInRoom, getMixerUsers, updateUsersInRoom} = require('./services/roomService')
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
  
  socket.on('online', ({name, photoURL, email}, callback) => {
    const {error, onlineUsers} = addOnlineUser({id: socket.id, name: name, email: email, photoURL: photoURL})

    if(error) io.emit('online', onlineUsers)

    io.emit('online', onlineUsers)

    callback(socket.id)
  })

  socket.on('remove-user', ({user, from}) => {
    const onlineUsers = removeOnlineUser(user ? user.id : newUser.id)
    io.to(from.id).emit('addToGroup', user)
    io.emit('online', onlineUsers)
  })

  socket.on('notification', ({type, user, room, room_mode, newUser}) => {
    console.log(room_mode)
    io.to(user.id).emit(type, {msg: `${newUser.name} has created room ${room}. Room mode is ` + (room_mode === 'back_to_back' ? ` only room master can select a DJ.` : ` anyone can be a DJ.`), type: true})
  })
  
  socket.on('group-invite', ({user, newUser}) => {
    io.to(user.id).emit('invite', {msg: `${newUser.name} has added you to a group.`, from: newUser, currentUser: user})
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

  socket.on('online-mixer', ({name, photoURL, email}, callback) => {
    console.log(socket.id, name, photoURL, email)
    const {error, mixerUsers} = addMixerUser({id: socket.id, name: name, email: email, photoURL: photoURL})

    if(error) return io.emit('online-mixer', mixerUsers)

    io.emit('online-mixer', mixerUsers)

    callback(mixerUsers)
  })

  socket.on('send-room', ({id, room, mode, pin, group}, callback) => { 

    io.to(id).emit('get-room', {room, mode, pin, group})

    // console.log(group)
    
    const {error, rooms} = addRoom({id, room, mode, pin, group})

    if(error) return callback({error: error})
    // console.log(group)
    console.log(rooms[0].group)

    io.emit('rooms', rooms)

    callback({room: rooms})
  })

  socket.on('join-room', ({room, data}) => {
    socket.join(room)
  })

  socket.on('send-song', ({activeRoom, uri, newCounter}) => {
    const clients = io.sockets.adapter.rooms.get('room1');
    if(activeRoom){
      let {usersInRoom} = getUsersInRoom(null, activeRoom)

      if(usersInRoom.group.length > 0){
        usersInRoom.group.forEach((item) => {
          io.to(item.id).emit('play-song', {uri, newCounter})
        })
      }
    }
  })

  socket.on('enter-room', ({pin, newUser}, callback) => {
    let {usersInRoom} = getUsersInRoom(pin)
    if(usersInRoom.length > 0){
      let room = usersInRoom[0].room
      let mode = usersInRoom[0].mode

      newUser.id = socket.id
      newUser.room = room
      newUser.mode = mode

      usersInRoom.forEach((item) => {
        item.group.push(newUser)
      })

      // console.log(usersInRoom[0])

      usersInRoom[0].group.forEach((item) => {
        io.to(item.id).emit('new-user', usersInRoom[0].group)
      })

      // updateUsersInRoom(pin, usersInRoom[0].group)
    }

    const {error, existingRoom} = enterRoom({pin})

    if(error) return callback({error: error})

    callback(existingRoom)
    
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

