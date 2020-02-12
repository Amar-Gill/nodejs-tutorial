const Joi = require('joi')
// THIS IS BAD DESIGN
// VALIDATE FUNCTIONS SHOULD BE IN MODEL MODULES
// INFORMATION EXPERT PRINCIPLE?

const validateUser = (req, res, next) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
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

module.exports = validateUser