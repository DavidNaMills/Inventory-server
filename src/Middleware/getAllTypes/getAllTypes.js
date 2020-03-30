const Types = require('../../Models/typesModel/typesModel');
const logger = require('../../Services/Logger/Logger');

const getAllTypes = (req, res, next) =>{
    Types.find({})
    .then(rec => {
        logger.error(req.body);
        
        req.data = {
            ...req.data,
            types: rec.data
        };
        logger.error(req.body);
        next();
    })
    .catch(err=>{
        next();
    })
}

module.exports = getAllTypes;