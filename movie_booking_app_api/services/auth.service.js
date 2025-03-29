const crypto = require('crypto')
const JWT = require('jsonwebtoken')
const User = require('../models/user.model')
const { hash } = require('../utils/hash')
const AppError = require('../errors/app.error')

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET === '')
    throw new AppError('JWT_SECRET env is required')
class AuthService {
    static generateUserToken(payload) {
        const token = JWT.sign(payload, JWT_SECRET)
        return token
    }

    static async signupWithEmailAndPassword(data) {
        const { firstname, lastname, email, password } = data
        const salt = crypto.randomBytes(26).toString('hex')

        try {
            const user = await User.create({
                firstname,
                lastname,
                email,
                salt,
                password: hash(password, salt),
            })

            const token = AuthService.generateUserToken({
                _id: user._id,
                role: user.role,
            })

            return token
        } catch (err) {
            throw err
        }
    }

    static async signinWithEmailAndPassword(data) {
        const { email, password } = data
        const user = await User.findOne({ email })

        if (!user)
            throw new AppError(`User with email ${email} does not exists!`)

        if (hash(password, user.salt) !== user.password) {
            throw new AppError(`Invalid email id or password`)
        }

        const token = AuthService.generateUserToken({
            _is: user.id,
            role: user.role,
        })
        return token
    }
}

module.exports = AuthService
