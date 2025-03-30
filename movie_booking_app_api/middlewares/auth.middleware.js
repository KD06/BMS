const AuthService = require('../services/auth.service')

function authenticationMiddleware(req, res, next) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer')) return next()

    const token = header.split(' ')[1]
    const userPayload = AuthService.decodeUserToken(token)

    if (userPayload) req.user = userPayload

    next()
}

module.exports = {
    authenticationMiddleware,
}
