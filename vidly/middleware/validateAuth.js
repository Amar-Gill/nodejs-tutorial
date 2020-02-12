const Joi = require('joi')

const validateAuth = (req, res, next) => {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required() // user provided password
    }

    const result =  Joi.validate(req.body, schema)

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {
        next()
    }
}

module.exports = validateAuth