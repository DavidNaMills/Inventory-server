const buildStaffObject = require('./buildStaffObject');

describe('buildStaffObject test suite', ()=>{
    it('creates an object to be returned to the front end: contains minimum of data', ()=>{
        const testData = {
            _id: 'fsdafsdfsdfsdfdsfdsfda',
            name: 'david',
            role: 'staff',
            baseId: ['fdsa', 'fdsa'],
            firstTime: true,
            phone: '123123123123',
            password: 'fds5gfd53gvfdsfgvdsfgds'
        };

        const obj = buildStaffObject(testData);
        expect(Object.keys(obj).length).toBe(5);
        expect(obj._id).toEqual(testData._id);
        expect(obj.name).toEqual(testData.name);
        expect(obj.role).toEqual(testData.role);
        expect(obj.baseId).toEqual(testData.baseId);
        expect(obj.firstTime).toEqual(testData.firstTime);
    });
});