const mongoose = require('mongoose');
const logger = require('../../Services/Logger/Logger');

class Connection {
    constructor(urlObj) {
        logger.dev(`establishing new connection at: ${urlObj.databaseURL}`);
        mongoose.Promise = global.Promise;
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.connect(urlObj.databaseURL)
            .then(() => {
                logger.dev(`established new connection at: ${urlObj.databaseURL}`);
            })
            .catch(err => {
                logger.error(err);
            })

    }
}

const create = async (urlObj) => {
    await new Connection(urlObj);
}
module.exports = (urlObj) => create(urlObj);