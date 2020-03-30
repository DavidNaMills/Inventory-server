require('../../Services/Authentication/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: true });
const superAdmin = require('../../Middleware/superAdmin/superAdmin');
const isAdmin = require('../../Middleware/isAdmin/isAdmin');
const staffController = require('../../Controllers/StaffController/StaffController');


module.exports = (app) => {

    app.get('/staff',
        requireAuth,
        isAdmin,
        staffController.fetchAllStaff
    );

    app.get('/staffLocations/:location',
        requireAuth,
        isAdmin,
        staffController.fetchAllLocationsStaff
    );

    app.post('/staff',
        requireAuth,
        isAdmin,
        staffController.addNewStaff
    );
    
    app.post('/staffAddSuper',
        superAdmin,
        staffController.addNewStaff
    );

    app.delete('/staff/:id',
        requireAuth,
        isAdmin,
        staffController.removeStaff
    );

    app.put('/staff/:id',
        requireAuth,
        staffController.updateStaff
    );

    app.put('/staff/:id/:block',
        requireAuth,
        isAdmin,
        staffController.blockStaff
    );
}