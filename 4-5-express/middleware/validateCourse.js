const Joi = require('joi') // data validation module
const coursesApiDebug = require('debug')('app:courseroute')

// experimental
function validateCourse (req, res, next) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema)

    if (result.error) {
        // 400 bad request
        coursesApiDebug('Data Validation Error:')
        coursesApiDebug(result.error.details[0])
        coursesApiDebug('Request Body:')
        coursesApiDebug(req.body)
        return res.status(400).send(result.error.details[0].message)
    } else {
        coursesApiDebug('No Data Validation Error')
        next()
    }
}

module.exports = validateCourse

