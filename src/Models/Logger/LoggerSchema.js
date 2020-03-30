const mongoose = require('mongoose');


const loggerSchema = new mongoose.Schema({
    date: {
        type: String,
        default: Date.now()
    },
    from: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    message: String,
    fromFunction: {
        file: {type: String},
        func: {type: String},
        line: {type: String},
    },
    location: {
        type: String
    },
    device: String,
    OS: String,
    ip: String,
    user: {
        name: String,
        location: String
    }
});

const LoggerModel = mongoose.model('logger', loggerSchema);
module.exports = LoggerModel;