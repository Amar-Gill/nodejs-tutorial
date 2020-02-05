const express = require('express')
const router = express.Router()
const validateGenre = require('../middleware/validateGenre')

const genres = [
    {id: 1, name: 'action'},
    {id: 2, name: 'comedy'},
    {id: 3, name: 'thriller'},
    {id: 4, name: 'suspense'}
]

router.get('/', (req, res) => {
    res.send(genres)
}) // the routehandler function is example of middleware function. it can terminate request/response cycle.

router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
})

router.post('/', validateGenre, (req, res) => {

    const genre = {
        id: genres[genres.length - 1].id + 1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

router.put('/:id', validateGenre, (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    genre.name = req.body.name
    res.send(genre)
})

router.delete('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    const index = genres.indexOf(genre)
    genres.splice(index, 1)
    res.send(genre)
})

module.exports = router