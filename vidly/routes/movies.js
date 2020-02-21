const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Movie = require('../models/movie')
const { Genre } = require('../models/genre')
const validateMovie = require('../middleware/validateMovie')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name')
    res.send(movies)
})

router.get('/:id', validateObjectId, async (req, res) => {

    const movie = await Movie.findById(req.params.id)

    if (!movie) return res.status(404).send(`No movie with ID ${req.params.id}`)

    res.send(movie)
})

router.post('/', [auth, validateMovie], async (req, res) => {
    // look up genre so embedded document has real reference id to genre collection
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send(`No genre with ID ${req.body.genreId}`)

    const movie = new Movie({
        name: req.body.name,
        // this is how to embed another document into a new document. Hybrid approach.
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save()

    res.send(movie)
})

router.put('/:id', [auth, validateMovie, validateObjectId], async (req, res) => {
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send(`No genre with ID ${req.body.genreId}`)

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true })

    res.send(movie)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)

    if (!movie) return res.status(404).send(`No movie with ID ${req.params.id}`)

    res.send(movie)
})

module.exports = router