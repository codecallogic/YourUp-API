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

// API
app.use('/api', spotifyRoutes)

const port = process.env.PORT || 8001

app.listen(port, () => console.log(`Server is running on port ${port}`))