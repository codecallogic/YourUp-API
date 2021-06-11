const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const {addOnlineUser, removeOnlineUser} = require('./services/roomService')
require('dotenv').config()

const app = express()

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json())
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))

// ROUTES
const spotifyRoutes = require('./routes/spotify')
const authRoutes = require('./routes/auth')

// API
app.use('/api', spotifyRoutes)
app.use('/api/auth', authRoutes)

const port = process.env.PORT || 3001

const server = app.listen(port, () => console.log(`Server is currently running on port ${port}`))

const io = require('socket.io')(server, {cookie: false })

io.on('connection', (socket) => {
  socket.on('online', ({displayName, photoURL, email}) => {
    const {error, onlineUsers} = addOnlineUser({id: socket.id, name: displayName, email: email, photo: photoURL})

    if(error) io.emit('online', onlineUsers)

    io.emit('online', onlineUsers)

    console.log(onlineUsers)
  })

  socket.on('disconnect', () => {
    const onlineUser = removeOnlineUser(socket.id)
    if(onlineUser) console.log('User has left')
  })
})

