const express = require('express')
const asyncMiddleware = require('../middleware/async')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Customer = require('../models/customer')
const validateCustomer = require('../middleware/validateCustomer')
const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})) // the routehandler function is example of middleware function. it can terminate request/response cycle.

router.get('/:id', asyncMiddleware(async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(customer)
}))

router.post('/', [auth, validateCustomer], asyncMiddleware(async (req, res) => {

    const customer = new Customer({
        name: req.body.name,
        number: req.body.number,
        isGold: req.body.isGold
    });

    await customer.save()
    console.log(customer)
    res.send(customer)
}))

router.put('/:id', [auth, validateCustomer], asyncMiddleware(async (req, res) => {

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            number: req.body.number,
            isGold: req.body.isGold
        }
    }, { new: true })

    if (!customer) return res.status(404).send(`No genre with ID ${req.params.id}`)
    
    res.send(customer)
}))

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)

    if (!customer) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(customer)
}))

module.exports = router