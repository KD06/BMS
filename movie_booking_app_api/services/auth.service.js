const crypto = require('crypto')
const JWT = require('jsonwebtoken')
const User = require('../models/user.model')
const { hash } = require('../utils/hash')
const AppError = require('../errors/app.error')

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET === '')
    throw new Error(`JWT_SECRET env is required`)

class AuthService {
    /**
     * @function generateUserToken
     * @param {{ _id: string; role: 'admin' | 'user' }} payload
     * @returns { string } JWT signed token
     */
    static generateUserToken(payload) {
        const token = JWT.sign(payload, JWT_SECRET)
        return token
    }

    /**
     * @function signupWithEmailAndPassword
     * @param {{ firstname: string, lastname?: string, email: string, password: string }} data
     * @returns { Promise<string> } JWT signed token
     */
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
            console.log(`Error creating user`, err)
            throw err
        }
    }

    /**
     * @function signinWithEmailAndPassword
     * @param {{ email: string, password: string }} data
     * @returns { Promise<string> } JWT signed token
     */
    static async signinWithEmailAndPassword(data) {
        const { email, password } = data
        const user = await User.findOne({ email })

        if (!user)
            throw new AppError(`User with email ${email} does not exists!`)

        if (hash(password, user.salt) !== user.password)
            throw new AppError(`Invalid email id or password`)

        const token = AuthService.generateUserToken({
            _id: user._id,
            role: user.role,
        })

        return token
    }

    /**
     *
     * @param {string} token
     * @returns {{ _id: string; role: 'admin' | 'user' }} payload
     */
    static decodeUserToken(token) {
        try {
            const payload = JWT.verify(token, JWT_SECRET)
            return payload
        } catch (err) {
            return false
        }
    }
}

module.exports = AuthService
