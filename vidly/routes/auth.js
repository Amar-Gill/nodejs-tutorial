const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt');
const User = require('../models/user')
const validateAuth = require('../middleware/validateAuth')
const router = express.Router()

router.post('/', validateAuth, async (req, res) => {
    // check that user has been registered first
    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Invalid email or password.') // do not want to say user not found

    // comparing function to validate email password matches hashed pw in db
    const validPassword = await bcrypt.compare(_.pick(req.body, 'password').password, user.password);

    if (!validPassword) return res.status(400).send('Invalid email or password');

    // generate auth token
    const token = user.generateAuthToken();

    res.send(token)
})

module.exports = router