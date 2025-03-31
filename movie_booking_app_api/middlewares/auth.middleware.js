const AuthService = require('../services/auth.service')

function authenticationMiddleware(req, res, next) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer')) return next()

    const token = header.split(' ')[1]
    const userPayload = AuthService.decodeUserToken(token)

    if (userPayload) req.user = userPayload

    next()
}

function restrictToRole(role) {
    const roleAccessLevelMapping = {
        admin: 0,
        user: 9,
    }
    return function (req, res, next) {
        const user = req.user
        if (!user)
            return res.status(403).json({
                error: 'You need to be loggedin to access this resource',
            })

        const userAccessLevel = roleAccessLevelMapping[user.role]
        const requireAccessLevel = roleAccessLevelMapping[role]

        if (userAccessLevel > requireAccessLevel)
            return res.status(403).json({ errror: 'Access Denied' })

        next()
    }
}

module.exports = {
    authenticationMiddleware,
    restrictToRole,
}
