process.env.TEST_SUITE = 'productController';

const productController = require('./ProductController');
const Product = require('../../Models/productModel/productModel');
const { mockRequest, mockResponse } = require('../../../jest/interceptor');
const mongoose = require('mongoose');

const id1 = mongoose.Types.ObjectId();
const id2 = mongoose.Types.ObjectId();


const valid1 = {
    locId: id1,
    costPrice: 123,
    sellPrice: 156,
    type: id2,
    typeName: 'cups',
    name: 'big blue cups',
    code: 'cups77',
}

const valid2 = {
    locId: id1,
    costPrice: 123,
    sellPrice: 156,
    type: id2,
    typeName: 'cups',
    name: 'big blue cups',
    code: 'cups773',
}


let tempProd = null;
const populate = async () => {
    await Product.remove({});
    tempProd = await new Product(valid1).save();
    await new Product(valid2).save();
}

beforeEach(async () => {
    await populate();
});

describe('ProductController test suite', () => {
    // fetch records

    // FIXME: return isnt correct

    // describe('fetch ALL Products tests', () => {
    //     it('returns status: 200, error: false, all records, with no skip or limit set', async () => {
    //         let req = mockRequest();
    //         let res = mockResponse();

    //         await productController.fetchProducts(req, res);
    //         expect(res.json).toHaveBeenCalledTimes(1);
    //         expect(res.status).toHaveBeenCalledWith(200);
    //     });

    //     it('returns status: 200, error: false, all records, with skip:5  limit: 10', async () => {
    //         let req = mockRequest();
    //         let res = mockResponse();
    //         req.params.skip = '5';
    //         req.params.limit = '10';

    //         await productController.fetchProducts(req, res);
    //         expect(res.json).toHaveBeenCalledTimes(1);
    //         expect(res.status).toHaveBeenCalledWith(200);
    //     });
    // });

    // create product
    describe('create new product test suite', () => {
        it('creates new record, returns status: 201, error: false, created item is returned', async () => {
            let req = mockRequest();
            let res = mockResponse();

            const testData = {
                ...valid1,
                code: 'vdas3f4da'
            };

            req.body = testData;
            req.params.hasImage = false;

            await productController.createNewProduct(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                item: expect.objectContaining({
                    code: 'vdas3f4da',
                    _id: expect.anything()
                })
            }))
        });

        it('returns status: 400, error: true, errors exist, when the product data is invalid', async () => {
            let req = mockRequest();
            let res = mockResponse();
            req.body = {
                name: '',
                locId: '#####'
            };
            req.params.hasImage = false;

            await productController.createNewProduct(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400,
                errors: expect.anything()
            }))
        });
    });


    // delete product
    describe('delete product test suite', () => {
        beforeEach(async () => { await populate(); });

        it('removes record, returns status: 200, deleted: true, error: false', async () => {
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = tempProd._id;

            await productController.deleteProduct(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                error: false,
                deleted: true
            }))
        });
        
        it('returns status: 401, deleted: false, error: true, and errors if id is invalid', async () => {
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = '#fdfgdffgds%$#%';

            await productController.deleteProduct(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400,
                error: true,
                deleted: false,
                errors: expect.anything()
            }))
        });
    });


    describe('update product test suite', ()=>{
        beforeEach(async()=>await populate());

        it('updates record, returns status: 200, error:false, item: updated', async ()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.body = {
                name: 'super name change'
            }
            req.params.id = tempProd._id;
            req.params.hasImage = false;

            await productController.updateProduct(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 201,
                error: false,
                item: expect.objectContaining({
                    name: 'super name change'
                })
            }))
        });
       
        it('returns status: 400, error:true, errors contains data when the ID is invalid', async ()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.body = {
                name: 'super name change'
            }
            req.params.id = '@#dsda3232d23@@@@2';
            req.params.hasImage = false;
            
            await productController.updateProduct(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400,
                error: true,
                errors: expect.anything()
            }))
        });
    });


    describe('fetch from specific location test suite', ()=>{
        beforeEach(async()=>await populate());

        //  FIXME: // not returning
        // it('fetches records from a specific location. returns status: 200, error: false, all records', async()=>{
        //     let req = mockRequest();
        //     let res = mockResponse();
        //     req.params.id = id1;
        //     req.params.skip = 123;
        //     req.params.limit = 10;

        //     await productController.fetchProductsLocation(req, res);
        //     expect(res.json).toHaveBeenCalledTimes(1);
        //     expect(res.status).toHaveBeenCalledWith(200);
        //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        //         products: expect.anything(),
        //         count: expect.anything()
        //     }));
        // });
        
        
        it('returns status: 400, error: true, errors contains data, IF the location id is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = 'fdsaf$$$$$321#@#@!#!@';
            req.params.skip = 123;
            req.params.limit = 10;

            await productController.fetchProductsLocation(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400,
                error: true,
                errors: expect.anything()
            }));
        });
    });
    // add count to fetch
});