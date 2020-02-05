//LECTURE 3 - using modules

const logger = require('./logger') // loads logger module into file

// console.log(logger) // returns exports object for logger module
logger.log('bob')
