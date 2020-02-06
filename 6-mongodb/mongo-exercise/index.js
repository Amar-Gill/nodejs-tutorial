const mongoose = require('mongoose')

mongoose.connect()
    .then(() => console.log('Connected...'))
    .catch(err => console.log('Error: ', err))

const courseSchema = mongoose.Schema({
    name: String,
    author: String,
    date: {type: Date, default: Date.now},
    tags: [ String ],
    isPublished: Boolean,
    price: Number
})

const Course = mongoose.model('Course', courseSchema)

async function getCourses() {

    // exercise 1 query
    return await Course
        .find( {isPublished: true, tags:'backend'})
        .sort({name: 1})
        // .sort('name') // same as above
        // .sort('-name') // for descending
        .select({name: 1, author: 1})
        // .select('name author') // same as above

    // exercise 2 query
    return await Course
        // .find( {isPublished: true, tags: {$in: ['backend', 'frontend']} })
        .find({isPublished: true})
        .or([{tags: 'backend'}, {tags: 'frontend'}]) // same as above
        .sort({price: -1})
        .select({name: 1, author: 1})

    // exercise 3 query
    // all published courses that are $15 or more or have 'by' in title
    return await Course
        .find( {isPublished: true})
        .or( [ {price: {$gte: 15}}, {name: /.*by.*/i} ])
    
}

async function run() {
    const courses = await getCourses()
    console.log(courses)
}

run()