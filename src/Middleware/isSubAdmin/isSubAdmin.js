const {roleObject} = require('../../consts/staffRoles');

const isSubAdmin = (req, res, next) => {
    if(req.user.role===roleObject[1]){
        return res.status(401).send({
            error: true,
            errors: 'InadequateRole'
        });
    }
    next();
};

module.exports = isSubAdmin;