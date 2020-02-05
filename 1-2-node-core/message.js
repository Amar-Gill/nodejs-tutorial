// LECTURE 2

// javascript global objects:
// console, setTimeout(), clearTimeout(), setInterval(), clearInterval()
// in browsers, all global objects, and user declared vars, are part of window object
// JS engine prefixes window. to the calls for variables / functions
// e.g. var number = 42
// console.log(window.number) // returns 42

// in node, there is object called global for this. e.g. global.console.log()
// however in node, variables are not assigned to global object
// as opposed to browser engine, where variables assigned to window
let message = 'hello'
console.log(global.message) // should return undefined
// message is scoped only to this file
// allows for modularity in js apps