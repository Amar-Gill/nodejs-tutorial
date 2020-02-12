module.exports = (req, res, next) => {
    // 401 Unauthorized - invalid token, try again with valid token
    // 403 Forbidden - valid token but not permitted, don't try again
    if (!req.user.isAdmin) return res.status(403).send('Forbidden resource.')

    next();
}