const express = require('express')
const router = express.Router()
const htmlDebugger = require('debug')('app:html')

router.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Hello'}) // first paramater name of pug file, then object for template parameters
    htmlDebugger(`html page served: index`)
});

module.exports = router