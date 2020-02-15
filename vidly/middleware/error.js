module.exports = function (err, req, res, next) {
    // shut down mongodb:
    // https://stackoverflow.com/questions/42715251/clean-shutdown-of-the-mongod-process
    // log the exception
    console.log(err)
    res.status(500).send('Something failed.')
}