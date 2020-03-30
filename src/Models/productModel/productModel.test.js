'use strict';
process.env.TEST_SUITE = 'productModel';

require('mongoose-type-url');
const Product = require('./productModel');
const errCode = require('../../consts/dbErrorCodes');
const mongoose = require('mongoose');

const id1 = mongoose.Types.ObjectId();
const id2 = mongoose.Types.ObjectId();
const id3 = mongoose.Types.ObjectId();



const base = {
        locId: id2,
        costPrice: 123,
        sellPrice: 156,
        type: id3,
        typeName: 'cups',
        name: 'big blue cups',
        code: 'cups77',
};



const valid = {
    ...base,
    supplierId: id1,
    qtyInStock: 123,
    description: 'ds fesfdsfasd fdsfdsfdsa',
    isReserve: true,
    isDirect: true,
    archived: true,
    url: '/image/fddsa.jpg'
}


describe('productModel test suite', () => {
    describe('valid data tests', () => {
        it('creates a record and returns with an _id', async () => {
            const res = await new Product(valid).save();
            expect(res).toHaveProperty('_id')
        });

        it('creates a record with only required values and sets the defaults accordingly', async () => {
            const res = await new Product(base).save();
            expect(res).toHaveProperty('_id');
            expect(res.supplierId).toBeNull();
            expect(res.qtyInStock).toBe(0);
            expect(res.description).toEqual('');
            expect(res.isReserve).toBeFalsy();
            expect(res.isDirect).toBeFalsy();
            expect(res.archived).toBeFalsy();
            expect(res.url).toBeNull();
        });
    });

    describe('Error catching tests', () => {
        it('returns errors if the value is below the minimum length', async () => {
            const mini = {
                ...base,
                costPrice: 0,
                sellPrice: 0,
                name: '',
                code: '',
                qtyInStock: -1
            };

            try {
                await new Product(mini).save();
            } catch (err) {
                expect(Object.keys(err.errors).length).toBe(5);
                expect(err.errors['costPrice'].message).toEqual(errCode.prod_invalid_costLow);
                expect(err.errors['sellPrice'].message).toEqual(errCode.prod_invalid_sellLow);
                expect(err.errors['name'].message).toEqual(errCode.prod_invalid_req);
                expect(err.errors['code'].message).toEqual(errCode.prod_invalid_req);
                expect(err.errors['qtyInStock'].message).toEqual(errCode.prod_invalid_qtyInStock_low);
            }
        });


        it('returns errors if the value is above the maximum length', async () => {
            const max = {
                ...base,
                costPrice: 999999991,
                sellPrice: 999999991,
                name: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
                code: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
                description: 'aaaaaaaaaaaaaaaahjkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaahjkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaahjkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaahjkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            };

            try {
                await new Product(max).save();
            } catch (err) {
                expect(Object.keys(err.errors).length).toBe(5);
                expect(err.errors['costPrice'].message).toEqual(errCode.prod_invalid_costHigh);
                expect(err.errors['sellPrice'].message).toEqual(errCode.prod_invalid_sellHigh);
                expect(err.errors['name'].message).toEqual(errCode.prod_invalid_name_long);
                expect(err.errors['code'].message).toEqual(errCode.prod_invalid_code_long);
                expect(err.errors['description'].message).toEqual(errCode.prod_invalid_description_long);
            }
        });

        it('returns an error is supplierId is not a valid ObjectId ', async () => {
            const supp = {
                ...base,
                supplierId: 'fdafddfdsa'
            }
            try {
                await new Product(supp).save();
            } catch (err) {
                expect(Object.keys(err.errors).length).toBe(1);
            }
        });
    });
});