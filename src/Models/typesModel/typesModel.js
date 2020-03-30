const mongoose = require('mongoose');
const x = require('../../consts/allTypes');
const errCode = require('../../consts/dbErrorCodes');

const typesSchema = new mongoose.Schema({
    displayValue:{
        type: String,
        maxlength: [15, errCode.types_display_long],
        required: errCode.types_display_req
    },
    which:{
        type: String,
        enum: x.whichTypeArray,
        required: errCode.types_which_req
    },
    description: {
        type: String,
        default: null,
        maxlength: [50, errCode.types_desc_long]
    }
});

const Types = mongoose.model('types', typesSchema);
module.exports = Types;

