const express = require('express')
const config = require('config')
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
    // caught with exception handler in winston now
    // if (!config.get('useReplicaSet')) throw new Error();

    // for transactions see:
    //https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033
    // also: https://www.npmjs.com/package/mongoose-transact-utils
    // execute: 'run-rs -v 4.2.3 --keep -p 27018' in terminal to start replica set
    const session = await mongoose.startSession();

    session.withTransaction(async () => {
        // bad request if invalid ids provided
        const customer = await Customer.findById(req.body.customerId).session(session)
        if (!customer) return res.status(400).send(`No customer with ID ${req.body.customerId}`)
    
        const movie = await Movie.findById(req.body.movieId).session(session)
        if (!movie) return res.status(400).send(`No movie with ID ${req.body.movieId}`)
    
        // bad request if movie has no stock remaining
        if (movie.numberInStock === 0) return res.status(400).send('No stock left.')
    
        // create and save the new rental
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
    
        // reduce movie stock by 1 and save
        movie.numberInStock--;
        await movie.save();
    
        res.send(rental)
        // TODO - check if **not calling session.endSession()** is memory leak
    })
})

module.exports = router
