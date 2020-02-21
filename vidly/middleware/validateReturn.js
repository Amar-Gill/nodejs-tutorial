const Joi = require('joi')

const validateReturn = (req, res, next) => {
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    }

    const result =  Joi.validate(req.body, schema)

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {
        next()
    }
}

module.exports = validateReturn