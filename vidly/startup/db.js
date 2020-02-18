const mongoose = require('mongoose')
const config = require('config');
const winston = require('winston')

module.exports = function () {
    // run-rs --version 4.2.3 -> will start three node replica set of dbs
    // specifying version uses separate version of mongodb
    // specifying mongod uses current MacOS process -> run-rs --mongod
    // but replica set dbs do not import from regular dbs
    // use -p 27018 to run on different port
    // --keep to prevent deleting data on reload // but gives error when loading mongodb compass
    mongoose.connect(config.get("useReplicaSet")
        ? 'mongodb://localhost:27018,localhost:27019,localhost:27020/vidly'
        : "mongodb://localhost:27017/vidly", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        replicaSet: config.get("useReplicaSet") && 'rs'
    })
        .then(() => winston.info('Connected to MongoDB...'))
        // exceptions handled elsewhere
}