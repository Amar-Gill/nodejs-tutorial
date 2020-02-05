// LECTURE 8 / 9
// EVENT: a signal that something has happened

// LECTURE 10 - Logger class extends EventEmitter
const Logger = require('./logger')
const logger = new Logger()

// const EventEmitter = require('events') // returns EventEmitter class
// const emitter = new EventEmitter()

// register an event listener
// same as writing emitter.addListener()
logger.on('messageLogged', (arg) => {
    console.log('Listener called', arg)
})

// raise an event
// after event name, can add additional arguments
// better practice to have one argument that is an object - event argument
// emitter.emit('messageLogged', {id: 1, url: 'http://url.com'})

logger.log('a message')
// if logger.js only exports function:
// then after calling log which emits 'messageLogged' event,
// the emitter in this file does not pick up the event emitted from logger.js
// because two separate instances of EventEmitter

// after changing export to a Logger class which extends EventEmitter class,
// the EventEmitter is now scoped to this file

// must emit event after listener is registered
