// LECTURE 3

let url = 'http://mywebsite.com'

const EventEmitter = require('events') // returns EventEmitter class (LECTURE 10)
// const emitter = new EventEmitter()

// Logger is super class of EventEmitter through extends keyword
class Logger extends EventEmitter {
    // function keyword not required for class methods
    log(message) {
        // send HTTP request 
        console.log(message)
        // raise event here
        this.emit('messageLogged', {id: 1, url: 'http://url.com'}) // LECTURE 10
    }
}

// can also write single function / class instead of exports object
module.exports = Logger;

// set an export for the module
// module.exports.log = log // use for LECTURE 3

// console.log(module)
// returns module object for current file

// LECTURE 4 - Module Wrapper

// when exporting a module, nodejs wraps the code with the function below

// (function (exports, require, module, __filename, __dirname) {
//     let url = 'http://mywebsite.com'

//     function log(message) {
//         // send HTTP request
//         console.log(message)
//     }

//     // set an export for the module
//     module.exports.log = log;

// })

// console.log(__filename) // module scoped values
// console.log(__dirname)