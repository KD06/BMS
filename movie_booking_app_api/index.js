const http = require('http')
const connectMongoDB = require('./models/index')
const expressApplication = require('./app')

const PORT = process.env.PORT ?? 8000

async function init() {
    try {
        await connectMongoDB(process.env.MONGODB_URI)
        const server = http.createServer(expressApplication)

        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (error) {
        console.log(`Error starting server`, error)
        process.exit
    }
}

init()
