const mongoose = require('mongoose')

const {genreSchema} = require('./genre')

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    }
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie