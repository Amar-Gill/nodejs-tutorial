// LECTURE 11

const http = require('http')

// createServer method accepts callback function as arg
const server = http.createServer((req, res) => {
    // basic web server routes can be defined in this function
    if (req.url == '/') {
        res.write('Hello world')
        res.end()
    }

    if (req.url == '/api/courses') {
        res.write(JSON.stringify([1,2,3]))
        res.end()
    }
}) // server extends EventEmitter
// server object raises different events:
// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_class_net_server

// visit localhost:3000 in browser to get message
// works if no callback function given to server object
// server.on('connection', (socket) => {
//     console.log('New connection...')
// })

// run this file to create a server on local machine
server.listen('3000')
console.log('Listening on port 3000...')