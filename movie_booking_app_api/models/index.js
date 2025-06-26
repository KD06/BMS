const mongoose = require('mongoose')

function connectMongoDB(connectionURI) {
    return mongoose.connect(connectionURI)
}

module.exports = connectMongoDB

//#### this might not be needed
