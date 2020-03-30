global.__basedir = __dirname;
// require('dotenv').config();

const express = require('express');
const config = require('./src/config/index');

require('./src/Loaders/Logger/LoggerLoader');   // initialise the Logger

const logger = require('./src/Services/Logger/Logger');

const startServer = async () => {
    const app = express();
    await require('./src/Loaders/index')({ expressApp: app });

    app.listen(config.PORT, err => {
        if (err) {
            logger.error(err);
            process.exit(1);
            return;
        }
        logger.info(`Server listening on port: ${config.PORT}`)
    })
}


startServer();