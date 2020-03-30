process.env.TEST_SUITE = 'typesController';

const {mockRequest, mockResponse} = require('../../../jest/interceptor');
const Types = require('../../Models/typesModel/typesModel');
const TypesController = require('./TypesController');

const mongoose = require('mongoose');
const id = mongoose.Types.ObjectId();
const { whichType } = require('../../consts/allTypes');


const valid1 = {
    displayValue: 'Home',
    which: whichType.LOCATIONS
};

const valid2 = {
    displayValue: 'cups',
    which: whichType.PRODUCTS
};


let tempType = null;
const populate = async () => {
    await Types.remove({});
    tempType = await new Types(valid1).save();
    await new Types(valid2).save();
}

describe('TypesController test suite', ()=>{

    describe('fetch types', ()=>{
        beforeEach(async()=>{
            await populate();
        })

        it('fetches all records, returns status: 200, error: false', async ()=>{
            let req = mockRequest();
            let res = mockResponse();

            await TypesController.fetchAllTypes(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            // expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            //     status: 200,
            //     error: false,
            //     // data: expect.anything()
            // }))
        });
    });

    describe('fetch specific type', ()=>{
        beforeEach(async()=>{
            await populate();
        });

        it('fetches a specific type. returns status: 200, error: false', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.which = whichType.PRODUCTS;

            await TypesController.fetchSpecificType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns error: true status:500 if specific type is invalid', async ()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.which = 'fsdfdfdsa';

            await TypesController.fetchSpecificType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // types/:which post
    describe('create types tests', ()=>{
        beforeEach(async()=>{
            await populate();
        });


        it('creates a new Type. returns status:200, error:false, item: new record', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.which = whichType.LOCATIONS;
            req.body = {displayValue: 'super test'};

            await TypesController.createNewType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                statusCode: 201,
                item: expect.objectContaining({
                    displayValue: 'super test'
                })
            }));
        });

        it('returns status: 500, error: true if the type is not valid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.which = 'whichType';
            req.body = {displayValue: 'super test'};

            await TypesController.createNewType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                errors: 'nonExistant',
            }));
        });

        it('returns status: 501, error:true, and errors if displayValue is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.which = whichType.PRODUCTS;
            req.body = {displayValue: ''};

            await TypesController.createNewType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                statusCode: 400,
                errors: expect.anything(),
            }));
        });
    });
    
    
    describe('type update tests', ()=>{
        beforeEach(async()=>{
            await populate();
        });

        it('updates the record, returns status:200 error: false,  updated item', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = tempType._id;
            req.body = {
                displayValue: 'new location'
            };

            await TypesController.updateType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                statusCode: 201,
                item: expect.objectContaining({
                    _id: tempType._id,
                    displayValue: 'new location'
                })
            }));
        });
       
        it('returns status:500 error: true, and errors if id is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = 'fdsaf@!@!@#!';
            req.body = 'new location';

            await TypesController.updateType(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                statusCode: 500,
                errors: expect.anything()
            }));
        });
    });
});