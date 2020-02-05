// LECTURE 1

// a node process has a single thread

function sayHello(name) {
    console.log(`Hello ${name}`)
} // use node sayHello('name') to run
// console is part of global scope

sayHello('Rajbinderpreet')
// console.log(window) // throws error