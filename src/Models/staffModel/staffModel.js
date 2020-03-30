// const logger = require('../../Services/Logger/Logger');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const errCode = require('../../consts/dbErrorCodes');
const { roles } = require('../../consts/staffRoles');
const logger = require('../../Services/Logger/Logger');
const bcrypt = require('bcrypt-nodejs');
const encypt = require('../../Helpers/encrypt/encrypt')

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [25, errCode.staff_inval_name_a],
        minlength: [1, errCode.staff_inval_name_b],
        required: errCode.ppl_invalid_req
    },
    role: {
        type: String,
        enum: roles,
        required: errCode.ppl_invalid_req
    },
    wechat: {
        type: String,
        maxlength: [20, errCode.staff_wechat_invalid],
        minlength: [1, errCode.staff_wechat_invalid],
        required: errCode.ppl_invalid_req
    },
    phone: {
        type: String,
        required: errCode.ppl_invalid_req,
        match: [/^[1]\d{10}$/, errCode.staff_inval_phone],
        unique: true
    },
    baseId: [mongoose.Schema.Types.ObjectId],
    // baseId: {
    //     type: [ObjectId],
    // },
    isBlocked: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: errCode.ppl_invalid_req,
    },
    firstTime: {
        type: Boolean,
        default: false
    }
});


StaffSchema.pre("save", async function (next) {
    const staff = this;

    if (staff.password) {
        const x = await encypt(staff.password);
        staff.password = x;
    }
    return next()
});


StaffSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};

const Staff = mongoose.model('staff', StaffSchema);
module.exports = Staff;