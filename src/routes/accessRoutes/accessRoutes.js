const passport = require('passport');
require('../../Services/Authentication/passport');
const isAdmin = require('../../Middleware/isAdmin/isAdmin');
const Authentication = require('../../Controllers/Authentication/Authentication');
const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: true });
const isBlocked = require('../../Middleware/isBlocked/isBlocked');

const staffController = require('../../Controllers/StaffController/StaffController');


module.exports = (app) => {
    app.post('/signup', requireAuth, isAdmin, staffController.addNewStaff);
    app.post('/login', requireSignin, isBlocked, Authentication.signin);
}