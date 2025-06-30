const ratelimit = require('express-rate-limit')

const limiter = ratelimit({
    windows: 1 * 60 * 1000,
    limit: 250,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

function rateLimiterMiddleware(req, res, next) {
    return limiter(req, res, next)
}

module.exports = { rateLimiterMiddleware }
