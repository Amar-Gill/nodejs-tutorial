const config = require('config')

module.exports = function () {
    // make sure to export vidly_jwtPrivateKey=SOMEKEY
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
    }
}