const Joi = require('joi')

const validateCustomer = (req, res, next) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        number: Joi.string().min(3).max(50).required()
    }

    const result =  Joi.validate(req.body, schema)

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {
        next()
    }
}

module.exports = validateCustomer