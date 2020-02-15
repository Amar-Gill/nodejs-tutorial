const express = require('express')
const asyncMiddleware = require('../middleware/async')
const auth = require('../middleware/auth')
const Rental = require('../models/rental')
const Movie = require('../models/movie')
const Customer = require('../models/customer')
const validateRental = require('../middleware/validateRental')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    console.log(rentals)
    res.send(rentals)
}))

// not using asyncMiddleware here because route handler uses a transaction
router.post('/', [auth, validateRental], async (req, res) => {

    // for transactions see:
    //https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033
    // also: https://www.npmjs.com/package/mongoose-transact-utils
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const customer = await Customer.findById(req.body.customerId).session(session)
        if (!customer) return res.status(404).send(`No customer with ID ${req.body.customerId}`)

        // could also be 400 error
        const movie = await Movie.findById(req.body.movieId).session(session)
        if (!movie) return res.status(404).send(`No movie with ID ${req.body.movieId}`)

        if (movie.numberInStock === 0) return res.status(400).send('No stock left.')

        const rental = new Rental({
            movie: {
                _id: movie._id,
                name: movie.name,
                dailyRentalRate: movie.dailyRentalRate
            },
            customer: {
                _id: customer._id,
                name: customer.name,
                number: customer.number,
            }
        })

        await rental.save()

        movie.numberInStock--;

        await movie.save();

        await session.commitTransaction();
        console.log(session)

        console.log(rental)
        res.send(rental)

    } catch (ex) {
        await session.abortTransaction();
        console.log(ex.message)
        console.log(session)
        res.status(500).send(ex.message)
    } finally {
        session.endSession()
    }
})

module.exports = router
