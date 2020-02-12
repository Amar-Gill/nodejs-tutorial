const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Movie = require('../models/movie')
const { Genre } = require('../models/genre')
const validateMovie = require('../middleware/validateMovie')

const router = express.Router()

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name')
    res.send(movies)
})

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        res.send(movie)
    } catch (ex) {
        console.log(ex.message)
        res.status(404).send(`No movie with ID ${req.params.id}`)
    }
})

router.post('/', [auth, validateMovie], async (req, res) => {
    // look up genre so embedded document has real reference id to genre collection
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send(`No genre with ID ${req.body.genreId}`)

    const movie = new Movie({
        name: req.body.name,
        // this is how to embed another document into a new document.
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    try {
        await movie.save()

        console.log(movie)

        res.send(movie)
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
        res.status(400).send(ex.errors)
    }
})

router.put('/:id', [auth, validateMovie], async (req, res) => {
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send(`No genre with ID ${req.body.genreId}`)

    try {
        const movie = Movie.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }
        }, { new: true })

        console.log(movie)

        res.send(movie)
    } catch (ex) {
        console.log(ex.message)
        res.status(404).send(ex.message)
    }
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const movie = Movie.findByIdAndRemove(req.params.id)

    if (!movie) return res.status(404).send(`No movie with ID ${req.params.id}`)

    res.send(movie)
})

module.exports = router