const Joi = require('joi')
// use npm package: joi-password-complexity to enforce password requirements

module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi)
}