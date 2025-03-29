const crypto = require('crypto')

function hash(data, salt, algorithm = 'sha256') {
    return crypto.createHmac(algorithm, salt).update(data).digest('hex')
}

module.exports = {
    hash,
}
