const config = require('config')
const winston = require('winston')
require('winston-mongodb')
// use npm package express-async-errors -> require('express-async-errors') -> no need to store in const
// allows removal of async middleware wrapper for refactoring of try catch blocks in route handlers
require('express-async-errors')

module.exports = function () {
    // handle unhandledPromiseRejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.Console({
        format: winston.format.simple(),
        handleExceptions: true
      }));

    winston.exceptions.handle(new winston.transports.File({
        filename: 'unhandledExceptions.log',
        metaKey: 'meta',
    }));

    winston.add(new winston.transports.File({
        filename: 'logfile.log',
        level: 'info',
        metaKey: 'meta',
    }));

    winston.add(new winston.transports.MongoDB({
        db: config.get("useReplicaSet")
            ? config.get("dbReplica")
            : config.get("db"),
        storeHost: true,
        level: 'error', // any level below will not be logged
        metaKey: 'meta',
        options: {
            poolSize: 2,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            replicaSet: config.get('useReplicaSet') && 'rs'
        },
    }));
}