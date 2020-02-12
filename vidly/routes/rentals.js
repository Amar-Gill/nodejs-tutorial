const express = require('express')
const auth = require('../middleware/auth')
const Rental = require('../models/rental')
const Movie = require('../models/movie')
const Customer = require('../models/customer')
const validateRental = require('../middleware/validateRental')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    console.log(rentals)
    res.send(rentals)
})

router.post('/', [auth, validateRental], async (req, res) => {

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(404).send(`No customer with ID ${req.body.customerId}`)

    // could also be 400 error
    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(404).send(`No movie with ID ${req.body.movieId}`)

    if (movie.numberInStock === 0) return res.status(400).send('No stock left.')

    // for transactions see:
    //https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033
    // also: https://www.npmjs.com/package/mongoose-transact-utils
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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

        console.log(session)
        
        await session.commitTransaction();

        console.log(rental)
        res.send(rental)

    } catch (ex) {
        await session.abortTransaction();
        console.log(ex.message)
        res.status(400).send(ex.message)
    } finally {
        session.endSession()
    }
})

module.exports = router
