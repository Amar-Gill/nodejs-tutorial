const winston = require('winston')

module.exports = function (err, req, res, next) {
    // shut down mongodb:
    // https://stackoverflow.com/questions/42715251/clean-shutdown-of-the-mongod-process
    // winston.log('error', err.message) // log levels: error, warning, info, verbose, debug, silly
    winston.error(err.message, {meta: err}) // 2nd arg is metadata for the log

    res.status(500).send('Something failed.')
}