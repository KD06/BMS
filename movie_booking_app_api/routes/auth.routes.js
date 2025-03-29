const express = require('express')
const authController = require('../controllers/auth.controller')

const router = express.Router()

router.post('/sign-up', authController.handleSignup)
router.post('/sign-in', authController.handleSignin)

module.exports = router
