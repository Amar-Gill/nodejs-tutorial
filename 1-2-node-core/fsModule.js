//LECTURE 7

const fs = require('fs')

// synchronous (blocking) function call
// const files = fs.readdirSync('./')
// console.log(files)

// asynchronous (non-blocking) function call
// second parameter is callback function to execute once function complete
// use filepath='$' to create error
fs.readdir('./', function(err, files) {
    if (err) console.log('Error', err)
    else console.log('Result', files)
})