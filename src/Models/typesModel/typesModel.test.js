'use strict';
process.env.TEST_SUITE = 'typesModel';

const mongoose = require('mongoose');
const Types = require('./typesModel');

const x = require('../../consts/allTypes');
const errCode = require('../../consts/dbErrorCodes');

const id1 = mongoose.Types.ObjectId();


describe('typesModel test suite', ()=>{
    it('creates a record with all valid details', async ()=>{
        const valid = {
            displayValue: 'henan',
            which: x.whichType.LOCATIONS,
            description: 'a new locaton'
        };
        const res = await new Types(valid).save();
        expect(res).toHaveProperty('_id');
        expect(res.displayValue).toEqual(valid.displayValue);
        expect(res.which).toEqual(valid.which);
    });

    // required
    it('returns errors if required fields are ommitted', async()=>{
        try{
            await new Types({}).save();
        } catch(err){
            expect(Object.keys(err.errors).length).toBe(2);
            expect(err.errors['displayValue'].message).toEqual(errCode.types_display_req);
            expect(err.errors['which'].message).toEqual(errCode.types_which_req);
        }
    });
    
    it('returns errors if value lengths exceed maximum', async()=>{
        const max = {
            displayValue: 'henanhenanhenan23',
            which: x.whichType.LOCATIONS,
            description: 'henanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenanhenan12'
        };
        try{
            await new Types(max).save();
        } catch(err){
            expect(Object.keys(err.errors).length).toBe(2);
            expect(err.errors['displayValue'].message).toEqual(errCode.types_display_long);
            expect(err.errors['description'].message).toEqual(errCode.types_desc_long);
        }
    });
    
    it('sets the default value for description field if ommitted', async()=>{
        const desc = {
            displayValue: 'henan',
            which: x.whichType.LOCATIONS,
        }
        const res = await new Types(desc).save();
        expect(res).toHaveProperty('_id');
        expect(res.displayValue).toEqual(desc.displayValue);
        expect(res.which).toEqual(desc.which);
        expect(res.description).toBeNull();
    });
});