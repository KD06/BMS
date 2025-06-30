const express = require('express')
const cors = require('cors')

const adminRoutes = require('../routes/admin.routes')
const bookingRoutes = require('../routes/booking.routes')
const authRoutes = require('../routes/auth.routes')
const publicRoutes = require('../routes/public.routes')

const { authenticationMiddleware } = require('../middlewares/auth.middleware')
const {
    rateLimiterMiddleware,
} = require('../middlewares/rate_limiter.middleware')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const app = express()

app.use(express.json())
app.use(cors())
app.use(authenticationMiddleware)
app.use(rateLimiterMiddleware)
// app.use(mongoSanitize)
app.use(helmet())

app.get('/', (req, res) =>
    res.json({ status: 'success', message: 'Server is up and running' })
)

app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)
app.use('/booking', bookingRoutes)
app.use('/api', publicRoutes)

module.exports = app
