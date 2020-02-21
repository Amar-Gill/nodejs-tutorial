const mongoose = require('mongoose')
const moment = require('moment')

// Static methods: available on class
// Instance methods: only available on instance of class i.e. an object i.e. new User().generateAuthToken()

const rentalSchema = mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            number: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            name: {
                type: String,
                trim: true,
                minlength: 3,
                maxlength: 255,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                max: 255,
                required: true
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

rentalSchema.statics.lookup = function(customerId, movieId) {
    // return promise ;)
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}

rentalSchema.methods.return = function(){
    this.dateReturned = new Date();

    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate
}

const Rental = mongoose.model('Rental', rentalSchema)

module.exports = Rental