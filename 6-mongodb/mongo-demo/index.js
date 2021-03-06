const mongoose = require('mongoose')

// in production the connection string should come from config
mongoose.connect('mongodb://localhost/playground',  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))

// schemas define shape of documents in mongodb collection
// think of collection as a table and document as a row when comparing to SQL dbs
const courseSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true only valid for mongoose. mongodb doesnt care.
        required: true,
        minlength: 5, // built in validators for String type
        maxlength:255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true, // mongoose converts string to lowercase
        // uppercase: true, // same as lowercase
        // trim: true // removes padding of string
    },
    author: String,
    tags: {
        type: Array,
        // custom validator - async
        validate: {
            // isAsync option is deprecated. return promise instead
            // https://mongoosejs.com/docs/validation.html#async-custom-validators
            isAsync: true,
            validator: function(v, callback) {
                //do some async work
                setTimeout(() => {
                    const result = v && v.length>0
                    callback(result)
                }, 2000)
            },
            message: 'A course should have atleast one tag. ASYNC STYLES.'
        },
        // custom validator - sync
        // validate: {
        //     validator: function(v) { return v && v.length>0 }, // if true, is valid value
        //     message: 'A course should have atleast one tag.'
        // }
    },
    date: {type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        // cant use arrow function. this references the schema object in this case
        // if arrow function used, this refers to the mongoose isPublished context of this
        // conditionally require fields
        required: function() {return this.isPublished;},
        min: 10,
        max: 100,
        get: v => Math.round(v), // when returning from db query
        set: v => Math.round(v) // when saving into db
    }
})

// mongoose.model returns a class that we can use in our app to save into mongoDB
const Course = mongoose.model('Course', courseSchema)

async function createCourse() {
    // instance of Course class
    const course = new Course({
        name: 'How to slay nubs',
        category: 'WEB',
        author: 'Megalodonnicus Canificus Blemmicus',
        tags: ['pwnage', 'carnage'],
        isPublished: true,
        price: 89.8
    })

    try {
        // validate() returns Promise of type void. so cant save result in a constant.
        // use callback to get boolean result
        // await course.validate();

        // save returns a promise
        const result = await course.save()
        console.log(result)
    } catch (ex) {
        // save method has automatic validation
        // exception raised if name not provided
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    }
}

async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10;
    // usually passed into query string for api
    // api/course?pageNumber=2&pageSize=10

    // mongodb comparison operators
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal)
    // lt (less than)
    // lte (less than or equal)
    // in
    // nin (not in)

    // mongodb logical operators

    // find returns DocumentQuery object. behaves like promise.
    // can pass in filter object as argument.
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true}) // filter author=Mosh ang isPublished=true
        // .find( {price: { $gt: 10 } }) // filter for price greater than 10
        // .find({ price: { $gte: 10, $lte: 20 } })// filter 10 <= price <= 20
        // .find({ price: { $in: [10, 15, 20] } }) // filter for price thats 10 or 15 or 20
        // .find()
        // .or( [ {author: 'Mosh'}, {isPublished: true} ] ) // example of filters with or operators. use with .find()
        // .find( {author: /^Mosh/}) // regexp. Any string that begins with 'Mosh'
        // .find( {author: /Hamedani$/i} ) // regexp. Any string that ends with 'Hamedani'. append i to make case insensitive.
        // .find( {author: /.*Mosh.*/i}) // regexp. simply contains 'Mosh' in the string anywehere
        // .skip((pageNumber - 1) * pageSize) // erm not working...
        .limit(pageSize)
        .sort({name: 1})
        // .countDocuments() // return document count of query
        .select({name: 1, tags: 1});
    console.log(courses)
}

// ********* Two Approaches to Updating / Deleting *********

// 1) Query First - like other ORMs
// findById()
// modify properties
// save()
// useful if you requrie business logic to validate certain info
async function updateCourse1(id) {
    const course = await Course.findById(id)
    if (!course) return;

    // make updates
    // course.isPublished = true;
    // course.author = 'Another author';

    // alternatively use set
    course.set({
        isPublished: true,
        author: 'Another author'
    })

    const result = await course.save()
    console.log(result)

}

// 2a) Update First
// update directly
// optionally get the updated document
async function updateCourse2(id) {
    // https://docs.mongodb.com/manual/reference/operator/update/
    // first parameter is filter criteria
    // can update multiple documents at once
    const result = await Course.update( {_id: id}, {
        $set: {
            author: 'Gorgonosh',
            isPublished: false
        }
    })
    console.log(result)
}

// 2b) Update First - this method allows return of the document object
async function updateCourse3(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Winkler',
            isPublished: false
        }
    }, {new: true})
    
    // will show the original document before update if new: false
    console.log(course)
}

async function removeCourse(id) {
    // finds first document matching filter criteria and deletes
    const result = await Course.deleteOne({_id: id})
    console.log(result)

    // use Course.deleteMany for all documents that match filter criteria
    // also returns a Result object like deleteOne

    // this method will return the deleted document object
    // const course = await Course.findByIdAndRemove(id);
    // console.log(course)
    // if course with id doesnt exist, method returns null
}

createCourse()
// getCourses()
// updateCourse3("5e3c3502b9f6ea66ff54e44c")
// removeCourse("5e3c3502b9f6ea66ff54e44c")
