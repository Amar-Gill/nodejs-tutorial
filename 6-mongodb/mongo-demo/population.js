const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error ', err));

const Author = mongoose.model('Author', mongoose.Schema({
    name: String,
    bio: String,
    website: String
}));

const Course = mongoose.model('Course', mongoose.Schema({
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
}));

async function createAuthor(name, bio, website) {
    let author = new Author({
        name,
        bio,
        website
    })

    const result = await author.save();
    console.log(result)
}

async function createCourse(name, author) {
    let course = new Course({
        name,
        author
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course
        .find()
        .populate('author', 'name -_id') // first arg is name of path for course object
        // second arg is select criteria for populate query
        // the ref property of author path indicates what model to populate with
        // can have multiple populate calls for one query
        .select('name author')
    console.log(courses)
}

// createAuthor('Mosh', 'My bio', 'authorId') // after calling create author, paste the _id into createCourse function

// createCourse('Node Course', '5e3f3c9e1183a31935377d1b') // if function called and property not set in Schema, property won't be saved

listCourses() // issue if authorId changes in course document, won't match id of related author document. can return NULL