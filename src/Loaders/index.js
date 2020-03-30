const config = require('../config/index');
const expressLoader = require('./expressLoader/expressLoader');
require('./mongoose/mongoose')({ databaseURL: config.URI });
// require('./mongoose/mongoose')({databaseURL:config.LOGGER_URI});

module.exports = async ({ expressApp }) => {
    await expressLoader({ app: expressApp });
};