// Two approaches for modeling relationships in MongoDB

// they are tradeoff between query performance and consistency

// Using References (Normalization) -> CONSISTENCY
// one document to update if you need to change property of an author document
// but then additional query required to get author document after querying for the course
let author = {
    name: 'Georgia'
}

let course = {
    author: 'ref' // id reference of author. but if invalid id, not checked by MongoDB 
}

// Using Embedded Documents (Denormalization) -> PERFORMANCE
// single query. but need to update multiple documents if author properties change
let course = {
    author: {
        name: 'Georgia'
    }
}

// Hybrid
// not storing complete document but with reference
// useful for getting snapshot of your data
let author = {
    name: 'Georgia'
    // 50 other properties
}

let course = {
    author: {
        id: 'ref',
        name: 'Georgia'
    }
}