const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const genres = require('./routes/genres')
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')
const mongoose = require('mongoose')
const app = express()

app.use(express.json()) // for parsing application/json

// routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

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