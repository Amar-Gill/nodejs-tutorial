const express = require('express')
const genres = require('../routes/genres')
const movies = require('../routes/movies')
const customers = require('../routes/customers')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middleware/error')

module.exports = function (app) {
    // middlewares
    app.use(express.json()) // for parsing application/json
    // routes
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    // any exception in route handler will direct to error handler. order of declaration matters.
    app.use(error)
}