module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            // leads to error handler middleare - see index.js
            console.log('ASYNC MIDDLEWARE ERROR')
            next(ex);
        }
    }
};