const toObj = require('./arrayToObject');

const testArray = [
    {
        _id: 'fdsafedfa',
        data1: 'fsdafdsa',
        data2: 'fsdafdsa',
    },
    {
        _id: '56556356',
        data1: '535sa',
        data2: '656353afdsa',
    },
]

describe('arrayToObject helper test suite', ()=>{
    it('returns an object created from array', ()=>{
        const res = toObj(testArray);
        expect(typeof(res)).toEqual('object');
        expect(Object.keys(res).length).toBe(testArray.length);
        expect(res[testArray[0]._id]).toEqual(testArray[0]);
        expect(res[testArray[1]._id]).toEqual(testArray[1]);
    });
    
    it('creates an object using a custom key field', ()=>{
        const res = toObj(testArray, 'data1');
        expect(typeof(res)).toEqual('object');
        expect(Object.keys(res).length).toBe(testArray.length);
        expect(res[testArray[0].data1]).toEqual(testArray[0]);
        expect(res[testArray[1].data1]).toEqual(testArray[1]);
    });
});