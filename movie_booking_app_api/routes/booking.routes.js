const express = require('express')
const { restrictToRole } = require('../middlewares/auth.middleware')
const controller = require('../controllers/booking.controller')

const router = express.Router()

router.use(restrictToRole('user'))

router.post('/create', controller.handleCreateBooking)
router.post('/verify-payment', controller.verifyPayment)

module.exports = router
