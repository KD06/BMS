const http = require('http')
const connectMongoDB = require('./models/index')
const expressApplication = require('./app')

require('dotenv').config()

const port = process.env.PORT ?? 8000

async function init() {
    try {
        await connectMongoDB(process.env.MONGODB_URI)
        const server = http.createServer(expressApplication)

        server.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.log(`Error starting server`, error)
        process.exit
    }
}

init()
