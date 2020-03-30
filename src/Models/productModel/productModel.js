const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const fuzzy = require('mongoose-fuzzy-searching');

require('mongoose-type-url');

const errCode = require('../../consts/dbErrorCodes');

const productSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    locId: {
        type: mongoose.Schema.Types.ObjectId,
        required: errCode.prod_invalid_req
    },
    costPrice: {
        type: Number,
        max: [99999999, errCode.prod_invalid_costHigh],
        min: [1, errCode.prod_invalid_costLow],
        required: errCode.prod_invalid_req
    },
    sellPrice: {
        type: Number,
        max: [99999999, errCode.prod_invalid_sellHigh],
        min: [1, errCode.prod_invalid_sellLow],
        required: errCode.prod_invalid_req
    },

    // FIXME: below should be of type ObjectId. need to fix real db first
    type: {
        type: String,
        required: errCode.prod_invalid_req
    },
    typeName: {
        type: String,
        required: errCode.prod_invalid_req
    },
    name: {
        type: String,
        minlength: [1, errCode.prod_invalid_name_short],
        maxlength: [25, errCode.prod_invalid_name_long],
        required: errCode.prod_invalid_req
    },
    code: {
        type: String,
        minlength: [1, errCode.prod_invalid_code_short],
        maxlength: [25, errCode.prod_invalid_code_long],
        required: errCode.prod_invalid_req,
        unique: true
    },
    qtyInStock: {
        type: Number,
        min: [0, errCode.prod_invalid_qtyInStock_low],
        default: 0
    },
    description: {
        type: String,
        maxlength: [50, errCode.prod_invalid_description_long],
        default: ''
    },
    isReserve: {
        type: Boolean,
        default: false
    },
    isDirect: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        default: null
    }
});

productSchema.plugin(
    fuzzy,
    { fields: ['name', 'typeName', 'code'] }
)

const Product = mongoose.model('product', productSchema);

module.exports = Product;