const Joi = require('joi')
const config = require('config')
Joi.objectId = require('joi-objectid')(Joi)
// use npm package: joi-password-complexity to enforce password requirements
const express = require('express')
const genres = require('./routes/genres')
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const mongoose = require('mongoose')
const app = express()


// make sure to export vidly_jwtPrivateKey=SOMEKEY
if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1);
}

app.use(express.json()) // for parsing application/json

// routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

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