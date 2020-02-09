const Joi = require('joi')

const validateMovie = (req, res, next) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        genreId: Joi.objectId().required()
    }

    const result =  Joi.validate(req.body, schema)

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {
        next()
    }
}

module.exports = validateMovie