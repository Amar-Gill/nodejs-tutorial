const p = new Promise((resolve, reject) => {
    // kick off async work e.g. fetch data from api
    setTimeout(() => {
        // if async work successful, status goes to resolved, and resolve value carried forward
        // resolve is a function, which passes value of async work to consumer of promise
        // resolve(1)
        // if async function fails, status goes from pending to rejected
        // use reject function to return error to consumer of promise 
        reject(new Error('flop tings ya kno?'))
    }, 2000)
})
 
p
    .then(result => console.log('Result ', result)) // result is value of async work passed to resolve above
    .catch(err => console.log('Error', err.message));

// anywhere you have async function that takes a callback, you should modify function to return a promise