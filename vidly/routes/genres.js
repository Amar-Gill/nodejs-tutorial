const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Genre } = require('../models/genre')
const validateGenre = require('../middleware/validateGenre')
const validateObjectId = require('../middleware/validateObjectId')
const router = express.Router()

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres)
}) // the routehandler function is example of middleware function. it can terminate request/response cycle.

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
})

router.post('/', [auth, validateGenre], async (req, res) => {

    const genre = new Genre({
        name: req.body.name
    });

    await genre.save()
    
    res.send(genre)
})

router.put('/:id', [auth, validateGenre, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    })

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
})

module.exports = router