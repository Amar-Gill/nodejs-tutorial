const mongoose = require('mongoose')

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    number: {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
}))

module.exports = Customer