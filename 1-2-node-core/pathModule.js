// LECTURE 5

const path = require('path')
// since no filepath included in require function arg
// node assumes it is built in module. path is built in module. see API docs.

let pathObj = path.parse(__filename)
console.log(pathObj)
console.log(__filename)