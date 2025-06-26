const express = require('express')
const cors = require('cors')

const adminRoutes = require('../routes/admin.routes')
const bookingRoutes = require('../routes/booking.routes')
const authRoutes = require('../routes/auth.routes')
const publicRoutes = require('../routes/public.routes')

const { authenticationMiddleware } = require('../middlewares/auth.middleware')

const app = express()

app.use(express.json())
app.use(cors())
app.use(authenticationMiddleware)

app.get('/', (req, res) =>
    res.json({ status: 'success', message: 'Server is up and running' })
)

app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)
app.use('/booking', bookingRoutes)
app.use('/api', publicRoutes)

module.exports = app
