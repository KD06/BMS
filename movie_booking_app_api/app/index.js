const express = require('express')
const cors = require('cors')
require('dotenv').config()

const adminRoutes = require('../routes/admin.routes')
const userRoutes = require('../routes/user.routes')
const authRoutes = require('../routes/auth.routes')
const { authenticationMiddleware } = require('../middlewares/auth.middleware')

const app = express()

app.use(express.json())
app.use(cors())

app.use(authenticationMiddleware)

app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'Server is up and running' })
})

app.use('/admin', adminRoutes)
app.use('/user', userRoutes)
app.use('/auth', authRoutes)

module.exports = app
