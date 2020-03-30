process.env.TEST_SUITE = 'BaseService';

const logger = require('../../Logger/Logger');

const BaseService = require('./BaseService');
const Types = require('../../../Models/typesModel/typesModel');
const { whichType } = require('../../../consts/allTypes');
const mongoose = require('mongoose');
const id = mongoose.Types.ObjectId();



const valid = {
    displayValue: 'Cups',
    which: whichType.PRODUCTS,
    description: 'this is a long description'
};

const invalid = {
    displayValue: '',
    which: 'fgdsfdas'
};

let tempId = null;
const populate = async () => {
    await Types.remove({});
    tempId = await new Types({ ...valid, displayValue: '1' }).save();
    await new Types({ ...valid, displayValue: '2' }).save();
    await new Types({ ...valid, displayValue: '3' }).save();
    await new Types({ ...valid, displayValue: '4' }).save();
    await new Types({ ...valid, displayValue: '5' }).save();
}


describe('BaseService test suite', () => {
    const service = new BaseService(Types);

    describe('Creation tests', () => {
        it('creates a record, returns 200 and the created record', async () => {
            const res = await service.createRecord(valid);
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(201);
            expect(res.item).toHaveProperty('_id');
            expect(res.item).toHaveProperty('displayValue', valid.displayValue);
            expect(res.item).toHaveProperty('which', valid.which);
            expect(res.item).toHaveProperty('description', valid.description);
        });


        // returns error messages if errors
        it('should return statusCode 501, a message and an array of all errors if query is invalid', async () => {
            const spy = jest.spyOn(logger, 'warning');
            const res = await service.createRecord(invalid);
            expect(res.error).toBeTruthy();
            expect(res.statusCode).toBe(400);
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });


    describe('fetch tests', () => {
        beforeEach(async () => {
            await populate();
        });

        it('fetches record according to query and returns 200', async () => {
            const res = await service.fetchRecords({ query: {} });
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(200);
            expect(typeof (res.data)).toBe('object');
            expect(res.data.length).toBe(5);
        });

        it('fetches records using limit, returns 2 records and status code of 200', async () => {
            const res = await service.fetchRecords({ query: {}, limit: 2 })
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(200);
            expect(typeof (res.data)).toBe('object');
            expect(res.data.length).toBe(2);
            expect(res.data[0].displayValue).toEqual('1')
            expect(res.data[1].displayValue).toEqual('2')
        });

        it('fetches 2 records and skips 2 records. statusCode: 200', async () => {
            const res = await service.fetchRecords({ query: {}, limit: 2, skip: 2 })
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(200);
            expect(typeof (res.data)).toBe('object');
            expect(res.data.length).toBe(2);
            expect(res.data[0].displayValue).toEqual('3')
            expect(res.data[1].displayValue).toEqual('4')
        });

        // returns error if problem
        it('returns statusCode 501 on error and logger.warning is fired', async () => {
            const spy = jest.spyOn(logger, 'warning');
            const res = await service.fetchRecords({ query: 'error', limit: 2, skip: 2 })
            expect(res.error).toBeTruthy();
            expect(res.statusCode).toBe(400);
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });


    describe('count tests', () => {
        beforeEach(async () => {
            await populate();
        });

        it('returns the correct count and statusCode 200. error is false', async () => {
            const res = await service.countRecords({});
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(200);
            expect(res.count).toBe(5);
        });

        it('returns statusCode 501, error: true, and logger is fired', async () => {
            const spy = jest.spyOn(logger, 'error');
            const res = await service.countRecords('dss');

            expect(res.error).toBeTruthy();
            expect(res.statusCode).toBe(400);
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });


    describe('update tests', () => {
        beforeEach(async () => {
            await populate();
        });

        const testUpdate = {
            displayValue: 'super update'
        };

        it('successfully updates a record, returns statusCode 200, error: false, and updated record ', async () => {
            const res = await service.updateRecord({ id: tempId, query: testUpdate });
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(201);
            expect(res.item.displayValue).toEqual(testUpdate.displayValue);
        });

        it('returns statusCode: 501, error: true if id is invalid. logger is also fired', async () => {
            const spy = jest.spyOn(logger, 'error');
            const res = await service.updateRecord({ id: 'fdsf@@', query: testUpdate });
            expect(res.error).toBeTruthy();
            expect(res.statusCode).toBe(400);
            expect(res).toHaveProperty('errors');
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });

    describe('delete tests', () => {
        beforeEach(async () => {
            await populate();
        });


        it('removes the record and returns: statusCode 202, error: false, deleted: true ', async () => {
            const res = await service.deleteRecord(tempId);
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(200);
            expect(res.deleted).toBeTruthy();
        });


        it('removes the record and returns: statusCode 202, error: false, deleted: true ', async () => {
            const res = await service.deleteRecord(tempId);
            expect(res.error).toBeFalsy();
            expect(res.statusCode).toBe(200);
            expect(res.deleted).toBeTruthy();
        });

        it('returns statusCode 500, error: true and errors when id is invalid', async () => {
            const res = await service.deleteRecord('fdsfdsa#$%');
            expect(res.error).toBeTruthy();
            expect(res.deleted).toBeFalsy();
            expect(res.statusCode).toEqual(400);
            expect(res).toHaveProperty('errors');
        });

        it('logger.error is fired if an error occurs', async () => {
            const spy = jest.spyOn(logger, 'error');
            await service.deleteRecord('fdsfdsa#$%');
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });
});