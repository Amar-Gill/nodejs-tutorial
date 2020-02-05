// Debuggers
const startupDebugger = require('debug')('app:startup') // abstraction over console.log()
const dbDebugger = require('debug')('app:db')

// Config and Logginf
const morgan = require('morgan') // https://expressjs.com/en/resources/middleware.html
const config = require('config')

// Headers
const helmet = require('helmet')

// Routes
const express = require('express')
const courses = require('./routes/courses')
const posts = require('./routes/posts')
const horses = require('./routes/horses')
const home = require('./routes/home')

// Custom Middleware
// const logger = require('./middleware/logger') // importing custom middlware

// Application
const app = express()
app.set('view engine', 'pug')
app.set('views', './views'); // default value for information


// Configuration Information
// console.log(process.env.NODE_ENV) // returns undefined if not set
// console.log(app.get('env')) // returns development by default if not set
console.log('Application name ' + config.get('name'))
console.log('Mail server ' + config.get('mail.host'))
console.log('Mail password ' + config.get('mail.password'))
app.get('env') === 'development' && console.log(config.get('note'))

if (app.get('env') === 'development') {
    app.use(morgan('dev')) // logging of network calls
    startupDebugger('Morgan enabled...') // export DEBUG=app:startup
}

// some db work...
// dbDebugger('Connected to database...') // can do export DEBUG=app:startup,app:db
// or export DEBUG=app:*
// or export at run time: export DEBUG=app:db nodemon index.js

// adding middleware
// middleware functions are called in order they are defined in file
app.use(express.json()) // parses body of req and populate req.body
app.use(express.urlencoded( { extended: true })) // parses requests with urlencoded payloads (key=value&key=value)
// extended : true allows for passing of arrays and objects of urlencoded format

// in browser visit http://localhost:3000/README.md to view file
app.use(express.static('public'))

// example of custom middleware
// app.use(logger)

// TODO - read about helmet
app.use(helmet())

// add middleware for routing modules
app.use('/api/courses', courses)
app.use('/api/posts', posts)
app.use('/api/horses', horses)
app.use('/', home)

// in terminal write 'export PORT=5000' to set env variable PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});

