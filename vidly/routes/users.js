const express = require('express')
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')
const auth = require('../middleware/auth')
const bcrypt = require('bcrypt');
const User = require('../models/user')
const validateUser = require('../middleware/validateUser')
const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
    const users = await User.find().select('-password').sort('name')
    res.send(users)
}))

router.get('/me', auth, asyncMiddleware(async (req, res) => {
    // user property added to request by auth middleware
    const user = await User.findById(req.user._id).select('-password'); // exclude password
    res.send(user);
}))

router.post('/', validateUser, asyncMiddleware(async (req, res) => {
    // check that user is not already registered
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    // create new user
    // pick returns object with only properties specified
    user = User(_.pick(req.body, ['name', 'email', 'password']));

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save()
    console.log(user)

    // generate auth token to log in user. Arg1=payload_object
    const token = user.generateAuthToken();

    // send response
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
}))

module.exports = router