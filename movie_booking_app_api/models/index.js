const mongoose = require('mongoose')

function connectMongoDB(connectionURI) {
    console.log('##################################', connectionURI)
    return mongoose.connect(connectionURI)
}

module.exports = connectMongoDB
