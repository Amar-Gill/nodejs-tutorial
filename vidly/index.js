const express = require('express')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const mongoose = require('mongoose')
const app = express()

app.use(express.json()) // for parsing application/json

// routes
app.use('/api/genres', genres)
app.use('/api/customers', customers)

mongoose.connect('mongodb://localhost/vidly',  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})