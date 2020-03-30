const logger = require('../../Services/Logger/Logger');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const devLogger = (req, res, next) => {

    logger.dev(' ');
    logger.dev(' ');
    logger.dev('---------DEVLOGGER---------');

    logger.dev(
        ExtractJwt.fromAuthHeaderAsBearerToken()
    );
    logger.dev(req.headers.authorization);
    logger.dev(req.user);
    logger.dev(req.route.path);
    logger.dev(req.params);
    logger.dev(req.body);
    logger.dev('---------DEVLOGGER---------');

    next();
}

module.exports = devLogger;