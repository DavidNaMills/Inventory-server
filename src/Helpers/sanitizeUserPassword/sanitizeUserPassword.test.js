const sanitize = require('./sanitizeUserPassword');

const testData = [
    {
        name: 'fdsafdsa',
        _id: 'fdsafdsa',
        password: 'ffsafdfsda'
    },
    {
        name: 'fdsafdsa',
        _id: 'fdsafdsa',
        password: 'ffsafdfsda'
    },
    {
        name: 'fdsafdsa',
        _id: 'fdsafdsa',
        password: 'ffsafdfsda'
    }
];

describe('sanitizeUserPassword test suite', () => {
    it('removes the password field from the object within the array', () => {
        const res = sanitize(testData);

        res.forEach(x => {
            expect(res).not.toHaveProperty('password');
        })
    });

    it('removes a custom field from the object within the array', () => {
        const res = sanitize(testData, '_id');

        res.forEach(x => {
            expect(res).not.toHaveProperty('_id');
        })
    });

    it('removes the default field (password) from an object', () => {
        const res = sanitize(testData[0]);
        console.log(res);
        expect(res).not.toHaveProperty('password');
    });
});