const express = require('express')
const auth = require('../middleware/auth')
const Rental = require('../models/rental')
const Movie = require('../models/movie')
const validateReturn = require('../middleware/validateReturn')
const router = express.Router()

router.post('/', [auth, validateReturn], async (req, res) => {
    // lookup the rental. verify it exists and that it is not processed.
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)    
    if (!rental) return res.status(404).send('No rental found.')
    if (rental.dateReturned) return res.status(400).send('Rental already processed.')

    // add date returned and calculate rental fee
    rental.return()
    await rental.save();

    // query for movie and update stock
    // should also check that movie exists?
    await Movie.update({_id: rental.movie._id}, {
        $inc: {
            numberInStock: 1
        }
    })

    res.send(rental)
})

module.exports = router