const http = require('http')
const expressApplication = require('./app')
const connectMongoDB = require('./models')

const PORT = process.env.PORT ?? 8000

async function init() {
    try {
        await connectMongoDB(process.env.MONGODB_URI)
        console.log(`Mongodb Connected`)

        const server = http.createServer(expressApplication)

        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (err) {
        console.log(`Error starting server`, err)
        process.exit(1)
    }
}

init()
