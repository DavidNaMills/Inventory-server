process.env.TEST_SUITE = 'staffController';

const {mockRequest, mockResponse} = require('../../../jest/interceptor');
const StaffController = require('./StaffController');
const Staff = require('../../Models/staffModel/staffModel');

const mongoose = require('mongoose');
const id = mongoose.Types.ObjectId();
const { roles } = require('../../consts/staffRoles');

const valid = {
    name: 'david',
    role: `${roles[0]}`,
    wechat: 'fgdasfdfsda',
    phone: '13103718079',
    baseId: [id],
    password: 'dsfdsafads',
    isBlocked: false,
    firstTime: true,
}

let tempStaff = null;
const populate = async () => {
    await Staff.remove({});
    tempStaff = await new Staff(valid).save();
}


describe('StaffController test suite', ()=>{
    
    describe('fetch users tests', ()=>{
        beforeEach(async()=>{await populate();});

        it('returns all users, statusCode of 200', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.body = {}

            await StaffController.fetchAllStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            // TODO: test the return objec
        });
        
        
        it('returns statusCode of 500 if query is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.body = 'fdsafdsa'

            await StaffController.fetchAllStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);

            // TODO: test the return object
        });
    });

    // add a new user
    describe('create new user tests', ()=>{
        beforeEach(async()=>{
            await Staff.remove({});
        });

        it('returns statuscode of 201', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.body = valid;

            await StaffController.addNewStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            // TODO: test the return object
        });

        it('returns 501 and errors if new user data is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.body = {
                ...valid,
                name: '',
                phone: '36363636363636'
            };

            await StaffController.addNewStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            // TODO: test the return object
        });
    });

    describe('remove Staff test suite', ()=>{
        beforeEach(async()=>{await populate();});

        it('should remove a user and return status 202', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = tempStaff._id;
            
            await StaffController.removeStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            // TODO: test the return object
        });

        it('returns status 500 if id is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = 'tempStaff._id';
            
            await StaffController.removeStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            // TODO: test the return object
        });
    });

    describe('block staff test suite', ()=>{
        beforeEach(async()=>{await populate();});

        it('updates the staff returns 201', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = tempStaff._id;
            req.params.block = true;
            
            await StaffController.blockStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            // TODO: test the return object
        });
      
      
        it('returns 501 if the id is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = 'tempStaff._id';
            req.params.block = true;
            
            await StaffController.blockStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            // TODO: test the return object
        });


    });

    describe('update Staff test suite', ()=>{
        beforeEach(async()=>{await populate();});

        it('updates the staff returns 201', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = tempStaff._id;
            req.body = {
                name: 'alan',
                phone: '15656565656'
            }
            
            await StaffController.updateStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                statusCode: 201,
                item: expect.objectContaining({
                    name: 'alan',
                    phone: '15656565656',
                })
            }))
        });
      
      
        it('returns 400 if the id is invalid', async()=>{
            let req = mockRequest();
            let res = mockResponse();
            req.params.id = 'tempStaff._id';
            req.body = {
                name: 'alan',
                phone: '15656565656'
            }
            
            await StaffController.updateStaff(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                statusCode: 400,
                errors: expect.anything()
            }));
        });
    });
});