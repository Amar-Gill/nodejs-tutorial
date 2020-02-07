const express = require('express')
const Customer = require('../models/customer')
const validateCustomer = require('../middleware/validateCustomer')
const router = express.Router()

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
}) // the routehandler function is example of middleware function. it can terminate request/response cycle.

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) return res.status(404).send(`No genre with ID ${req.params.id}`)

    res.send(customer)
})

router.post('/', validateCustomer, async (req, res) => {

    let customer = new Customer({
        name: req.body.name,
        number: req.body.number,
        isGold: req.body.isGold
    });

    try {
        customer = await customer.save()
        console.log(customer)
        res.send(customer)
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
        res.status(400).send(ex.errors)
    }
})

router.put('/:id', validateCustomer, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                number: req.body.number,
                isGold: req.body.isGold
            }
        }, { new: true })
        res.send(customer)
    } catch (ex) {
        console.log(ex.message)
        res.status(404).send(`No genre with ID ${req.params.id}`)
    }
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    
    if (!customer) return res.status(404).send(`No genre with ID ${req.params.id}`)
    
    res.send(customer)
})

module.exports = router