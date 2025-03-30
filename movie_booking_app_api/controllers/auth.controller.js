const AppError = require('../errors/app.error')
const {
    userSignupValidationSchema,
    userSigninValidationSchema,
} = require('../lib/validators/auth.validator')
const AuthService = require('../services/auth.service')

async function handleSignup(req, res) {
    try {
        const validatonResult = await userSignupValidationSchema.safeParseAsync(
            req.body
        )
        if (!validatonResult.success) {
            return res.status(400).json({ error: validatonResult.error })
        }
        const { firstname, lastname, email, password } = validatonResult.data
        const token = await AuthService.signupWithEmailAndPassword({
            firstname,
            lastname,
            email,
            password,
        })
        return res.status(201).json({ status: 'success', data: { token } })
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'error', error: 'Internal Server Error' })
    }
}

async function handleSignin(req, res) {
    const validationResult = await userSigninValidationSchema.safeParseAsync(
        req.body
    )

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error })
    }

    const { email, password } = validationResult.data

    try {
        const token = await AuthService.signinWithEmailAndPassword({
            email,
            password,
        })
        return res.status(200).json(token)
    } catch (error) {
        if (error instanceof AppError) {
            return res
                .status(error.code)
                .json({ status: 'error', error: error })
        } else {
            return res
                .status(500)
                .json({ status: 'error', error: 'Internal Server Error' })
        }
    }
}

function handleMe(req, res) {
    if (!req.user) return res.json({ isLoggedIn: false })
    return res.json({ isLoggedIn: true, data: { user: req.user } })
}

module.exports = {
    handleSignup,
    handleSignin,
    handleMe,
}
