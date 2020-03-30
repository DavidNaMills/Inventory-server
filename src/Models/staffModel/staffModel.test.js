'use strict';

process.env.TEST_SUITE = 'staffModel';

const mongoose = require('mongoose');
const id = mongoose.Types.ObjectId();
const id2 = mongoose.Types.ObjectId();

const Staff = require('./staffModel');
const errCode = require('../../consts/dbErrorCodes');
const { roles } = require('../../consts/staffRoles');


describe('staffModel test suite', () => {
    describe('valid build tests', () => {
        const valid = {
            name: 'david',
            role: `${roles[0]}`,
            wechat: 'fgdasfdfsda',
            phone: '13103718079',
            baseId: [id, id2],
            password: 'dsfdsafads',
            isBlocked: true,
            firstTime: true,
        }

        it('creates a valid staff record', async () => {
            let res = await new Staff(valid).save();
            expect(res).toHaveProperty('_id');
            // expect(res).toMatchObject(valid)
        });
    });

    describe('default values test', () => {
        const defaults = {
            name: 'david',
            role: `${roles[0]}`,
            wechat: 'fgdasfdfsda',
            phone: '13103718079',
            baseId: [id, id2],
            password: 'dsfdsafads',
        }

        it('creates a valid staff record', async () => {
            let res = await new Staff(defaults).save();
            expect(res).toHaveProperty('_id');
            expect(res).toHaveProperty('isBlocked', false);
            expect(res).toHaveProperty('firstTime', false);
        });
    });

    describe('below minimum length tests', () => {
        const below = {
            name: '',
            role: `fdffd`,
            wechat: '',
            phone: '1310371807',
            baseId: [id, id2],
            password: 'dsfdsafads',
        }

        it('catches errors for if values are below minimum', async () => {
            try {
                await new Staff(below).save();
            } catch (err) {
                expect(Object.keys(err.errors).length).toBe(4);
                expect(err.errors['name'].message).toEqual(errCode.ppl_invalid_req);
                expect(err.errors['wechat'].message).toEqual(errCode.ppl_invalid_req);
                expect(err.errors['phone'].message).toEqual(errCode.staff_inval_phone);
                expect(err.errors['role'].message).toEqual("`fdffd` is not a valid enum value for path `role`.");
            }
        });
    });

    describe('above maximum length', () => {
        const below = {
            name: '123456789012312312312345678901',
            role: `${roles[0]}`,
            wechat: 'gfgfdsgdfgfdgfdgdfgfdgdfsgfdggf',
            phone: '1310371807120',
            baseId: [id, id2],
            password: 'dsfdsafadsgfdsgfdsgdfgfgf',
        }

        it('catches errors for if values are below minimum', async () => {
            try {
                await new Staff(below).save();
            } catch (err) {
                expect(Object.keys(err.errors).length).toBe(3);
                expect(err.errors['name'].message).toEqual(errCode.staff_inval_name_a);
                expect(err.errors['wechat'].message).toEqual(errCode.staff_wechat_invalid);
                expect(err.errors['phone'].message).toEqual(errCode.staff_inval_phone);
            }
        });
    });


    describe('required fields missing', () => {

        it('catches errors for if values are below minimum', async () => {
            try {
                await new Staff({}).save();
            } catch (err) {
                expect(Object.keys(err.errors).length).toBe(5);
                expect(err.errors['name'].message).toEqual(errCode.ppl_invalid_req);
                expect(err.errors['wechat'].message).toEqual(errCode.ppl_invalid_req);
                expect(err.errors['phone'].message).toEqual(errCode.ppl_invalid_req);
                expect(err.errors['password'].message).toEqual(errCode.ppl_invalid_req);
                expect(err.errors['role'].message).toEqual(errCode.ppl_invalid_req);
            }
        });
    });

    describe('miscellaneous tests', () => {
        describe('phone tests', () => {
            const phone = {
                name: 'david',
                role: `${roles[0]}`,
                wechat: 'fgdasfdfsda',
                baseId: [id, id2],
                password: 'dsfdsafads',
            }

            it('phone must be 11 characters, only numerical and begin with a 1', async () => {
                const res = await new Staff({ ...phone, phone: '13103718079' });
                expect(res).toHaveProperty('_id');
            });

            it('phone fails if contains anything but numerical characters', async () => {
                try {
                    await new Staff({ ...phone, phone: '1s10*718079' });
                }
                catch (err) {
                    expect(err.errors['phone']).toEqual('staff_inval_phone');
                }
            });

            it('phone fails if less than 11 characters', async () => {
                try {
                    await new Staff({ ...phone, phone: '110718079' });
                }
                catch (err) {
                    expect(err.errors['phone']).toEqual('staff_inval_phone');
                }
            });

            it('phone fails if more than 11 characters', async () => {
                try {
                    await new Staff({ ...phone, phone: '110712312318079' });
                }
                catch (err) {
                    expect(err.errors['phone']).toEqual('staff_inval_phone');
                }
            });

            it('phone fails if it doesnt begin with a 1', async () => {
                try {
                    await new Staff({ ...phone, phone: '33103718079' });
                }
                catch (err) {
                    expect(err.errors['phone']).toEqual('staff_inval_phone');
                }
            });
        });
    });
});