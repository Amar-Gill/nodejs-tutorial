function log (req, res, next) {
    console.log('THIS IS LOGGER MIDDLEWARE')
    console.log(req.body)
    next() // without calling next, request will hang.
}

module.exports = log