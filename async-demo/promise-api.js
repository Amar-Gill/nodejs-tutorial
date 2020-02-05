// creating settled promises
// const x = Promise.resolve({id: 1})

// const y = Promise.reject(new Error('Error message goes here...'))

// x.then(result => console.log(result))
// y.catch(error => console.log(error.message))

// running promises in parallel

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('upgrade status:')
        // reject(new Error('upgrade failed...'))
        resolve(1)
    }, 3000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Adun Toridos')
        resolve(2)
    }, 2000)
})

// returns a new promise when all promises in argument array are fulfilled
// if any promise is rejected, the promise returned by Promise.all is also rejected
Promise.all([p1, p2])
    .then(result => console.log(result))
    .catch(error => console.log(error.message));
    //still single thread, but multiple async operations in parallel

// Promise.race([p1, p2])
//     .then(result => console.log(result))
//     .catch(error => console.log(error.message));
    // the promise returned by Promise.race returns the value of the first promise to be resolved in the array



