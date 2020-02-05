const express = require('express')
const genres = require('./routes/genres')
const app = express()

app.use(express.json()) // for parsing application/json

// routes
app.use('/api/genres', genres)

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})