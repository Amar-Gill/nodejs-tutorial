const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/embeddingexample', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error ', err));

const authorSchema = mongoose.Schema({
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model('Author', authorSchema);

const courseSchema = mongoose.Schema({
    name: String,
    authors: [authorSchema] // array of documents
    // author: authorSchema // single document
    // because we are embedding a document, we can implement validation
    // author: {
    //     type: {
    //         type: authorSchema,
    //         required: true
    //     }
    // }
});

const Course = mongoose.model('Course', courseSchema);

async function createAuthor(name, bio, website) {
    let author = new Author({
        name,
        bio,
        website
    })

    const result = await author.save();
    console.log(result)
}

async function createCourse(name, authors ) {
    let course = new Course({
        name,
        authors
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course
        .find()
        
    console.log(courses)
}

// embedded documents can only be changed in context of their parent
// only for single author property
async function updateAuthor(courseId) {
    // use $unset to remove a document property
    const result = await Course.update({_id: courseId}, {
        $set: {
            'author.name': 'Ragnaros the Impenetrable'
        }
    });
    // update author
    // course.author.name = 'Ligar the Invulnerable =]'
    // const result = await course.save() // no such thing here as course.author.save()
    console.log(result)
}

// if authors property is array
async function addAuthor(courseId, author) {
    const course = await Course.findById(courseId)
    course.authors.push(author)
    const result = await course.save()
    console.log(result)
}

// if authors property is array
async function removeAuthor(courseId, authorId) {
    const course = await Course.findById(courseId)
    const author = course.authors.id(authorId)
    author.remove()
    const result = await course.save()
    console.log(result)
}

// updateAuthor('5e3f4497ace3b51a9c986364')

// embed document(s) into Course collection
// createCourse('Blazing Course', [
//     new Author({name: 'Joe'}),
//     new Author({name: 'Steve'})
// ])

// addAuthor('5e3f48e507f93e1b732b7762', new Author({name: 'Tyranodon'}))

removeAuthor('5e3f48e507f93e1b732b7762', '5e3f4aa4652aee1ba09dbfc9')

