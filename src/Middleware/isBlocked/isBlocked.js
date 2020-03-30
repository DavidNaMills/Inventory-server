const logger = require('../../Services/Logger/Logger');

const isBlocked = (req, res, next) => {
    if(req.user.isBlocked){
        logger.warning(`${req.user.name}: <isBlocked:${req.user.isBlocked}> tried to gain access`)
        return res.status(401).json({
            error: true,
            errors: 'blocked'
        });
    }
    next();
};

module.exports = isBlocked;