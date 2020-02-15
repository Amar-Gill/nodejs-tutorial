const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const asyncMiddleware = require('../middleware/async')
const { Genre } = require('../models/genre')
const validateGenre = require('../middleware/validateGenre')
const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres)
})) // the routehandler function is example of middleware function. it can terminate request/response cycle.

router.get('/:id', asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id)

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
}))

router.post('/', [auth, validateGenre], asyncMiddleware(async (req, res) => {

    const genre = new Genre({
        name: req.body.name
    });

    await genre.save()
    console.log(genre)
    res.send(genre)
}))

router.put('/:id', [auth, validateGenre], asyncMiddleware(async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    })

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
}))

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
}))

module.exports = router