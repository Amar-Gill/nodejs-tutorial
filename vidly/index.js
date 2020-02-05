const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json()) // for parsing application/json

const genres = [
    {id: 1, name: 'action'},
    {id: 2, name: 'comedy'},
    {id: 3, name: 'thriller'},
    {id: 4, name: 'suspense'}
]

app.get('/api/genres', (req, res) => {
    res.send(genres)
}) // the routehandler function is example of middleware function. it can terminate request/response cycle.

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(genre)
})

app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.send(error.details[0].message)

    const genre = {
        id: genres[genres.length - 1].id + 1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    const { error } = validateGenre(req.body)
    if (error) return res.send(error.details[0].message)

    genre.name = req.body.name
    res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`No genre with ID ${req.params.id}`)

    const index = genres.indexOf(genre)
    genres.splice(index, 1)
    res.send(genre)
})

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema)
}

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})