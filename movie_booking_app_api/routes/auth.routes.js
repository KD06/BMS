const express = require('express')
const authController = require('../controllers/auth.controller')

const router = express.Router()

router.post('/sign-up', authController.handleSignup)
router.post('/sign-in', authController.handleSignin)

router.get('/me', authController.handleMe)

module.exports = router
