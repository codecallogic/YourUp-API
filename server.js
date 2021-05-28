const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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

app.listen(port, () => console.log(`Server is running on port ${port}`))