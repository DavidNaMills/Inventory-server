const {roleObject} = require('../../consts/staffRoles');
const logger = require('../../Services/Logger/Logger');

const isAdmin = (req, res, next) => {
    logger.dev(`[isAdmin] ${req.user.name}`);
    if(req.user.role!==roleObject['3']){
        logger.warning(`${req.user.name} <role: ${req.user.role}> isAdmin: InadequateRole`)
        return res.status(401).send({
            error: true,
            errors: 'InadequateRole'
        });
    }
    next();
};

module.exports = isAdmin;