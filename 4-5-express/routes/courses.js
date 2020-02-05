const express = require('express');
const router = express.Router();
const validateCourse = require('../middleware/validateCourse')
const coursesApiDebug = require('debug')('app:courseroute')

const courses = [
    { id: 1, name: 'course-1' },
    { id: 2, name: 'course-2' },
    { id: 3, name: 'course-3' }
]

router.get('/', (req, res) => {
    res.send(courses)
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (course) {
        res.send(course)
    } else {
        res.status(404).send(`Course with ID ${req.params.id} not found.`)
        coursesApiDebug('No ID match... See request parameters:')
        coursesApiDebug(req.params)
    }
})

router.post('/', validateCourse, (req, res) => {

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course); // send back the new object so client knows full state
    coursesApiDebug('New Course Added:')
    coursesApiDebug(course)
})

router.put('/:id', validateCourse, (req, res) => {
    // Look up course
    // return 404 if course not existing
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        coursesApiDebug('No ID match... See request parameters:')
        coursesApiDebug(req.params)
        return res.status(404).send(`Course with ID ${req.params.id} not found.`)
    }

    // update course
    course.name = req.body.name
    // return updated course
    res.send(course)
    coursesApiDebug('Course Updated:')
    coursesApiDebug(course)
})

router.delete('/:id', (req, res) => {
    // Look up course
    // return 404 if course not existing
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        coursesApiDebug('No ID match... See request parameters:')
        coursesApiDebug(req.params)
        return res.status(404).send(`Course with ID ${req.params.id} not found.`)
    }

    // delete course
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    // return updated course
    res.send(course)
    coursesApiDebug('Course Deleted')
    coursesApiDebug(course)
})

module.exports = router;
