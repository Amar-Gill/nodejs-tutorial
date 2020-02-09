const express = require('express')
const {Genre} = require('../models/genre')
const validateGenre = require('../middleware/validateGenre')
const router = express.Router()

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres)
}) // the routehandler function is example of middleware function. it can terminate request/response cycle.

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)

    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
})

router.post('/', validateGenre, async (req, res) => {

    const genre = new Genre({
        name: req.body.name
    });

    try {
        await genre.save()
        console.log(genre)
        res.send(genre)
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
        res.status(400).send(ex.errors)
    }
})

router.put('/:id', validateGenre, async (req, res) => {
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true
        })
        res.send(genre)
    } catch (ex) {
        console.log(ex.message)
        res.status(404).send(`No genre with ID ${req.params.id}`)
    }
})

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)
    
    res.send(genre)
})

module.exports = router