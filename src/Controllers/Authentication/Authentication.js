const jwt = require('jwt-simple');
const Staff = require ('../../Models/staffModel/staffModel');
const config = require('../../config/index');
const buildStaffObject = require('../../Helpers/buildStaffObject/buildStaffObject');
const logger = require('../../Services/Logger/Logger');

const tokenForStaff=(user)=>{
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user._id, iat:timeStamp}, config.JWT_SECRET);
};


exports.signin = (req, res, next)=>{
    res.send({
        token:tokenForStaff(req.user), 
        staff: buildStaffObject(req.user)
    });
};


exports.signup = async(req, res, next)=>{
    const username= req.body.phone;
    const password = req.body.password;

    if(!username || !password){
        return res.status(422).json({error:"invalEmPwd"});       //add more validation for email
    }

    const existingUser = await Staff.findOne({phone})
    .catch(err=>{
        logger.error(err);
        return res.status(500).json({
            error: true,
            errors:err
        });
    });
        if(existingUser){
            return res.status(422).json({
                error: true,
                errors: "emExist"
            });
        }

        const staff = await Staff(req.body).save()
        .catch(err=>{
            logger.error(err);
            return res.status(500).json({
                error: true,
                errors:err
            });
        });

        if(!staff){
            return res.status(500).json({
                error: true,
                errors:staff.errors
            });
        }

        return res.json({
            token: tokenForStaff(staff),
            staff: buildStaffObject(staff)
        });
};