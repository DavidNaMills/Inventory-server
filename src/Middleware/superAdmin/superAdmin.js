const config = require('../../config/index');
const logger = require('../../Services/Logger/Logger');

const superAdmin = (req, res, next) => {
    if(
        req.body.super.username === config.SU_ADMIN_USER &&
        req.body.super.password === config.SU_ADMIN_PASS
        
    ){
        res.status(401).send({
            error: true,
            errors: 'unauthorised'
        });
    }
    const body = req.body.data;
    req.body = body;
    next();
};

module.exports = superAdmin;