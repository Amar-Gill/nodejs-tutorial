const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    Object.keys(req.query).length?
    res.send(req.query) : // to view query parameters (after ? in query string)
    res.send(req.params.id) // to get route parameter id
});

module.exports = router;