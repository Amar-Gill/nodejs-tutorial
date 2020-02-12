const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        // if match, return payload, else raise exception
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        // add payload as property of req object
        req.user = decoded
        next()
    } catch (ex) {
        return res.status(400).send('Invalid token.')
    }
}