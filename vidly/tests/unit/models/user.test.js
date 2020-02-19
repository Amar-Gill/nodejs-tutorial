const User = require('../../../models/user')
const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

describe('user.generateAuthToken', () => {
    it('should return valid authtoken from user instance', () => {
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(payload);
        const authToken = user.generateAuthToken();
        const decoded = jwt.verify(authToken, config.get('jwtPrivateKey'))
        expect(decoded).toMatchObject(payload)
    })
})