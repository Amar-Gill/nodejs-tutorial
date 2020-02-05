const express = require('express')
const router = express.Router()

router.get('/:year/:month', (req, res) => {
    res.send(req.params)
}) // returns { year: 2029, month: 01 } for examples

module.exports = router
